<?php

namespace App\Services\Admin;

use App\Models\Brand;
use Illuminate\Support\Str;

/**
 * Class BrandManagementService
 *
 * Handles logic for administrative brand operations.
 */
class BrandManagementService
{
    /**
     * Create or update a brand with handled boolean flags.
     *
     * @param array $data
     * @param Brand|null $brand
     * @return Brand
     */
    public function saveBrand(array $data, ?Brand $brand = null): Brand
    {
        // Handle boolean toggles with module enforcement bypass
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

        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($brand) {
            $brand->update($data);
            return $brand;
        }

        return Brand::create($data);
    }
}
