<?php

namespace App\Services\Admin;

use App\Models\Subscription;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

/**
 * Class SubscriptionManagementService
 * Orchestrates administrative oversight for user subscriptions, coordinating 
 * plan assignments, renewal cycles, and platform access control.
 */
class SubscriptionManagementService
{
    /**
     * Get paginated subscriptions with filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getSubscriptions(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Subscription::query()
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['user'] ?? null, function ($query, $user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('name', 'like', '%' . $user . '%');
                });
            })
            ->with(['user', 'plan'])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Manually extend the subscription duration by one month.
     *
     * @param Subscription $subscription
     * @return bool
     */
    public function renewSubscription(Subscription $subscription): bool
    {
        // Standardize renewal window to 1 month from current expiry or today
        $newEndsAt = $subscription->ends_at ? 
                        Carbon::parse($subscription->ends_at)->addMonth() : 
                        now()->addMonth();
        
        return $subscription->update([
            'ends_at' => $newEndsAt,
            'status'  => Subscription::STATUS_ACTIVE,
        ]);
    }

    /**
     * Store a newly created subscription and initialize its platform access.
     *
     * @param array $data
     * @return Subscription
     */
    public function createSubscription(array $data): Subscription
    {
        return Subscription::create($data);
    }

    /**
     * Update an existing subscription configuration and synchronize access parameters.
     *
     * @param Subscription $subscription
     * @param array $data
     * @return bool
     */
    public function updateSubscription(Subscription $subscription, array $data): bool
    {
        return $subscription->update($data);
    }

    /**
     * Remove a subscription record and terminate associated platform access.
     *
     * @param Subscription $subscription
     * @return bool|null
     */
    public function deleteSubscription(Subscription $subscription): ?bool
    {
        return $subscription->delete();
    }
}
