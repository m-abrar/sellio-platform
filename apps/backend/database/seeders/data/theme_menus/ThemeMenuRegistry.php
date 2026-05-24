<?php

namespace Database\Seeders\Data\ThemeMenus;

class ThemeMenuRegistry
{
    public static function all(): array
    {
        require_once __DIR__.'/helpers.php';

        return array_merge(
            require __DIR__.'/unifieds.php',
            require __DIR__.'/ecommerce.php',
            require __DIR__.'/properties.php',
            require __DIR__.'/autos.php',
            require __DIR__.'/events.php',
            require __DIR__.'/jobs.php',
            require __DIR__.'/services.php',
            require __DIR__.'/classifieds.php',
        );
    }

    public static function themeKeys(): array
    {
        return array_keys(self::all());
    }

    public static function locationKeysForTheme(string $themeKey): array
    {
        $theme = self::all()[$themeKey] ?? [];

        return array_column($theme, 'location_key');
    }

    public static function allLocationKeys(): array
    {
        $keys = [];

        foreach (self::all() as $menus) {
            foreach ($menus as $menu) {
                $keys[$menu['location_key']] = true;
            }
        }

        return array_keys($keys);
    }
}
