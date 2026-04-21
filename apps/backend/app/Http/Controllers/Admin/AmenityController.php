<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use App\Http\Requests\Admin\AmenityRequest;
use App\Services\Admin\AmenityManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class AmenityController
 *
 * Manages administrative amenities for various listing modules.
 */
class AmenityController extends Controller
{
    /**
     * @var AmenityManagementService
     */
    protected $amenityService;

    /**
     * AmenityController constructor.
     *
     * @param AmenityManagementService $amenityService
     */
    public function __construct(AmenityManagementService $amenityService)
    {
        $this->amenityService = $amenityService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $amenities = Amenity::latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->get();

        return view('admin.amenities.index', compact('amenities'));
    }

    /**
     * Show the form for creating a new amenity.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.amenities.form');
    }

    /**
     * Store a newly created amenity in storage.
     *
     * @param AmenityRequest $request
     * @return RedirectResponse
     */
    public function store(AmenityRequest $request): RedirectResponse
    {
        $amenity = $this->amenityService->saveAmenity($request->validated());

        return redirect()->route('admin.amenities.edit', $amenity->id)
            ->with('success', __('Amenity added successfully.'));
    }

    /**
     * Show the form for editing the specified amenity.
     *
     * @param Amenity $amenity
     * @return View
     */
    public function edit(Amenity $amenity): View
    {
        return view('admin.amenities.form', compact('amenity'));
    }

    /**
     * Update the specified amenity in storage.
     *
     * @param AmenityRequest $request
     * @param Amenity $amenity
     * @return RedirectResponse
     */
    public function update(AmenityRequest $request, Amenity $amenity): RedirectResponse
    {
        $this->amenityService->saveAmenity($request->validated(), $amenity);

        return redirect()->route('admin.amenities.index')
            ->with('success', __('Amenity updated successfully.'));
    }

    /**
     * Remove the specified amenity from storage.
     *
     * @param Amenity $amenity
     * @return RedirectResponse
     */
    public function destroy(Amenity $amenity): RedirectResponse
    {
        $amenity->delete();

        return redirect()->route('admin.amenities.index')
            ->with('success', __('Amenity deleted successfully.'));
    }
}
