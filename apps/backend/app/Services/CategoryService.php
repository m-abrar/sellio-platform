<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * Get categories formatted as a tree.
     */
    public function getCategoryTree(array $filters = []): Collection
    {
        $query = Category::query()->whereNull('parent_id')->active();

        // Filter by Module (e.g., ?type=is_property)
        if (!empty($filters['type'])) {
            $query->where($filters['type'], true);
        }

        return $query->with(['childrenRecursive', 'media'])->get();
    }

    /**
     * Generate simple breadcrumbs for the category.
     */
    public function getBreadcrumbs(Category $category): array
    {
        $breadcrumbs = [];
        $current = $category;

        while ($current) {
            array_unshift($breadcrumbs, [
                'title' => $current->title,
                'slug'  => $current->slug
            ]);
            $current = $current->parent;
        }

        return $breadcrumbs;
    }
}
