<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\ListingQueryService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Carbon\Carbon;

/**
 * Class ListingController
 * * Handles unified management of Properties, Autos, Events, Jobs, Services, and Classifieds.
 */
class ListingController extends Controller
{
    protected $listingService;

    public function __construct(ListingQueryService $listingService)
    {
        $this->listingService = $listingService;
    }

    /**
     * Unified index for all listing types.
     */
    public function index(string $status = 'active', string $type = 'all'): View
    {
        $listings = $this->listingService->getUnifiedListings($status, $type, 20);

        // Manually eager load users to avoid N+1 issues on Union queries
        $userIds = $listings->pluck('user_id')->unique();
        $users = \App\Models\User::whereIn('id', $userIds)->get()->keyBy('id');

        foreach ($listings as $listing) {
            $listing->setRelation('user', $users->get($listing->user_id));
            if ($listing->expires_at) {
                $listing->expires_at = \Illuminate\Support\Carbon::parse($listing->expires_at);
            }
        }

        return view('admin.listings.index', compact('listings', 'status', 'type'));
    }
}
