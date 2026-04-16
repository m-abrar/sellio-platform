<?php

namespace App\Services\Admin;

use App\Models\Category;
use Illuminate\Support\Str;

/**
 * Class CategoryManagementService
 *
 * Handles logic for administrative category operations.
 */
class CategoryManagementService
{
    /**
     * Create or update a category with handled boolean flags.
     *
     * @param array $data
     * @param Category|null $category
     * @return Category
     */
    public function saveCategory(array $data, ?Category $category = null): Category
    {
        // Define all toggleable flags with module enforcement bypass
        $flags = [
            'is_published', 'is_property', 'is_event', 
            'is_job', 'is_auto', 'is_service', 'is_classified', 'is_product'
        ];

        $moduleMap = [
            'is_property'   => 'properties',
            'is_event'      => 'events',
            'is_job'        => 'jobs',
            'is_auto'       => 'autos',
            'is_service'    => 'services',
            'is_classified' => 'classifieds',
            'is_product'    => 'products',
        ];

        foreach ($flags as $flag) {
            $moduleKey = $moduleMap[$flag] ?? null;

            if ($moduleKey && !module_enabled($moduleKey)) {
                unset($data[$flag]);
                continue;
            }

            $data[$flag] = isset($data[$flag]) ? 1 : 0;
        }

        // Auto-generate slug if name is present but slug is empty
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($category) {
            $category->update($data);
            return $category;
        }

        return Category::create($data);
    }
}
