<?php

namespace App\Services;

class SmartSearchUrlBuilder
{
    private const MODULE_ROUTES = [
        'properties' => ['route' => 'properties.search', 'params' => ['q', 'location', 'category', 'max_price', 'min_price', 'property_type', 'bedrooms']],
        'autos'      => ['route' => 'autos.search',      'params' => ['make', 'location', 'category', 'type', 'transmission', 'max_price', 'min_price']],
        'events'     => ['route' => 'events.search',     'params' => ['search', 'location', 'category', 'date']],
        'services'   => ['route' => 'services.search',   'params' => ['search', 'location', 'category_id', 'min_price', 'max_price']],
        'classifieds'=> ['route' => 'classifieds.search','params' => ['search', 'location', 'category', 'min_price', 'max_price']],
        'jobs'       => ['route' => 'jobs.search',       'params' => ['search', 'location', 'category', 'workplace_type']],
        'products'   => ['route' => 'products.search',   'params' => ['q', 'location', 'category', 'min_price', 'max_price']],
        'blogs'      => ['route' => 'blogs.search',      'params' => ['search', 'category', 'sort']],
    ];

    public function build(string $module, array $filters): ?string
    {
        $module = strtolower(trim($module));

        if (! isset(self::MODULE_ROUTES[$module])) {
            return null;
        }

        $config = self::MODULE_ROUTES[$module];
        $allowed = array_flip($config['params']);
        $query = array_filter(
            array_intersect_key($filters, $allowed),
            fn($v) => $v !== null && $v !== ''
        );

        try {
            return route($config['route'], $query);
        } catch (\Throwable) {
            return null;
        }
    }

    public function supportedModules(): array
    {
        return array_keys(self::MODULE_ROUTES);
    }
}
