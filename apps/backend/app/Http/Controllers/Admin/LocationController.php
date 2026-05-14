<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Http\Requests\Admin\LocationRequest;
use App\Services\Admin\LocationManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class LocationController
 * Orchestrates the administrative management of geographical locations, 
 * coordinating listing-location relationships and regional metadata.
 */
class LocationController extends Controller
{
    /**
     * The location management service.
     *
     * @var \App\Services\Admin\LocationManagementService
     */
    protected LocationManagementService $locationService;

    /**
     * LocationController constructor.
     *
     * @param  \App\Services\Admin\LocationManagementService  $locationService
     */
    public function __construct(LocationManagementService $locationService)
    {
        $this->locationService = $locationService;
    }

    /**
     * Display a filtered listing of all registered marketplace locations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $locations = Location::latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->paginate(20);

        return view('admin.locations.index', compact('locations'));
    }

    /**
     * Show the form for creating a new marketplace location.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $location = new Location();
        $titleSuggestions = Location::select('title')->distinct()->limit(20)->pluck('title');
        return view('admin.locations.form', compact('location', 'titleSuggestions'));
    }

    /**
     * Store a newly created location and its associated metadata.
     *
     * @param  \App\Http\Requests\Admin\LocationRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LocationRequest $request): RedirectResponse
    {
        $location = $this->locationService->saveLocation($request->validated());

        return redirect()->route('admin.locations.edit', $location->id)
            ->with('success', __('Location added successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace location.
     *
     * @param  \App\Models\Location  $location
     * @return \Illuminate\View\View
     */
    public function edit(Location $location): View
    {
        // Normalize geographical assets for the form interface
        $location->images = is_string($location->images) 
            ? json_decode($location->images, true) 
            : ($location->images ?? []);

        $titleSuggestions = Location::select('title')->distinct()->limit(20)->pluck('title');

        return view('admin.locations.form', compact('location', 'titleSuggestions'));
    }

    /**
     * Update an existing marketplace location configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\LocationRequest  $request
     * @param  \App\Models\Location  $location
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(LocationRequest $request, Location $location): RedirectResponse
    {
        $this->locationService->saveLocation($request->validated(), $location);

        return redirect()->route('admin.locations.index')
            ->with('success', __('Location updated successfully.'));
    }

    /**
     * Remove a location configuration from the database.
     *
     * @param  \App\Models\Location  $location
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return redirect()->route('admin.locations.index')
            ->with('success', __('Location deleted successfully.'));
    }
}
