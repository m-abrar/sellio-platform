<?php

namespace App\Menu\Filters;

use JeroenNoten\LaravelAdminLte\Menu\Filters\FilterInterface;

class ModuleFilter implements FilterInterface
{
    /**
     * Transforms a menu item before it is rendered.
     *
     * @param array $item
     * @return array|bool Returns the item array or false to hide it
     */
    public function transform($item)
    {
        // Check if the item has a 'module' attribute defined
        if (isset($item['module'])) {
            $module = $item['module'];

            // If the module is disabled, return false to hide the menu item
            if (!module_enabled($module)) {
                return false;
            }
        }

        return $item;
    }
}
