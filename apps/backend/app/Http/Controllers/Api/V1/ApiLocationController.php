<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Class ApiLocationController
 * Orchestrates the API-driven discovery of platform locations, providing 
 * geo-spatial retrieval, regional metrics, and high-performance metadata transformation.
 */
class ApiLocationController extends Controller
{
    /**
     * Internal service coordinator for geo-spatial business logic.
     * @var LocationService
     */
    protected LocationService $locationService;

    /**
     * ApiLocationController constructor.
     * @param LocationService $locationService
     */
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
