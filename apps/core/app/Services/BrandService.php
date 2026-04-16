<?php

namespace App\Services;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;

class BrandService
{
    /**
     * Get brands list filtered by module type and publishing status.
     */
    public function getBrandList(array $filters = []): Collection
    {
        // Your migration does not have parent_id, so we remove whereNull('parent_id')
        $query = Brand::query();

        // Filter by Module (e.g., passing ?type=is_auto in the request)
        if (!empty($filters['type'])) {
            $query->where($filters['type'], true);
        }

        // Filter by published status (default to true if not specified)
        if (isset($filters['is_published'])) {
            $query->where('is_published', $filters['is_published']);
        } else {
            $query->where('is_published', true);
        }

        // Eager load Spatie Media
        return $query->with(['media'])->get();
    }

    /**
     * Specific helper for Brand statistics.
     * Hierarchy methods removed as they aren't supported by the migration.
     */
    public function getBrandStats(Brand $brand): array
    {
        return [
            'created_at' => $brand->created_at ? $brand->created_at->toFormattedDateString() : null,
            'is_new'     => $brand->created_at ? $brand->created_at->gt(now()->subMonths(3)) : false,
        ];
    }
}
