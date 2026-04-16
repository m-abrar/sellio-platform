<?php

namespace App\Services;

use App\Models\{Subscription, Plan, Payment, User};
use App\Events\{PlanSubscribed, PlanUpgraded};
use Illuminate\Support\Facades\{DB, Log};

class SubscriptionService
{
    /**
     * Subscribe a user to a plan, handling upgrades/downgrades and payments.
     *
     * @param User $user
     * @param Plan $plan
     * @return array Contains status and message.
     * @throws \Exception
     */
    public function subscribe(User $user, Plan $plan): array
    {
        $currentSubscription = $user->subscriptions()->with('plan')->first();
        $isUpgradeOrChange = $currentSubscription !== null;
        $oldPlan = $currentSubscription->plan ?? null;

        if ($isUpgradeOrChange && $currentSubscription->plan_id == $plan->id && $currentSubscription->ends_at === null) {
            throw new \Exception("You are already subscribed to the **{$plan->title}** plan.");
        }

        DB::transaction(function () use ($user, $plan, $currentSubscription) {
            if ($currentSubscription) {
                // Expire current one
                $currentSubscription->update([
                    'title' => 'expired_' . $currentSubscription->id . '_' . now()->format('YmdHis'),
                    'ends_at' => now(),
                ]);
            }

            $newStartsAt = now();
            $newEndsAt = match ($plan->billing_period) {
                'monthly' => $newStartsAt->copy()->addMonth(),
                'annually' => $newStartsAt->copy()->addYear(),
                default => null,
            };

            $newSubscription = Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'title'    => 'default',
                'starts_at' => $newStartsAt,
                'ends_at' => $newEndsAt, 
            ]);

            Payment::create([
                'user_id' => $user->id,
                'amount' => $plan->price, 
                'currency' => 'USD',      
                'transaction_id' => 'TRN-' . \Str::uuid(),
                'payment_method' => 'credit_card', 
                'status' => 'completed',
                'paid_at' => now(),
                'payable_type' => Subscription::class, 
                'payable_id' => $newSubscription->id,
            ]);
        });

        if ($isUpgradeOrChange) {
            PlanUpgraded::dispatch($user, $oldPlan, $plan);
            $message = "Success! Your subscription has been **upgraded** to the **{$plan->title}** plan.";
        } else {
            PlanSubscribed::dispatch($user, $plan);
            $message = "Success! You are now subscribed to the **{$plan->title}** plan.";
        }

        return ['success' => true, 'message' => $message];
    }
}
