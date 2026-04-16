<?php

namespace App\Services\Admin;

use App\Models\Type;
use Illuminate\Support\Str;

/**
 * Class TypeManagementService
 *
 * Handles logic for administrative listing types.
 */
class TypeManagementService
{
    /**
     * Create or update a type with handled boolean flags.
     *
     * @param array $data
     * @param Type|null $type
     * @return Type
     */
    public function saveType(array $data, ?Type $type = null): Type
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

        if ($type) {
            $type->update($data);
            return $type;
        }

        return Type::create($data);
    }
}
