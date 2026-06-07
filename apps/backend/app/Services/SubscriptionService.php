<?php

namespace App\Services;

use App\Events\PlanAboutToExpire;
use App\Events\PlanExpired;
use App\Events\PlanSubscribed;
use App\Events\PlanUpgraded;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            throw new Exception("You are already subscribed to the **{$plan->title}** plan.");
        }

        DB::transaction(function () use ($user, $plan, $currentSubscription) {
            if ($currentSubscription) {
                // Expire current one
                $currentSubscription->forceFill([
                    'title' => 'expired_' . $currentSubscription->id . '_' . now()->format('YmdHis'),
                    'ends_at' => now(),
                    'status' => Subscription::STATUS_EXPIRED,
                ])->save();
            }

            $newStartsAt = now();
            $newEndsAt = match ($plan->billing_period) {
                'monthly' => $newStartsAt->copy()->addMonth(),
                'annually' => $newStartsAt->copy()->addYear(),
                default => null,
            };

            $newSubscription = new Subscription([
                'plan_id'   => $plan->id,
                'title'     => 'default',
                'starts_at' => $newStartsAt,
            ]);
            $newSubscription->user_id = $user->id;
            $newSubscription->ends_at = $newEndsAt;
            $newSubscription->status  = 'active';
            $newSubscription->save();

            $payment = new Payment([
                'currency'       => 'USD',      
                'transaction_id' => 'TRN-' . \Str::uuid(),
                'payment_method' => 'credit_card', 
                'paid_at'        => now(),
                'payable_type'   => Subscription::class, 
                'payable_id'     => $newSubscription->id,
            ]);
            $payment->user_id = $user->id;
            $payment->amount  = $plan->price;
            $payment->status  = 'completed';
            $payment->save();
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
    /**
     * Dispatch reminders for subscriptions expiring within a specific window.
     * Optimized with chunking for large-scale operations.
     */
    public function dispatchRenewalReminders(int $daysAhead = 7): int
    {
        $targetDate = Carbon::now()->addDays($daysAhead)->setTime(0, 0, 0);
        $targetEndDate = $targetDate->copy()->endOfDay();
        $processedCount = 0;

        Subscription::with('user', 'plan')
            ->where('title', 'default')
            ->where('status', Subscription::STATUS_ACTIVE)
            ->whereNotNull('ends_at')
            ->whereBetween('ends_at', [$targetDate, $targetEndDate])
            ->chunkById(100, function ($subscriptions) use (&$processedCount) {
                foreach ($subscriptions as $subscription) {
                    if ($subscription->user && $subscription->plan) {
                        PlanAboutToExpire::dispatch($subscription->user, $subscription);
                        $processedCount++;
                    }
                }
            });

        return $processedCount;
    }

    /**
     * Expire subscriptions past their end date and notify affected users.
     */
    public function dispatchExpiredSubscriptions(): int
    {
        $processedCount = 0;

        Subscription::with('user', 'plan')
            ->where('title', 'default')
            ->where('status', Subscription::STATUS_ACTIVE)
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->chunkById(100, function ($subscriptions) use (&$processedCount) {
                foreach ($subscriptions as $subscription) {
                    if (!$subscription->user || !$subscription->plan) {
                        continue;
                    }

                    $subscription->forceFill([
                        'status' => Subscription::STATUS_EXPIRED,
                        'title' => 'expired_' . $subscription->id . '_' . now()->format('YmdHis'),
                    ])->save();

                    PlanExpired::dispatch($subscription->user, $subscription->plan);
                    $processedCount++;
                }
            });

        return $processedCount;
    }
}
