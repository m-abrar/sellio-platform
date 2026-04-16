<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiLocationController extends Controller
{
    protected LocationService $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    /**
     * Display a listing of locations.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // Changed getLocationTree to getLocationList to match Service
        // Swapped 'is_popular' for 'is_featured' to match your migration
        $locations = $this->locationService->getLocationList(
            $request->only(['type', 'is_published', 'is_featured', 'search'])
        );

        return LocationResource::collection($locations);
    }

    /**
     * Display the specified location.
     */
    public function show(string $slug): JsonResponse
    {
        $location = Location::where('slug', $slug)
            ->active() // Assuming this scope exists on your Location model
            ->with(['media']) // Spatie Media eager load
            ->firstOrFail();

        return $this->successResponse(
            new LocationResource($location),
            null,
            200,
            ['stats' => $this->locationService->getLocationStats($location)]
        );
    }
}
