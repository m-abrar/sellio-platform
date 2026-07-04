<?php

// database/seeders/SubscriptionSeeder.php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Class SubscriptionSeeder
 *
 * Seeds the 'subscriptions' table with realistic, randomized data for existing
 * users. This includes simulating historical (expired) subscriptions and current
 * (active) subscriptions, useful for testing billing interfaces and history logs.
 */
class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('📩 Starting Subscription Seeder...');
            DB::table('subscriptions')->delete();
            $this->command->line('  🗑️ Cleared existing subscriptions.');
        }

        // Fetch all existing Users and Plans to link the subscriptions correctly.
        $plans = Plan::all();

        if ($plans->isEmpty()) {
            $this->command?->warn('No plans found. Skipping subscription seeding.');
            return;
        }

        $stableDemoEmails = [
            'admin@sellio.buzz',
            'partner@sellio.buzz',
            'buyer@sellio.buzz',
        ];
        
        // Performance: Use chunkById to prevent memory exhaustion when seeding large user bases
        User::orderBy('id')->chunkById(100, function ($users) use ($plans, $stableDemoEmails) {
            $users->each(function ($user) use ($plans, $stableDemoEmails) {
            
            // ------------------------------------------------
            // 1. ADD 1-2 PREVIOUSLY EXPIRED SUBSCRIPTIONS (HISTORY)
            // ------------------------------------------------
            // Give about 50% of users a history of expired subscriptions (mt_rand(1, 10) <= 5).
            if (mt_rand(1, 10) <= 5) {
                
                // Determine how many expired subs to create (1 or 2)
                $expiredCount = mt_rand(1, 2); 

                for ($i = 0; $i < $expiredCount; $i++) {
                    $expiredPlan = $plans->random();
                    
                    // Set the end date to be in the past (1 to 12 months ago).
                    $expiredEndsAt = now()->subMonths(mt_rand(1, 12))->subDays(mt_rand(1, 30));
                    
                    // Set the start date to be before the end date (1 to 6 months before expiry).
                    $expiredStartsAt = $expiredEndsAt->copy()->subMonths(mt_rand(1, 6));

                    Subscription::create([
                        'user_id' => $user->id,
                        'plan_id' => $expiredPlan->id,
                        'title' => 'default_expired_' . $i, // Use a unique title for history subs
                        'status' => 'expired',
                        'admin_note' => 'Historical record.',
                        'starts_at' => $expiredStartsAt,
                        'ends_at' => $expiredEndsAt, // Subscription is expired since ends_at < now()
                    ]);
                }
            }
            
            // ------------------------------------------------
            // 2. ADD ONE ACTIVE SUBSCRIPTION (CURRENT)
            // ------------------------------------------------
            // Give 80% of users an active subscription (or an active one set to expire soon).
            if (!in_array($user->email, $stableDemoEmails, true) && mt_rand(1, 10) <= 8) {
                $plan = $plans->random();
                
                // Determine the original start date (between 1 and 6 months ago)
                $startsAt = now()->subMonths(mt_rand(1, 6)); 

                // Determine a realistic end date based on the plan's billing period.
                $endsAt = match ($plan->billing_period) {
                    // Set end date slightly past the next billing cycle for monthly plans
                    'monthly' => now()->addMonth()->addDays(mt_rand(-7, 7)), 
                    // Set end date slightly past the next billing cycle for annual plans
                    'annually' => now()->addYear()->addDays(mt_rand(-7, 7)),
                    // Set to null for subscriptions that are truly auto-renewing until explicitly canceled
                    default => null, 
                };

                // For testing cancellation, renewal warning, and pending state logic,
                // randomly set status to diverse states.
                $status = Subscription::STATUS_ACTIVE;
                $dice = mt_rand(1, 10);
                
                if ($dice <= 2) {
                    // 20% Canceled: Running until period end
                    $endsAt = now()->addDays(mt_rand(7, 14)); 
                    $status = Subscription::STATUS_CANCELLED;
                } elseif ($dice === 3) {
                    // 10% Pending: Awaiting payment/initialization
                    $status = Subscription::STATUS_PENDING;
                } elseif ($dice === 4) {
                    // 10% Past Due: Payment collection failure
                    $status = Subscription::STATUS_PAST_DUE;
                }
                
                // If endsAt is null (auto-renew), refine the start date to simulate the exact beginning of the current cycle.
                if ($endsAt === null) {
                    $startsAt = match ($plan->billing_period) {
                        'monthly' => now()->subMonth(), // Current cycle started exactly 1 month ago
                        'annually' => now()->subYear(), // Current cycle started exactly 1 year ago
                        default => now()->subMonths(3), // Default to 3 months ago for other periods
                    };
                }


                Subscription::create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'title' => 'default', // The standard title for the current active subscription
                    'status' => $status,
                    'admin_note' => 'Current active plan.',
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt, // Null means perpetual/auto-renewing
                ]);
            }
        });
    });

        $this->seedDemoPartnerSubscription($plans);
        
        $this->command->info('✅ Subscription seeding complete! ' . Subscription::count() . ' subscriptions processed.');
    }

    private function seedDemoPartnerSubscription($plans): void
    {
        $partner = User::where('email', 'partner@sellio.buzz')->first();

        if (!$partner) {
            $this->command?->warn('Demo partner user not found. Skipping deterministic partner subscription.');
            return;
        }

        $plan = $plans->firstWhere('title', 'Enterprise Plan')
            ?? $plans->where('is_active', true)->sortByDesc('max_listings')->first()
            ?? $plans->sortByDesc('max_listings')->first();

        if (!$plan) {
            $this->command?->warn('No usable demo partner plan found. Skipping deterministic partner subscription.');
            return;
        }

        Subscription::updateOrCreate(
            [
                'user_id' => $partner->id,
                'title' => 'default',
            ],
            [
                'plan_id' => $plan->id,
                'status' => Subscription::STATUS_ACTIVE,
                'starts_at' => now()->subMonth(),
                'ends_at' => null,
            ]
        );

        $this->command?->info("  - Demo partner assigned active {$plan->title} subscription.");
    }
}
