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
        $listings = $this->listingService->hydrateListings($listings);

        return view('admin.listings.index', compact('listings', 'status', 'type'));
    }

    /**
     * Approve a marketplace listing by vertical type and ID.
     *
     * @param  string  $type
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(string $listing_type, int $listing_id)
    {
        $listing = $this->listingService->resolveListing($listing_type, $listing_id);
        
        if (!$listing) {
            return back()->with('error', __('Listing not found.'));
        }

        $listing->update([
            'approved_at' => now(),
            'is_published' => true,
        ]);

        event(new \App\Events\ListingApproved($listing));

        return back()->with('success', __('Asset #:id approved and published.', ['id' => $listing_id]));
    }

    /**
     * Disapprove a marketplace listing by vertical type and ID.
     *
     * @param  string  $listing_type
     * @param  int  $listing_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function disapprove(string $listing_type, int $listing_id)
    {
        $listing = $this->listingService->resolveListing($listing_type, $listing_id);
        
        if (!$listing) {
            return back()->with('error', __('Listing not found.'));
        }

        $listing->update([
            'approved_at' => null,
            'is_published' => false,
        ]);

        event(new \App\Events\ListingRejected($listing, 'Admin disapproval'));

        return back()->with('success', __('Asset #:id moved to pending.', ['id' => $listing_id]));
    }

    /**
     * Redirect to the concrete vertical's edit interface.
     *
     * @param  string  $listing_type
     * @param  int  $listing_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function edit(string $listing_type, int $listing_id)
    {
        $pluralMap = [
            'joblisting' => 'jobs',
            'property'   => 'properties',
            'auto'       => 'autos',
            'event'      => 'events',
            'service'    => 'services',
            'classified' => 'classifieds'
        ];
        
        $modelKey = strtolower($listing_type);
        $vertical = $pluralMap[$modelKey] ?? \Illuminate\Support\Str::plural($modelKey);
        
        return redirect()->route('admin.' . $vertical . '.edit', $listing_id);
    }

    /**
     * Display a dedicated analytics and reports landing page for a listing.
     *
     * @param  string  $listing_type
     * @param  int  $listing_id
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function analytics(string $listing_type, int $listing_id)
    {
        $listing = $this->listingService->resolveListing($listing_type, $listing_id);

        if (!$listing) {
            return back()->with('error', __('Listing not found.'));
        }

        $listing->loadMissing('user');

        $reportLinks = [
            [
                'label' => __('Reports Hub'),
                'description' => __('Open the complete administrative analytics center.'),
                'icon' => 'fa-chart-pie',
                'color' => 'primary',
                'url' => route('admin.reports.index'),
            ],
            [
                'label' => __('Bookings Report'),
                'description' => __('Review booking and inquiry velocity for marketplace operations.'),
                'icon' => 'fa-calendar-check',
                'color' => 'success',
                'url' => route('admin.reports.bookings', ['listing_type' => $listing_type, 'listing_id' => $listing_id]),
            ],
            [
                'label' => __('Payments Report'),
                'description' => __('Inspect revenue, settlement, and payment performance.'),
                'icon' => 'fa-credit-card',
                'color' => 'info',
                'url' => route('admin.reports.payments', ['listing_type' => $listing_type, 'listing_id' => $listing_id]),
            ],
        ];

        if (strtolower($listing_type) === 'property') {
            $reportLinks[] = [
                'label' => __('Property Occupancy Report'),
                'description' => __('Analyze property utilization, availability, and occupancy signals.'),
                'icon' => 'fa-building',
                'color' => 'warning',
                'url' => route('admin.reports.properties', ['property_id' => $listing_id]),
            ];
        }

        return view('admin.listings.analytics', compact('listing', 'listing_type', 'listing_id', 'reportLinks'));
    }

    /**
     * Purge a marketplace listing by vertical type and ID.
     *
     * @param  string  $listing_type
     * @param  int  $listing_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $listing_type, int $listing_id)
    {
        $listing = $this->listingService->resolveListing($listing_type, $listing_id);
        
        if (!$listing) {
            return back()->with('error', __('Listing not found.'));
        }

        $listing->delete();

        return back()->with('success', __('Asset #:id purged from registry.', ['id' => $listing_id]));
    }
}
