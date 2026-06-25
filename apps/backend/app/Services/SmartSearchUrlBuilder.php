<?php

namespace App\Services;

class SmartSearchUrlBuilder
{
    private const MODULE_ROUTES = [
        'properties'  => ['route' => 'properties.search',  'params' => ['q', 'location', 'category', 'property_type', 'min_price', 'max_price', 'bedrooms', 'bathrooms', 'guests', 'check_in', 'check_out']],
        'autos'       => ['route' => 'autos.search',       'params' => ['make', 'model', 'location', 'category', 'type', 'transmission', 'price_min', 'price_max', 'year_min', 'year_max']],
        'events'      => ['route' => 'events.search',      'params' => ['search', 'location', 'category', 'type', 'tag', 'date', 'sort']],
        'services'    => ['route' => 'services.search',    'params' => ['search', 'location', 'category_id', 'type', 'min_price', 'max_price', 'expertise']],
        'classifieds' => ['route' => 'classifieds.search', 'params' => ['search', 'location', 'category', 'type', 'tag', 'min_price', 'max_price', 'sort']],
        'jobs'        => ['route' => 'jobs.search',        'params' => ['search', 'location', 'category', 'type', 'tag', 'workplace_type', 'experience_level', 'sort']],
        'products'    => ['route' => 'products.search',    'params' => ['q', 'location', 'category', 'brand', 'type', 'min_price', 'max_price', 'sort_by']],
        'blogs'       => ['route' => 'blogs.search',       'params' => ['search', 'category', 'tag', 'sort']],
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
