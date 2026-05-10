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
    public function getHomeData(): array
    {
        return cache()->remember('home_page_data_v2', 600, function () {
            $lastMonth = Carbon::now()->subDays(30);

            return [
                // Featured Sections
                'propertiesFeatured'  => $this->getFeatured(new Property()),
                'autosFeatured'       => $this->getFeatured(new Auto()),
                'eventsFeatured'      => $this->getFeatured(new Event()),
                'jobsFeatured'        => $this->getFeatured(new JobListing()),
                'servicesFeatured'    => $this->getFeatured(new Service()),
                'classifiedsFeatured' => $this->getFeatured(new Classified()),

                // Trending Sections (Based on 30-day activity)
                'propertiesTrending'  => $this->getTrending(new Property(), 'bookings', $lastMonth),
                'autosTrending'       => $this->getTrending(new Auto(), 'inquiries', $lastMonth),
                'eventsTrending'      => $this->getTrending(new Event(), 'bookings', $lastMonth),
                'jobsTrending'        => $this->getTrending(new JobListing(), 'applications', $lastMonth),
                'servicesTrending'    => $this->getTrendingServices($lastMonth),
                'classifiedsTrending' => $this->getTrending(new Classified(), 'inquiries', $lastMonth),

                // Specific Sub-sections
                'propertiesRental'    => Property::active()->where('is_rental', true)->latest()->take(6)->get(),
                'propertiesSale'      => Property::active()->where('is_sale', true)->latest()->take(6)->get(),
                'autosLatest'         => Auto::active()->latest()->take(6)->get(),

                // Taxonomy
                'categories'          => Category::active()->get(),
                'locations'           => Location::active()->get(),
                'locationsFeatured'   => Location::active()->orderByDesc('is_featured')->take(6)->get(),
            ];
        });
    }

    /**
     * Generic helper for featured listings.
     */
    protected function getFeatured($model): Collection
    {
        return $model->active()
            ->orderByDesc('is_featured')
            ->orderByDesc('created_at')
            ->take(6)
            ->get();
    }

    /**
     * Generic helper for trending listings.
     */
    protected function getTrending($model, string $relation, Carbon $date): Collection
    {
        return $model->active()
            ->withCount([$relation => function ($query) use ($date) {
                $query->where('created_at', '>=', $date);
            }])
            ->orderByDesc('is_featured')
            ->orderByDesc("{$relation}_count")
            ->orderByDesc('created_at')
            ->take(6)
            ->get();
    }

    /**
     * Specific trending logic for Services (multiple count relations).
     */
    protected function getTrendingServices(Carbon $date): Collection
    {
        return Service::active()
            ->withCount(['quotes' => fn($q) => $q->where('created_at', '>=', $date)])
            ->withCount(['appointments' => fn($q) => $q->where('created_at', '>=', $date)])
            ->orderByDesc('is_featured')
            ->orderByDesc('quotes_count')
            ->orderByDesc('appointments_count')
            ->take(6)
            ->get();
    }
}
