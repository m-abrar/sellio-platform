<?php

namespace App\Services;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

class TagService
{
    /**
     * Get tags filtered by module flag and publishing status.
     */
    public function getTagList(array $filters = []): Collection
    {
        $query = Tag::query();

        // Filter by Module (e.g., ?type=is_blog)
        if (!empty($filters['type'])) {
            $query->where($filters['type'], true);
        }

        // Filter by Published status
        if (isset($filters['is_published'])) {
            $query->where('is_published', $filters['is_published']);
        } else {
            $query->where('is_published', true);
        }

        // Filter by Search
        if (!empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        // Eager load Spatie Media
        return $query->with(['media'])->get();
    }
}
