<?php

namespace App\Services\Admin;

use App\Models\Tag;
use Illuminate\Support\Str;

/**
 * Class TagManagementService
 *
 * Handles administrative operations for global listing tags.
 */
class TagManagementService
{
    /**
     * Create or update a tag with handled module flags and auto-slugging.
     *
     * @param array $data
     * @param Tag|null $tag
     * @return Tag
     */
    public function saveTag(array $data, ?Tag $tag = null): Tag
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

        if ($tag) {
            $tag->update($data);
            return $tag;
        }

        return Tag::create($data);
    }
}
