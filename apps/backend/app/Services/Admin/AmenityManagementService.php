<?php

namespace App\Services\Admin;

use App\Models\Amenity;
use Illuminate\Support\Str;

/**
 * Class AmenityManagementService
 *
 * Handles logic for administrative amenity operations.
 */
class AmenityManagementService
{
    /**
     * Create or update an amenity with handled boolean flags and slugging.
     *
     * @param array $data
     * @param Amenity|null $amenity
     * @return Amenity
     */
    public function saveAmenity(array $data, ?Amenity $amenity = null): Amenity
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

        // Handle auto-slugging
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($amenity) {
            $amenity->update($data);
            return $amenity;
        }

        return Amenity::create($data);
    }
}
