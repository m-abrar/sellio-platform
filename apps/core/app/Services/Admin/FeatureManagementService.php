<?php

namespace App\Services\Admin;

use App\Models\Feature;
use Illuminate\Support\Str;

/**
 * Class FeatureManagementService
 *
 * Handles logic for administrative feature operations across modules.
 */
class FeatureManagementService
{
    /**
     * Create or update a feature with handled boolean flags and auto-slugging.
     *
     * @param array $data
     * @param Feature|null $feature
     * @return Feature
     */
    public function saveFeature(array $data, ?Feature $feature = null): Feature
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

        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($feature) {
            $feature->update($data);
            return $feature;
        }

        return Feature::create($data);
    }
}
