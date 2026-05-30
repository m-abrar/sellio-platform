<?php

namespace App\Services\Admin;

use App\Models\Plan;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * Class PlanManagementService
 * Orchestrates the administrative lifecycle of subscription plans, coordinating 
 * pricing tiers, resource quotas, and specialized feature access.
 */
class PlanManagementService
{
    /**
     * Get paginated plans with filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPlans(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Plan::query()
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', '%' . $search . '%')
                          ->orWhere('description', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['billing_period'] ?? null, function ($q, $period) {
                if (in_array($period, ['monthly', 'annually'])) {
                    $q->where('billing_period', $period);
                }
            })
            ->orderBy('price', 'asc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new subscription plan and normalize its quota parameters.
     *
     * @param array $data
     * @return Plan
     */
    public function createPlan(array $data): Plan
    {
        $data = $this->normalizeData($data);
        return Plan::create($data);
    }

    /**
     * Update an existing subscription plan and synchronize its resource quotas.
     *
     * @param Plan $plan
     * @param array $data
     * @return bool
     */
    public function updatePlan(Plan $plan, array $data): bool
    {
        $data = $this->normalizeData($data);
        return $plan->update($data);
    }

    /**
     * Remove a subscription plan from the marketplace.
     *
     * @param Plan $plan
     * @return bool|null
     */
    public function deletePlan(Plan $plan): ?bool
    {
        return $plan->delete();
    }

    /**
     * Normalize plan data, ensuring proper boolean casting and nullification of unlimited quotas.
     *
     * @param array $data
     * @return array
     */
    protected function normalizeData(array $data): array
    {
        // Boolean normalization for consistent database persistence
        $booleanFields = [
            'is_active', 
            'is_featured', 
            'is_popular', 
            'priority_support', 
            'custom_branding'
        ];

        foreach ($booleanFields as $field) {
            $data[$field] = isset($data[$field]) && (bool)$data[$field];
        }

        // Normalize empty quotas to NULL for "Unlimited" handling
        $quotaFields = [
            'max_listings', 
            'max_featured_listings', 
            'max_addons'
        ];

        foreach ($quotaFields as $field) {
            if (isset($data[$field]) && ($data[$field] === '' || $data[$field] === null)) {
                $data[$field] = null;
            }
        }

        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        return $data;
    }
}
