<?php

namespace App\Services;

use App\Models\Property;
use App\Models\Auto;
use App\Models\Event;
use App\Models\Service;
use App\Models\JobListing;
use App\Models\Classified;
use App\Models\Category;
use App\Models\Location;
use Carbon\Carbon;
use Illuminate\Support\Collection;

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

        return [
            // Featured Sections (Cached individually)
            'propertiesFeatured'  => $this->cached('h_feat_prop', fn() => $this->getFeatured(new Property())),
            'autosFeatured'       => $this->cached('h_feat_auto', fn() => $this->getFeatured(new Auto())),
            'eventsFeatured'      => $this->cached('h_feat_event', fn() => $this->getFeatured(new Event())),
            'jobsFeatured'        => $this->cached('h_feat_job', fn() => $this->getFeatured(new JobListing())),
            'servicesFeatured'    => $this->cached('h_feat_serv', fn() => $this->getFeatured(new Service())),
            'classifiedsFeatured' => $this->cached('h_feat_class', fn() => $this->getFeatured(new Classified())),

            // Trending Sections (Based on 30-day activity)
            'propertiesTrending'  => $this->cached('h_trend_prop', fn() => $this->getTrending(new Property(), 'bookings', $lastMonth)),
            'autosTrending'       => $this->cached('h_trend_auto', fn() => $this->getTrending(new Auto(), 'inquiries', $lastMonth)),
            'eventsTrending'      => $this->cached('h_trend_event', fn() => $this->getTrending(new Event(), 'bookings', $lastMonth)),
            'jobsTrending'        => $this->cached('h_trend_job', fn() => $this->getTrending(new JobListing(), 'applications', $lastMonth)),
            'servicesTrending'    => $this->cached('h_trend_serv', fn() => $this->getTrendingServices($lastMonth)),
            'classifiedsTrending' => $this->cached('h_trend_class', fn() => $this->getTrending(new Classified(), 'inquiries', $lastMonth)),

            // Specific Sub-sections
            'propertiesRental'    => $this->cached('h_rent_prop', fn() => $this->transformCollection(Property::active()->without(['media'])->where('is_rental', true)->latest()->take(6)->get())),
            'propertiesSale'      => $this->cached('h_sale_prop', fn() => $this->transformCollection(Property::active()->without(['media'])->where('is_sale', true)->latest()->take(6)->get())),
            'autosLatest'         => $this->cached('h_late_auto', fn() => $this->transformCollection(Auto::active()->without(['media'])->latest()->take(6)->get())),

            // Taxonomy
            'categories'          => $this->cached('h_tax_cat', fn() => Category::active()->without(['media'])->get()->map(fn($c) => $this->transformTaxonomy($c))),
            'locations'           => $this->cached('h_tax_loc', fn() => Location::active()->without(['media'])->get()->map(fn($l) => $this->transformTaxonomy($l))),
            'locationsFeatured'   => $this->cached('h_feat_loc', fn() => Location::active()->without(['media'])->orderByDesc('is_featured')->take(6)->get()->map(fn($l) => $this->transformTaxonomy($l))),
        ];
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
        $collection = $model->active()
            ->without(['media', 'type', 'location']) 
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
        $collection = $model->active()
            ->without(['media', 'type', 'location'])
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
        $collection = Service::active()
            ->without(['media', 'type', 'location'])
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
