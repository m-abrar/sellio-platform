<?php

use App\DTOs\ContentResult;
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
        if (! \Illuminate\Support\Facades\Schema::hasTable('page_contents')) {
            return collect();
        }

        return PageContent::where('theme_key', $themeKey)
            ->select('page', 'theme_key') 
            ->groupBy('page', 'theme_key') 
            ->get();
    }
}


if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        if (! \Illuminate\Support\Facades\Schema::hasTable('settings')) {
            return $default;
        }

        $settings = \Illuminate\Support\Facades\Cache::rememberForever('settings_all', function () {
            return \App\Models\Setting::pluck('value', 'key')->toArray();
        });

        $value = \Illuminate\Support\Arr::get($settings, $key, $default);

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $value = $decoded;
            }
        }

        if (is_array($value)) {
            return content_display($value, $default);
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


if (!function_exists('format_currency')) {
    function format_currency(mixed $amount, int $decimals = 2): string
    {
        if ($amount === null || $amount === '') {
            return '';
        }

        $symbol = setting_string('currency_symbol', '$');
        $position = setting_string('currency_position', 'left');
        $formatted = number_format((float) $amount, $decimals);

        return $position === 'right'
            ? "{$formatted}{$symbol}"
            : "{$symbol}{$formatted}";
    }
}

if (!function_exists('format_currency_compact')) {
    function format_currency_compact(mixed $amount, int $decimals = 1): string
    {
        if ($amount === null || $amount === '') {
            return '';
        }

        $value = (float) $amount;
        $suffix = '';

        if (abs($value) >= 1_000_000) {
            $value /= 1_000_000;
            $suffix = 'M';
        } elseif (abs($value) >= 1_000) {
            $value /= 1_000;
            $suffix = 'K';
        } else {
            $decimals = 2;
        }

        $symbol = setting_string('currency_symbol', '$');
        $position = setting_string('currency_position', 'left');
        $formatted = number_format($value, $decimals) . $suffix;

        return $position === 'right'
            ? "{$formatted}{$symbol}"
            : "{$symbol}{$formatted}";
    }
}



if (!function_exists('content_display')) {
    /**
     * Coerce CMS/settings values to a safe string for Blade e() / attributes.
     */
    function content_display(mixed $value, mixed $default = ''): string
    {
        if ($value instanceof ContentResult) {
            $value = $value->value;
        }

        if ($value === null) {
            return is_scalar($default) || $default === null
                ? (string) ($default ?? '')
                : content_display($default, '');
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        if (is_int($value) || is_float($value)) {
            return (string) $value;
        }

        if (is_string($value)) {
            return $value;
        }

        if (is_array($value)) {
            foreach ($value as $item) {
                if (is_scalar($item) && $item !== '') {
                    return (string) $item;
                }
            }

            $encoded = json_encode($value);

            return $encoded !== false ? $encoded : content_display($default, '');
        }

        if (is_object($value) && method_exists($value, '__toString')) {
            return (string) $value;
        }

        return is_scalar($default) ? (string) ($default ?? '') : content_display($default, '');
    }
}

if (!function_exists('page_content')) {
    /**
     * @param bool $raw If true, returns a display-safe string (meta tags/attributes)
     */
    function page_content(string $keyString, $default = null, bool $raw = false): mixed
    {
        $content = app(\App\Services\ContentService::class)->get($keyString, $default);

        if ($raw) {
            return content_display($content, $default);
        }

        return $content;
    }
}

if (!function_exists('page_content_string')) {
    function page_content_string(string $keyString, $default = null): string
    {
        return content_display(page_content($keyString, $default), $default);
    }
}

if (!function_exists('setting_string')) {
    function setting_string(string $key, mixed $default = ''): string
    {
        return content_display(setting($key, $default), $default);
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

