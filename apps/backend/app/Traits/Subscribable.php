<?php

namespace App\Traits;

use App\Models\Plan;
use App\Models\Subscription; 

trait Subscribable
{
    /**
     * Get the active subscription plan object.
     * Assumes the model (e.g., User) has a 'subscription' relationship to the Subscription model.
     */
    public function getPlan(): ?Plan
    {
        // Use optional chaining to safely access the plan through the subscription relationship
        return $this->subscription?->plan;
    }

    /**
     * Check if the user is on a specific plan name (e.g., 'Pro Plan').
     */
    public function onPlan(string $planName): bool
    {
        return $this->getPlan()?->title === $planName;
    }

    /**
     * Check if the user has access to a specific feature or limit.
     * * Since features are now individual columns on the Plan model, 
     * this method checks the property directly.
     * * @param string $feature The plan column name (e.g., 'max_listings', 'priority_support').
     * @param mixed $value The value to check against (e.g., 5, or true).
     * @return bool
     */
    public function subscribesTo(string $feature, $value = true): bool
    {
        $plan = $this->getPlan();

        // If no active plan, return false
        if (!$plan) {
            return false;
        }

        // Check if the plan actually has the property (column)
        if (!property_exists($plan, $feature) && !isset($plan->$feature)) {
            // The requested feature is not a column on the Plan model
            return false;
        }

        $planValue = $plan->$feature;

        // 1. Check for simple boolean features (e.g., 'priority_support' => true)
        if (is_bool($value)) {
            // Use strict comparison for booleans
            return (bool)$planValue === $value;
        }

        // 2. Check for numerical limits (e.g., 'max_listings' >= 5)
        // Ensure both values are treated as integers for comparison
        return (int)$planValue >= (int)$value;
    }
    
    // The getPlanFeatures() method is removed as features are no longer in a single array.


    /**
     * Check if the user currently has an active, non-expired subscription.
     */
    public function isSubscribed(): bool
    {
        $cacheKey = "user_subscribed_{$this->id}";
        
        return cache()->remember($cacheKey, now()->addMinutes(15), function () {
            return $this->subscription()
                        ->where(function ($query) {
                            $query->whereNull('ends_at')
                                  ->orWhere('ends_at', '>', now());
                        })
                        ->exists();
        });
    }

    /**
     * Get details of listings usage across all verticals.
     */
    public function getListingUsageDetails(): array
    {
        return [
            'properties' => (int) $this->properties()->count(),
            'autos' => (int) $this->autos()->count(),
            'events' => (int) $this->events()->count(),
            'jobs' => (int) $this->jobs()->count(),
            'services' => (int) $this->services()->count(),
            'classifieds' => (int) $this->classifieds()->count(),
            'products' => (int) $this->products()->count(),
        ];
    }

    /**
     * Check if the user has reached or exceeded their active subscription listing limits.
     */
    public function hasReachedListingLimit(): bool
    {
        $plan = $this->getPlan();
        if (!$plan) {
            return true; // No active plan = cannot create listings
        }

        $maxLimit = (int) ($plan->max_listings ?? 0);
        if ($maxLimit === 999) {
            return false; // Unlimited listing limit
        }

        $usage = $this->getListingUsageDetails();
        $totalListings = array_sum($usage);

        return $totalListings >= $maxLimit;
    }
}

