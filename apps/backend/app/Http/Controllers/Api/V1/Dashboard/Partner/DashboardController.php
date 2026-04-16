<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Dashboard\Partner\Traits\DashboardDataPreparation;
use App\Http\Controllers\Dashboard\Partner\Traits\Listings;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class DashboardController
 * * Aggregates multi-source data to provide a unified overview for partners.
 */
class DashboardController extends Controller
{
    use Listings;
    use DashboardDataPreparation;

    /**
     * Display the partner dashboard overview.
     * * @return View
     */
    public function index() {
        $partner = Auth::user();

        // 1. Data Aggregation via Traits
        $dashboardData     = $this->prepareDashboardData($partner);
        $earningData       = $this->fetchEarningData($partner);
        $performanceData   = $this->fetchPerformanceMetrics($partner);
        $chartData         = $this->fetchChartData($partner);
        $healthScoreData   = $this->calculateListingHealthScore($partner);

        // 2. Optimized Listing Retrieval
        // We select only the necessary columns to keep the memory footprint low.
        $baseSelect = ['id', 'title', 'created_at', 'is_published', 'slug'];

        $recentListings = $this->getUnifiedRecentListings($partner, $baseSelect);

        // 3. View Composition
        return $this->successResponse(array_merge(
            [
                'partner'           => $partner,
                'earningChangeData' => $earningData,
                'performanceData'   => $performanceData,
                'chartData'         => $chartData,
                'healthScoreData'   => $healthScoreData,
                'recentListings'    => $recentListings,
            ],
            $dashboardData
        ));
    }

    /**
     * Fetch, merge, and enrich listings from all categories.
     * * @param \App\Models\User $partner
     * @param array $columns
     * @return Collection
     */
    protected function getUnifiedRecentListings($partner, array $columns): Collection
    {
        $limit = 3;

        $collections = [
            $partner->properties()->latest()->take($limit)->get($columns),
            $partner->events()->latest()->take($limit)->get($columns),
            $partner->autos()->latest()->take($limit)->get($columns),
            $partner->services()->latest()->take($limit)->get($columns),
            $partner->classifieds()->latest()->take($limit)->get($columns),
            $partner->jobs()->latest()->take($limit)->get($columns),
        ];

        return collect($collections)
            ->collapse()
            ->sortByDesc('created_at')
            ->take(15)
            ->map(fn($listing) => $this->enrichListingData($listing));
    }
}
