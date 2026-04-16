<?php

namespace App\Services\Partner;

use App\Models\PropertyVisit;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class PropertyVisitService
 * Handles the business logic for managing property visits for partners.
 */
class PropertyVisitService
{
    /**
     * Fetch all visits for properties owned by a specific user.
     *
     * @param User $user
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPartnerVisits(User $user, int $perPage = 10): LengthAwarePaginator
    {
        $propertyIds = $user->properties()->pluck('id');

        return PropertyVisit::whereIn('property_id', $propertyIds)
            ->with(['property', 'user'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Verify if a property visit belongs to a partner's property.
     *
     * @param User $user
     * @param PropertyVisit $propertyVisit
     * @return bool
     */
    public function authorizeVisit(User $user, PropertyVisit $propertyVisit): bool
    {
        return $user->properties()->where('id', $propertyVisit->property_id)->exists();
    }
}
