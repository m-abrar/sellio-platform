<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AmenityResource;
use App\Models\Amenity;
use App\Services\AmenityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiAmenityController extends Controller
{
    protected AmenityService $amenityService;

    public function __construct(AmenityService $amenityService)
    {
        $this->amenityService = $amenityService;
    }

    /**
     * Display a listing of amenities.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $amenities = $this->amenityService->getAmenityList(
            $request->only(['type', 'is_published', 'search'])
        );

        return AmenityResource::collection($amenities);
    }

    /**
     * Display the specified amenity.
     */
    public function show(string $slug): JsonResponse
    {
        $amenity = Amenity::where('slug', $slug)
            ->where('is_published', true)
            ->with(['media'])
            ->firstOrFail();

        return $this->successResponse(new AmenityResource($amenity));
    }
}
