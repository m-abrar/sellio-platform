<?php

namespace App\Services;

use App\Models\Location;
use Illuminate\Database\Eloquent\Collection;

class LocationService
{
    /**
     * Get locations filtered by module type and status.
     */
    public function getLocationList(array $filters = []): Collection
    {
        $query = Location::query();

        // Filter by Module Flag (e.g., passing 'is_auto' as 'type')
        if (!empty($filters['type'])) {
            $query->where($filters['type'], true);
        }

        // Filter by Published status
        if (isset($filters['is_published'])) {
            $query->where('is_published', $filters['is_published']);
        } else {
            $query->where('is_published', true);
        }

        // Filter by Featured status
        if (isset($filters['is_featured'])) {
            $query->where('is_featured', $filters['is_featured']);
        }

        // Search by title, state, or country
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('state', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('country', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Eager load Spatie Media
        return $query->with(['media'])->get();
    }

    /**
     * Get simple statistics for the location.
     */
    public function getLocationStats(Location $location): array
    {
        return [
            'has_coords' => !empty($location->latitude) && !empty($location->longitude),
            'full_address' => trim("{$location->state} {$location->zip_code} {$location->country}"),
        ];
    }
}
