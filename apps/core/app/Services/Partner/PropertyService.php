<?php

namespace App\Services\Partner;

use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Facades\DB;

/**
 * Class PropertyService
 * Handles business logic for Partner Properties including plan limit checks.
 */
class PropertyService
{
    /**
     * Check if the user can create a new property based on their plan.
     *
     * @param User $user
     * @return bool
     */
    public function canCreateProperty(User $user): bool
    {
        $plan = $user->getPlan();
        $currentCount = $user->properties()->where('is_published', true)->count();
        $maxLimit = (int) ($plan->max_listings ?? 1);

        return $currentCount < $maxLimit;
    }

    /**
     * Check if the user can feature a property.
     *
     * @param User $user
     * @return bool
     */
    public function canFeatureProperty(User $user): bool
    {
        $plan = $user->getPlan();
        $featuredCount = $user->properties()->where('is_featured', true)->count();
        $maxFeatured = (int) ($plan->max_featured_listings ?? 0);

        return $featuredCount < $maxFeatured;
    }

    /**
     * Store or Update property with amenities.
     *
     * @param User $user
     * @param array $data
     * @param Property|null $property
     * @return Property
     */
    public function saveProperty(User $user, array $data, ?Property $property = null): Property
    {
        return DB::transaction(function () use ($user, $data, $property) {
            if ($property) {
                $property->update($data);
            } else {
                $property = $user->properties()->create($data);
            }

            if (isset($data['amenities'])) {
                $property->amenities()->sync($data['amenities']);
            }

            return $property;
        });
    }
}
