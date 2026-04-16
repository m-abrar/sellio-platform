<?php

namespace App\Services;

use App\Models\Amenity;
use Illuminate\Database\Eloquent\Collection;

class AmenityService
{
    /**
     * Get amenities filtered by module flag and publishing status.
     */
    public function getAmenityList(array $filters = []): Collection
    {
        $query = Amenity::query();

        // Filter by Module (e.g., ?type=is_property)
        if (!empty($filters['type'])) {
            $query->where($filters['type'], true);
        }

        // Filter by Published status
        if (isset($filters['is_published'])) {
            $query->where('is_published', $filters['is_published']);
        } else {
            // Default to published only if not specified
            $query->where('is_published', true);
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        // Eager load Spatie Media
        return $query->with(['media'])->get();
    }
}
