<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\CalculateLodgingPriceRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Class ApiPropertyController
 * Orchestrates the API-driven discovery and lifecycle of real estate listings, 
 * integrating complex lodging calculations, amenity mapping, and faceted search.
 */
class ApiPropertyController extends Controller
{
    /**
     * Internal service coordinator for real estate business logic.
     * @var PropertyService
     */
    protected PropertyService $propertyService;

    /**
     * ApiPropertyController constructor.
     * @param PropertyService $propertyService
     */
    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    /**
     * List / search properties with sidebar filter metadata.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $serviceData = $this->propertyService->getSearchPageData($request->all(), auth()->user());

        return PropertyResource::collection($serviceData['properties'])->additional([
            'sidebar' => [
                'categories'       => $serviceData['categories'],
                'locations'        => $serviceData['locations'],
                'amenities'        => $serviceData['amenities'],
                'features'         => $serviceData['features'],
                'tags'             => $serviceData['tags'],
                'max_allowed_price'=> $serviceData['maxAllowedPrice'],
                'number_of_nights' => $serviceData['numberOfNights'] ?? null,
            ]
        ]);
    }

    /**
     * Show a single property detail with related properties.
     */
    public function show(string $slug): JsonResponse
    {
        $property = Property::where('slug', $slug)
            ->visibleTo(auth()->user())
            ->with([
                'user', 'category', 'location', 'amenities', 'features',
                'fees', 'addons', 'neighborhoods', 'scores', 'reviews.user', 'media'
            ])
            ->firstOrFail();

        $this->propertyService->logListingView($property);
        $viewData = $this->propertyService->getPropertyDetailsData($property);

        return $this->successResponse(
            new PropertyResource($property),
            null,
            200,
            [
                'related_properties' => PropertyResource::collection($viewData['relatedProperties']),
                'bookings'           => $viewData['bookings'],
            ]
        );
    }

    /**
     * Calculate estimated lodging price for date range.
     */
    public function calculateLodgingPrice(CalculateLodgingPriceRequest $request, Property $property): JsonResponse
    {

        $calculation = $this->propertyService->calculateEstimatedLodging(
            $property,
            (string) $request->get('check_in'),
            (string) $request->get('check_out')
        );

        return $this->successResponse($calculation);
    }

    /**
     * Filter properties by category slug.
     */
    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }
}
