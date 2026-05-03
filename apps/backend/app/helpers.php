<?php

use App\Models\Setting;
use App\Models\PageContent;
use Illuminate\Support\Collection;


if (! function_exists('menu_name')) {
    /**
     * Retrieves the human-readable name of the Menu for a theme location.
     * @param string $locationKey The unique identifier for the menu slot (e.g., 'main_header').
     * @param string|null $defaultName An optional fallback name if the menu is created on the fly.
     * @return string The human-readable name of the menu.
     */

    function menu_name(string $locationKey, ?string $defaultName = null): string
    {
        // Resolve the service from the container and pass the optional default name
        return app(\App\Services\MenuService::class)->getMenuName($locationKey, $defaultName);
    }
}

if (! function_exists('menu_items')) {
    /**
     * Retrieves the menu structure for a theme location.
     * @param string $locationKey The unique identifier for the menu slot (e.g., 'main_header').
     * @return Collection The structured menu (Collection of items).
     */

    function menu_items(string $locationKey): Collection
    {
        // Resolve the service from the container and call the get method
        return app(\App\Services\MenuService::class)->get($locationKey);
    }
}

if (! function_exists('get_menus_list')) {
    /**
     * Retrieves a list of all Menu locations/names for the active theme.
     * @return Collection A collection of Menu models (Menu $location->title, $location->location_key).
     */
    function get_menus_list(): Collection
    {
        return app(\App\Services\MenuService::class)->getMenusList();
    }
}

if (!function_exists('themepages')) {
    function themepages(string $themeKey)
    {
        return PageContent::where('theme_key', $themeKey)
            ->select('page', 'theme_key') 
            ->groupBy('page', 'theme_key') 
            ->get();
    }
}


if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        $settings = \Illuminate\Support\Facades\Cache::rememberForever('settings_all', function () {
            return \App\Models\Setting::pluck('value', 'key')->toArray();
        });

        $value = \Illuminate\Support\Arr::get($settings, $key, $default);

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $value;
        }

        return $value;
    }
}


if (!function_exists('module_enabled')) {
    /**
     * Check if a marketplace module is enabled.
     * Defaults to enabled (true) if no setting exists yet.
     *
     * @param string $module  The module key (e.g. 'properties', 'autos', 'products')
     * @return bool
     */
    function module_enabled(string $module): bool
    {
        return (bool) setting('is_section.' . $module, '1');
    }
}


if (!function_exists('humanAmount')) {
    function humanAmount($amount)
    {
        if ($amount >= 1000000) {
            return number_format($amount / 1000000, 1) . 'M';
        } elseif ($amount >= 1000) {
            return number_format($amount / 1000, 1) . 'K';
        }
        return number_format($amount, 0);
    }
}




// app/helpers.php
if (!function_exists('page_content')) {
    /**
     * @param bool $raw If true, returns string even if user is admin (for meta tags/attributes)
     */
    function page_content(string $keyString, $default = null, bool $raw = false): mixed
    {
        $content = app(\App\Services\ContentService::class)->get($keyString, $default);
        
        if ($raw && is_object($content)) {
            return $content->value;
        }
        
        return $content;
    }
}


/**
 * Limit the length of a string and append an ellipsis (...).
 *
 * @param string $value The string to truncate.
 * @param int $limit The maximum allowed length (before adding the ellipsis).
 * @param string $end The string to append if truncation occurs (defaults to '...').
 * @return string
 */
if (!function_exists('str_limit')) {
    function str_limit(string $value, int $limit = 100, string $end = '...'): string
    {
        if (mb_strlen($value) <= $limit) {
            return $value;
        }

        // Use mb_substr for multibyte character support
        return mb_substr($value, 0, $limit) . $end;
    }
}



if (!function_exists('get_layout_direction')) {
    function get_layout_direction() {
        return in_array(app()->getLocale(), ['ar', 'he', 'fa']) ? 'rtl' : 'ltr';
    }
}

if (!function_exists('hexToRgb')) {
    function hexToRgb($hex) {
        $hex = str_replace("#", "", $hex);
        if(strlen($hex) == 3) {
            $r = hexdec(substr($hex,0,1).substr($hex,0,1));
            $g = hexdec(substr($hex,1,1).substr($hex,1,1));
            $b = hexdec(substr($hex,2,1).substr($hex,2,1));
        } else {
            $r = hexdec(substr($hex,0,2));
            $g = hexdec(substr($hex,2,2));
            $b = hexdec(substr($hex,4,2));
        }
        return "$r, $g, $b";
    }
}

