<?php

namespace App\Services\Admin;

use App\Models\Location;
use Illuminate\Support\Str;

/**
 * Class LocationManagementService
 *
 * Handles logic for administrative location operations.
 */
class LocationManagementService
{
    /**
     * Create or update a location with handled boolean flags.
     *
     * @param array $data
     * @param Location|null $location
     * @return Location
     */
    public function saveLocation(array $data, ?Location $location = null): Location
    {
        // Toggleable flags mapping
        $flags = [
            'status', 'is_property', 'is_event', 
            'is_job', 'is_auto', 'is_service', 'is_classified'
        ];

        foreach ($flags as $flag) {
            $data[$flag] = isset($data[$flag]) ? 1 : 0;
        }

        // Auto-generate slug
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($location) {
            $location->update($data);
            return $location;
        }

        return Location::create($data);
    }
}
