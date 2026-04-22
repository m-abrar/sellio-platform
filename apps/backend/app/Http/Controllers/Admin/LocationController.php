<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Http\Requests\Admin\LocationRequest;
use App\Services\Admin\LocationManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class LocationController
 *
 * Manages administrative location listings and metadata.
 */
class LocationController extends Controller
{
    /**
     * @var LocationManagementService
     */
    protected $locationService;

    /**
     * LocationController constructor.
     *
     * @param LocationManagementService $locationService
     */
    public function __construct(LocationManagementService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $locations = Location::latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->get();

        return view('admin.locations.index', compact('locations'));
    }

    /**
     * Show the form for creating a new location.
     *
     * @return View
     */
    public function create(): View
    {
        $location = new Location();
        return view('admin.locations.form', compact('location'));
    }

    /**
     * Store a newly created location in storage.
     *
     * @param LocationRequest $request
     * @return RedirectResponse
     */
    public function store(LocationRequest $request): RedirectResponse
    {
        $location = $this->locationService->saveLocation($request->validated());

        return redirect()->route('admin.locations.edit', $location->id)
            ->with('success', __('Location added successfully.'));
    }

    /**
     * Show the form for editing the specified location.
     *
     * @param Location $location
     * @return View
     */
    public function edit(Location $location): View
    {
        // Handle decoded images if they exist as a JSON string in DB
        $location->images = is_string($location->images) 
            ? json_decode($location->images, true) 
            : ($location->images ?? []);

        return view('admin.locations.form', compact('location'));
    }

    /**
     * Update the specified location in storage.
     *
     * @param LocationRequest $request
     * @param Location $location
     * @return RedirectResponse
     */
    public function update(LocationRequest $request, Location $location): RedirectResponse
    {
        $this->locationService->saveLocation($request->validated(), $location);

        return redirect()->route('admin.locations.index')
            ->with('success', __('Location updated successfully.'));
    }

    /**
     * Remove the specified location from storage.
     *
     * @param Location $location
     * @return RedirectResponse
     */
    public function destroy(Location $location): RedirectResponse
    {
        $location->delete();

        return redirect()->route('admin.locations.index')
            ->with('success', __('Location deleted successfully.'));
    }
}
