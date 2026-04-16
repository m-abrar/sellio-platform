<?php

namespace App\Services;

use App\Models\Feature;
use Illuminate\Database\Eloquent\Collection;

class FeatureService
{
    /**
     * Get features filtered by module flag and publishing status.
     */
    public function getFeatureList(array $filters = []): Collection
    {
        $query = Feature::query();

        // Filter by Module (e.g., ?type=is_auto)
        if (!empty($filters['type'])) {
            $query->where($filters['type'], true);
        }

        // Filter by Published status
        if (isset($filters['is_published'])) {
            $query->where('is_published', $filters['is_published']);
        } else {
            $query->where('is_published', true);
        }

        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        // Eager load Spatie Media
        return $query->with(['media'])->get();
    }
}
