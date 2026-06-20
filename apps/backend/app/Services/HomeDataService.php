<?php

namespace App\Services;

use App\Models\Property;
use App\Models\Auto;
use App\Models\Event;
use App\Models\Service;
use App\Models\JobListing;
use App\Models\Classified;
use App\Models\Product;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

/**
 * Class HomeDataService
 *
 * Consolidates data fetching for the unified home page, 
 * including featured and trending listings.
 */
class HomeDataService
{
    /**
     * Get all data required for the Home Page.
     *
     * @return array
     */
    /**
     * Get all data required for the Home Page.
     *
     * @return array
     */
    public function getHomeData(): array
    {
        $lastMonth = Carbon::now()->subDays(30);
        $publicModules = collect($this->moduleDefinitions())
            ->filter(fn (array $module) => $module['module'] === null || module_enabled($module['module']))
            ->map(fn (array $module) => $this->withModuleStats($module))
            ->values();

        $totalListingsCount = $publicModules->sum('count');

        return [
            'publicModules'       => $publicModules,
            'totalListingsCount'  => $totalListingsCount,

            // Featured Sections (Cached individually)
            'propertiesFeatured'  => $this->forModule('properties', fn() => $this->cached('h_feat_prop', fn() => $this->getFeatured(new Property()))),
            'autosFeatured'       => $this->forModule('autos', fn() => $this->cached('h_feat_auto', fn() => $this->getFeatured(new Auto()))),
            'eventsFeatured'      => $this->forModule('events', fn() => $this->cached('h_feat_event', fn() => $this->getFeatured(new Event()))),
            'jobsFeatured'        => $this->forModule('jobs', fn() => $this->cached('h_feat_job', fn() => $this->getFeatured(new JobListing()))),
            'servicesFeatured'    => $this->forModule('services', fn() => $this->cached('h_feat_serv', fn() => $this->getFeatured(new Service()))),
            'classifiedsFeatured' => $this->forModule('classifieds', fn() => $this->cached('h_feat_class', fn() => $this->getFeatured(new Classified()))),

            // Trending Sections (Based on 30-day activity)
            'propertiesTrending'  => $this->forModule('properties', fn() => $this->cached('h_trend_prop', fn() => $this->getTrending(new Property(), 'bookings', $lastMonth))),
            'autosTrending'       => $this->forModule('autos', fn() => $this->cached('h_trend_auto', fn() => $this->getTrending(new Auto(), 'inquiries', $lastMonth))),
            'eventsTrending'      => $this->forModule('events', fn() => $this->cached('h_trend_event', fn() => $this->getTrending(new Event(), 'bookings', $lastMonth))),
            'jobsTrending'        => $this->forModule('jobs', fn() => $this->cached('h_trend_job', fn() => $this->getTrending(new JobListing(), 'applications', $lastMonth))),
            'servicesTrending'    => $this->forModule('services', fn() => $this->cached('h_trend_serv', fn() => $this->getTrendingServices($lastMonth))),
            'classifiedsTrending' => $this->forModule('classifieds', fn() => $this->cached('h_trend_class', fn() => $this->getTrending(new Classified(), 'inquiries', $lastMonth))),

            // Specific Sub-sections
            'propertiesRental'    => $this->forModule('properties', fn() => $this->safeModelCollection(Property::class, fn() => $this->cached('h_rent_prop', fn() => $this->transformCollection(Property::active()->with(['location', 'category', 'user'])->without(['media'])->where('is_rental', true)->latest()->take(6)->get())))),
            'propertiesSale'      => $this->forModule('properties', fn() => $this->safeModelCollection(Property::class, fn() => $this->cached('h_sale_prop', fn() => $this->transformCollection(Property::active()->with(['location', 'category', 'user'])->without(['media'])->where('is_sale', true)->latest()->take(6)->get())))),
            'autosLatest'         => $this->forModule('autos', fn() => $this->safeModelCollection(Auto::class, fn() => $this->cached('h_late_auto', fn() => $this->transformCollection(Auto::active()->with(['location', 'category', 'user'])->without(['media'])->latest()->take(6)->get())))),
            'productsLatest'      => $this->forModule('products', fn() => $this->safeModelCollection(Product::class, fn() => $this->cached('h_late_prod', fn() => Product::active()->with(['category', 'brand'])->withCount(['attributes', 'addons'])->latest()->take(4)->get()))),
            'blogsFeatured'       => $this->forModule('blogs', fn() => $this->safeModelCollection(Blog::class, fn() => $this->cached('h_feat_blog', fn() => Blog::active()->with(['category'])->orderByDesc('is_featured')->latest('published_at')->take(3)->get()))),

            // Taxonomy
            'categories'          => $this->safeModelCollection(Category::class, fn() => $this->cached('h_tax_cat', fn() => Category::active()->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c)))),
            'locations'           => $this->safeModelCollection(Location::class, fn() => $this->cached('h_tax_loc', fn() => Location::active()->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l)))),
            'locationsFeatured'   => $this->safeModelCollection(Location::class, fn() => $this->cached('h_feat_loc', fn() => Location::active()->without(['media'])->orderByDesc('is_featured')->take(6)->get()->map(fn($l) => $this->transformTaxonomy($l)))),
            'categoriesFeatured'  => $this->safeModelCollection(Category::class, fn() => $this->cached('h_feat_cat', fn() => Category::active()->without(['media'])->orderByDesc('is_featured')->latest()->take(8)->get()->map(fn($c) => $this->transformTaxonomy($c)))),
            // Per-vertical categories (for hero search dropdowns)
            'propertyCategories'  => $this->forModule('properties', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_prop_cat', fn() => Category::active()->where('is_property', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'autoCategories'      => $this->forModule('autos', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_auto_cat', fn() => Category::active()->where('is_auto', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'productCategories'   => $this->forModule('products', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_prod_cat', fn() => Category::active()->where('is_product', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'serviceCategories'   => $this->forModule('services', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_serv_cat', fn() => Category::active()->where('is_service', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'jobCategories'       => $this->forModule('jobs', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_job_cat', fn() => Category::active()->where('is_job', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'eventCategories'     => $this->forModule('events', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_event_cat', fn() => Category::active()->where('is_event', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'classifiedCategories'=> $this->forModule('classifieds', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_class_cat', fn() => Category::active()->where('is_classified', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),
            'blogCategories'      => $this->forModule('blogs', fn() => $this->safeModelCollection(Category::class, fn() => $this->cached('h_blog_cat', fn() => Category::active()->where('is_blog', true)->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))))),

            // Per-vertical locations (for hero search dropdowns)
            'propertyLocations'   => $this->forModule('properties', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_prop_loc', fn() => Location::active()->where('is_property', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
            'autoLocations'       => $this->forModule('autos', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_auto_loc', fn() => Location::active()->where('is_auto', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
            'productLocations'    => $this->forModule('products', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_prod_loc', fn() => Location::active()->where('is_product', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
            'serviceLocations'    => $this->forModule('services', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_serv_loc', fn() => Location::active()->where('is_service', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
            'jobLocations'        => $this->forModule('jobs', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_job_loc', fn() => Location::active()->where('is_job', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
            'eventLocations'      => $this->forModule('events', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_event_loc', fn() => Location::active()->where('is_event', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
            'classifiedLocations' => $this->forModule('classifieds', fn() => $this->safeModelCollection(Location::class, fn() => $this->cached('h_class_loc', fn() => Location::active()->where('is_classified', true)->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))))),
        ];
    }

    protected function forModule(string $module, callable $callback): Collection
    {
        return module_enabled($module) ? $callback() : collect();
    }

    protected function moduleDefinitions(): array
    {
        return [
            [
                'id' => 'properties',
                'module' => 'properties',
                'icon' => 'bi-building',
                'label' => __('Properties'),
                'route' => 'properties.index',
                'search_route' => 'properties.search',
                'section_title' => __('Featured Properties'),
                'section_description' => __('Handpicked premium properties just for you.'),
            ],
            [
                'id' => 'autos',
                'module' => 'autos',
                'icon' => 'bi-car-front-fill',
                'label' => __('Autos'),
                'route' => 'autos.index',
                'search_route' => 'autos.search',
                'section_title' => __('Latest Vehicles'),
                'section_description' => __('Verified vehicles and premium inventory.'),
            ],
            [
                'id' => 'products',
                'module' => 'products',
                'icon' => 'bi-bag-check-fill',
                'label' => __('Products'),
                'route' => 'products.index',
                'search_route' => 'products.search',
                'section_title' => __('Latest Products'),
                'section_description' => __('Shop fresh arrivals from trusted sellers.'),
            ],
            [
                'id' => 'services',
                'module' => 'services',
                'icon' => 'bi-tools',
                'label' => __('Services'),
                'route' => 'services.index',
                'search_route' => 'services.search',
                'section_title' => __('Popular Services'),
                'section_description' => __('Find trusted professionals for any project.'),
            ],
            [
                'id' => 'jobs',
                'module' => 'jobs',
                'icon' => 'bi-briefcase',
                'label' => __('Jobs'),
                'route' => 'jobs.index',
                'search_route' => 'jobs.search',
                'section_title' => __('Featured Careers'),
                'section_description' => __('Discover active opportunities from marketplace employers.'),
            ],
            [
                'id' => 'events',
                'module' => 'events',
                'icon' => 'bi-calendar-event',
                'label' => __('Events'),
                'route' => 'events.index',
                'search_route' => 'events.search',
                'section_title' => __('Upcoming Events'),
                'section_description' => __('Join the community in person or online.'),
            ],
            [
                'id' => 'classifieds',
                'module' => 'classifieds',
                'icon' => 'bi-tag',
                'label' => __('Classifieds'),
                'route' => 'classifieds.index',
                'search_route' => 'classifieds.search',
                'section_title' => __('Top Deals'),
                'section_description' => __('Find great deals in your local community.'),
            ],
            [
                'id' => 'blogs',
                'module' => 'blogs',
                'icon' => 'bi-journal-text',
                'label' => __('Blogs'),
                'route' => 'blogs.index',
                'search_route' => 'blogs.search',
                'section_title' => __('Latest Stories'),
                'section_description' => __('Read guides, updates, and marketplace insights.'),
            ],
        ];
    }

    protected function withModuleStats(array $module): array
    {
        if (! $this->hasModuleTable($module['id'])) {
            $module['count'] = 0;

            return $module;
        }

        $module['count'] = $this->cached(
            "h_count_{$module['id']}",
            fn() => $this->countForModule($module['id'])
        );

        return $module;
    }

    protected function countForModule(string $module): int
    {
        return match ($module) {
            'properties' => Property::active()->count(),
            'autos' => Auto::active()->count(),
            'products' => Product::active()->count(),
            'services' => Service::active()->count(),
            'jobs' => JobListing::active()->count(),
            'events' => Event::active()->count(),
            'classifieds' => Classified::active()->count(),
            'blogs' => Blog::active()->count(),
            default => 0,
        };
    }

    protected function hasModuleTable(string $module): bool
    {
        return match ($module) {
            'properties' => $this->hasModelTable(Property::class),
            'autos' => $this->hasModelTable(Auto::class),
            'products' => $this->hasModelTable(Product::class),
            'services' => $this->hasModelTable(Service::class),
            'jobs' => $this->hasModelTable(JobListing::class),
            'events' => $this->hasModelTable(Event::class),
            'classifieds' => $this->hasModelTable(Classified::class),
            'blogs' => $this->hasModelTable(Blog::class),
            default => true,
        };
    }

    protected function hasModelTable(string|object $model): bool
    {
        $instance = is_string($model) ? new $model() : $model;

        return Schema::hasTable($instance->getTable());
    }

    protected function safeModelCollection(string|object $model, callable $callback): Collection
    {
        return $this->hasModelTable($model) ? $callback() : collect();
    }

    /**
     * Cache helper to keep getHomeData clean and modular.
     */
    protected function cached(string $key, callable $callback)
    {
        return cache()->remember("sellio_h_{$key}", 600, $callback);
    }

    /**
     * Generic helper for featured listings.
     */
    protected function getFeatured($model): Collection
    {
        if (! $this->hasModelTable($model)) {
            return collect();
        }

        $collection = $model->active()
            ->with(['location', 'category', 'user'])
            ->without(['media', 'type']) 
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->take(6)
            ->get();

        return $this->transformCollection($collection);
    }

    /**
     * Generic helper for trending listings.
     */
    protected function getTrending($model, string $relation, Carbon $date): Collection
    {
        if (! $this->hasModelTable($model)) {
            return collect();
        }

        $collection = $model->active()
            ->with(['location', 'category', 'user'])
            ->without(['media', 'type'])
            ->withCount([$relation => function ($query) use ($date) {
                $query->where('created_at', '>=', $date);
            }])
            ->orderByDesc('is_featured')
            ->orderByDesc("{$relation}_count")
            ->orderByDesc('created_at')
            ->take(6)
            ->get();

        return $this->transformCollection($collection);
    }

    /**
     * Specific trending logic for Services.
     */
    protected function getTrendingServices(Carbon $date): Collection
    {
        if (! $this->hasModelTable(Service::class)) {
            return collect();
        }

        $collection = Service::active()
            ->with(['location', 'category', 'user'])
            ->without(['media', 'type'])
            ->withCount(['quotes' => fn($q) => $q->where('created_at', '>=', $date)])
            ->withCount(['appointments' => fn($q) => $q->where('created_at', '>=', $date)])
            ->orderByDesc('is_featured')
            ->orderByDesc('quotes_count')
            ->orderByDesc('appointments_count')
            ->take(6)
            ->get();

        return $this->transformCollection($collection);
    }

    /**
     * Transform a collection into lean stdClass objects.
     * Using stdClass instead of models ensures the smallest possible serialization size,
     * which is critical for avoiding MySQL max_allowed_packet issues.
     */
    protected function transformCollection(Collection $collection): Collection
    {
        return $collection->map(function ($item) {
            $obj = new \stdClass();
            $obj->id                = $item->id;
            $obj->title             = $item->title ?? $item->name;
            $obj->slug              = $item->slug;
            
            // Price attributes
            $obj->price             = $item->price ?? null;
            $obj->price_formatted   = $item->price_formatted ?? null;
            $obj->price_formatted_k = $item->price_formatted_k ?? null;
            $obj->base_price        = $item->base_price ?? null;
            $obj->sale_price        = $item->sale_price ?? null;
            $obj->base_price_formatted = $item->base_price_formatted ?? null;
            $obj->sale_price_formatted = $item->sale_price_formatted ?? null;
            $obj->price_per_night   = $item->price_per_night ?? null;

            // Image attributes
            $obj->primary_image_url = $item->primary_image_url;
            $obj->thumbnail_url     = $item->thumbnail_url;
            
            // Location object
            $obj->location = (object) [
                'id'    => $item->location_id,
                'title' => $item->location?->title ?? __('Location Private')
            ];

            // Category object
            $obj->category = (object) [
                'id'    => $item->category_id,
                'title' => $item->category?->title
            ];

            // User object
            $obj->user = (object) [
                'id'         => $item->user_id,
                'name'       => $item->user?->name ?? __('User'),
                'avatar_url' => $item->user?->avatar_url ?? asset('images/default-avatar.png'),
                'company'    => $item->user?->company ?? null
            ];

            // Status & Flags
            $obj->status_label      = $item->status_label ?? null;
            $obj->status_color      = $item->status_color ?? null;
            $obj->is_featured       = (bool) $item->is_featured;
            $obj->is_rental         = (bool) ($item->is_rental ?? false);
            $obj->is_sale           = (bool) ($item->is_sale ?? false);
            $obj->on_sale           = (bool) ($item->on_sale ?? false);
            
            // Property specific
            $obj->number_of_bedrooms  = $item->number_of_bedrooms ?? 0;
            $obj->number_of_bathrooms = $item->number_of_bathrooms ?? 0;
            $obj->area_sq_ft          = $item->area_sq_ft ?? null;
            $obj->area_sq_m           = $item->area_sq_m ?? null;

            // Auto specific
            $obj->make                = $item->make ?? null;
            $obj->model               = $item->model ?? null;
            $obj->year                = $item->year ?? null;
            $obj->mileage_value       = $item->mileage_value ?? null;
            $obj->mileage_units       = $item->mileage_units ?? null;
            $obj->mileage_formatted   = $item->mileage_formatted ?? null;
            $obj->transmission        = $item->transmission ?? null;
            $obj->fuel_economy        = $item->fuel_economy ?? null;
            $obj->engine_type         = $item->engine_type ?? null;
            $obj->fuel_badge_label    = $item->fuel_badge_label ?? null;
            
            // Event specific
            $obj->start_date_time     = $item->start_date_time; 
            $obj->event_genre         = $item->event_genre ?? null;

            // Job specific
            $obj->company_name        = $item->company_name ?? null;
            $obj->salary_min          = $item->salary_min ?? null;
            $obj->salary_max          = $item->salary_max ?? null;

            // Classified specific
            $obj->condition_label     = $item->condition_label ?? null;

            return $obj;
        });
    }

    /**
     * Specific transformer for taxonomy models.
     */
    protected function transformTaxonomy($item): \stdClass
    {
        $obj = new \stdClass();
        $obj->id            = $item->id;
        $obj->title         = $item->title;
        $obj->slug          = $item->slug;
        $obj->icon          = $item->icon ?? null;
        $obj->description   = $item->description ?? null;
        $obj->color_hex     = $item->color ?? null;
        $obj->level         = $item->level ?? null;
        $obj->is_featured   = (bool) ($item->is_featured ?? false);
        
        $obj->is_property   = (bool) ($item->is_property ?? false);
        $obj->is_auto       = (bool) ($item->is_auto ?? false);
        $obj->is_event      = (bool) ($item->is_event ?? false);
        $obj->is_service    = (bool) ($item->is_service ?? false);
        $obj->is_job        = (bool) ($item->is_job ?? false);
        $obj->is_classified = (bool) ($item->is_classified ?? false);
        $obj->is_product    = (bool) ($item->is_product ?? false);
        $obj->is_blog       = (bool) ($item->is_blog ?? false);
        
        return $obj;
    }
}
