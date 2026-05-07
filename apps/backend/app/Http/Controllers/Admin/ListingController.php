<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\ListingQueryService;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ListingController
 * Orchestrates a unified administrative interface for heterogeneous marketplace listings, 
 * coordinating Properties, Autos, Events, Jobs, and Classifieds within a single lifecycle.
 */
class ListingController extends Controller
{
    /**
     * The unified listing query service.
     *
     * @var \App\Services\Admin\ListingQueryService
     */
    protected ListingQueryService $listingService;

    /**
     * ListingController constructor.
     *
     * @param  \App\Services\Admin\ListingQueryService  $listingService
     */
    public function __construct(ListingQueryService $listingService)
    {
        $this->listingService = $listingService;
    }

    /**
     * Display a unified, paginated, and status-filtered listing of all marketplace verticals.
     * Implements a custom rehydration strategy to maintain relationship integrity across union queries.
     *
     * @param  string  $status
     * @param  string  $type
     * @return \Illuminate\View\View
     */
    public function index(string $status = 'active', string $type = 'all'): View
    {
        $listings = $this->listingService->getUnifiedListings($status, $type, 20);

        // Optimization: Manually hydrate User relationships to circumvent N+1 limitations in Union queries.
        $userIds = $listings->pluck('user_id')->unique();
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        $listings->getCollection()->transform(function ($listing) use ($users) {
            $modelClass = ListingQueryService::MODEL_MAP[strtolower($listing->listing_type)] ?? null;
            
            if ($modelClass) {
                // Rehydrate the generic database object into its concrete Eloquent model instance.
                $instance = (new $modelClass)->newFromBuilder($listing);
                $instance->setRelation('user', $users->get($listing->user_id));
                return $instance;
            }
            
            return $listing;
        });

        return view('admin.listings.index', compact('listings', 'status', 'type'));
    }
}
