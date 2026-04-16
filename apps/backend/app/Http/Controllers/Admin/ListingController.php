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

    /**
     * Approve a listing.
     */
    public function approve(string $type, int $id): RedirectResponse
    {
        $listing = $this->listingService->resolveListing($type, $id);

        if (!$listing) {
            return back()->with('error', __('Listing not found.'));
        }

        $listing->update([
            'approved_at'  => Carbon::now(),
            'is_published' => true,
        ]);

        return back()->with('success', __(':type listing #:id approved and published.', [
            'type' => ucfirst($type), 
            'id'   => $id
        ]));
    }

    /**
     * Disapprove/Unpublish a listing.
     */
    public function disapprove(string $type, int $id): RedirectResponse
    {
        $listing = $this->listingService->resolveListing($type, $id);

        if (!$listing || !$listing->approved_at) {
            return back()->with('error', __('Listing not found or already pending.'));
        }

        $listing->update([
            'approved_at'  => null,
            'is_published' => false,
        ]);

        return back()->with('success', __(':type listing #:id moved to pending.', [
            'type' => ucfirst($type), 
            'id'   => $id
        ]));
    }

    /**
     * Redirect to the specific edit form based on type.
     */
    public function editByType(string $type, int $id): RedirectResponse
    {
        $typeMap = [
            'joblisting' => 'jobs',
        ];

        $typeKey = strtolower($type);
        $pluralType = $typeMap[$typeKey] ?? \Illuminate\Support\Str::plural($typeKey);
        $routeName = "admin." . $pluralType . ".edit";
        
        return redirect()->route($routeName, $id);
    }
}
