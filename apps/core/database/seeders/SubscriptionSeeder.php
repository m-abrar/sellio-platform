<?php

// database/seeders/SubscriptionSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Support\Carbon; // Import Carbon for date manipulation

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
        // Fetch all existing Users and Plans to link the subscriptions correctly.
        $users = User::all();
        $plans = Plan::all();

        // Guard clause: Ensure prerequisite data exists before attempting to seed subscriptions.
        if ($users->isEmpty() || $plans->isEmpty()) {
            $this->command->info('Skipping SubscriptionSeeder: Users or Plans table is empty. Please run UserSeeder and PlanSeeder first.');
            return;
        }

        // Iterate through each user to assign historical and current subscriptions.
        $users->each(function ($user) use ($plans) {
            
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

                    Subscription::factory()->create([
                        'user_id' => $user->id,
                        'plan_id' => $expiredPlan->id,
                        'title' => 'default_expired_' . $i, // Use a unique title for history subs
                        'starts_at' => $expiredStartsAt,
                        'ends_at' => $expiredEndsAt, // Subscription is expired since ends_at < now()
                    ]);
                }
            }
            
            // ------------------------------------------------
            // 2. ADD ONE ACTIVE SUBSCRIPTION (CURRENT)
            // ------------------------------------------------
            // Give 80% of users an active subscription (or an active one set to expire soon).
            if (mt_rand(1, 10) <= 8) {
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

                // For testing cancellation and renewal warning logic,
                // randomly set 30% of active subs to end within 1-2 weeks (future date).
                if (mt_rand(1, 10) <= 3) {
                    // This simulates a subscription that has been canceled and is running until the end of the current period.
                    $endsAt = now()->addDays(mt_rand(7, 14)); 
                }
                
                // If endsAt is null (auto-renew), refine the start date to simulate the exact beginning of the current cycle.
                if ($endsAt === null) {
                    $startsAt = match ($plan->billing_period) {
                        'monthly' => now()->subMonth(), // Current cycle started exactly 1 month ago
                        'annually' => now()->subYear(), // Current cycle started exactly 1 year ago
                        default => now()->subMonths(3), // Default to 3 months ago for other periods
                    };
                }


                Subscription::factory()->create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'title' => 'default', // The standard title for the current active subscription
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt, // Null means perpetual/auto-renewing
                ]);
            }
        });
        
        $this->command->info('✅ Subscription seeding complete! ' . Subscription::count() . ' subscriptions processed.');
    }
}