<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Http\Requests\Admin\AmenityRequest;
use App\Services\Admin\AmenityManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class AmenityController
 * Orchestrates the administrative management of amenities, 
 * providing a standardized interface for property-level features and facilities.
 */
class AmenityController extends Controller
{
    /**
     * The amenity management service.
     *
     * @var \App\Services\Admin\AmenityManagementService
     */
    protected AmenityManagementService $amenityService;

    /**
     * AmenityController constructor.
     *
     * @param  \App\Services\Admin\AmenityManagementService  $amenityService
     */
    public function __construct(AmenityManagementService $amenityService)
    {
        $this->amenityService = $amenityService;
    }

    /**
     * Display a filtered listing of all registered amenities.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $amenities = Amenity::latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->get();

        return view('admin.amenities.index', compact('amenities'));
    }

    /**
     * Show the form for creating a new marketplace amenity.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $amenity = new Amenity();
        return view('admin.amenities.form', compact('amenity'));
    }

    /**
     * Store a newly created amenity and its associated configuration.
     *
     * @param  \App\Http\Requests\Admin\AmenityRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(AmenityRequest $request): RedirectResponse
    {
        $amenity = $this->amenityService->saveAmenity($request->validated());

        return redirect()->route('admin.amenities.edit', $amenity->id)
            ->with('success', __('Amenity added successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace amenity.
     *
     * @param  \App\Models\Amenity  $amenity
     * @return \Illuminate\View\View
     */
    public function edit(Amenity $amenity): View
    {
        return view('admin.amenities.form', compact('amenity'));
    }

    /**
     * Update an existing marketplace amenity configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\AmenityRequest  $request
     * @param  \App\Models\Amenity  $amenity
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(AmenityRequest $request, Amenity $amenity): RedirectResponse
    {
        $this->amenityService->saveAmenity($request->validated(), $amenity);

        return redirect()->route('admin.amenities.index')
            ->with('success', __('Amenity updated successfully.'));
    }

    /**
     * Remove an amenity configuration from the database.
     *
     * @param  \App\Models\Amenity  $amenity
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Amenity $amenity): RedirectResponse
    {
        $amenity->delete();

        return redirect()->route('admin.amenities.index')
            ->with('success', __('Amenity deleted successfully.'));
    }
}
