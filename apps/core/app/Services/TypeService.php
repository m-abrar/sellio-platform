<?php

namespace App\Services;

use App\Models\Type;
use Illuminate\Database\Eloquent\Collection;

class TypeService
{
    /**
     * Get types filtered by module flag and publishing status.
     */
    public function getTypeList(array $filters = []): Collection
    {
        $query = Type::query();

        // Filter by Module (e.g., ?type=is_property)
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

    /**
     * Get related counts or metadata for a specific type.
     */
    public function getRelatedCount(Type $type): int
    {
        return $type->listings_count ?? 0;
    }
}
