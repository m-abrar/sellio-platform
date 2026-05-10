<?php

namespace App\Services\Admin;

use App\Models\SubscriptionQuota;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class QuotaManagementService
 * Orchestrates administrative oversight for subscription resource usage, coordinating 
 * consumption tracking for listings, featured slots, and manual quota reconciliations.
 */
class QuotaManagementService
{
    /**
     * Get paginated subscription usage quotas with filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getQuotas(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return SubscriptionQuota::with(['subscription.plan', 'subscription.user'])
            ->when($filters['user_id'] ?? null, function ($q, $userId) {
                $q->whereHas('subscription.user', function($inner) use ($userId) {
                    $inner->where('id', $userId);
                });
            })
            ->when($filters['plan_id'] ?? null, function ($q, $planId) {
                $q->whereHas('subscription.plan', function($inner) use ($planId) {
                    $inner->where('id', $planId);
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Update the resource consumption metrics for a specific subscription.
     *
     * @param SubscriptionQuota $quota
     * @param array $data
     * @return bool
     */
    public function updateUsage(SubscriptionQuota $quota, array $data): bool
    {
        return $quota->update($data);
    }

    /**
     * Reset the resource consumption metrics to zero for the specific subscription.
     *
     * @param SubscriptionQuota $quota
     * @return bool
     */
    public function resetUsage(SubscriptionQuota $quota): bool
    {
        return $quota->update([
            'listings_used' => 0,
            'featured_used' => 0,
        ]);
    }
}
