<?php

namespace App\Http\Controllers;

use App\Http\Requests\CalculateLodgingPriceRequest;
use App\Http\Requests\SearchPropertyRequest;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class PropertyController
 *
 * Handles property listings, searching, and pricing calculations.
 *
 * @package App\Http\Controllers
 */
class PropertyController extends Controller
{
    /**
     * @var PropertyService
     */
    protected PropertyService $propertyService;

    /**
     * PropertyController constructor.
     *
     * @param PropertyService $propertyService
     */
    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    /**
     * Display the property listing index.
     * * We type-hint SearchPropertyRequest so Laravel validates automatically.
     *
     * @param SearchPropertyRequest $request
     * @return View
     */
    public function index(SearchPropertyRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform property search with filters.
     *
     * @param SearchPropertyRequest $request
     * @return View
     */
    public function search(SearchPropertyRequest $request): View
    {
        // Now $request->validated() will work perfectly
        $filters = $request->validated();
        $data = $this->propertyService->getSearchPageData($filters, auth()->user());

        return view("frontend.properties.search", $data);
    }

    /**
     * Display a specific property.
     *
     * @param Request $request
     * @param string $slug
     * @return View
     */
    public function show(Request $request, string $slug): View
    {
        $property = $this->propertyService->findVisibleBySlug($slug, auth()->user());

        $viewData = $this->propertyService->getPropertyDetailsData($property);
        
        $this->propertyService->logListingView($property);

        $basePath = "frontend.properties.show";

        if ($property->is_rental) {
            return view("{$basePath}.vacation-property-detail", $viewData);
        }

        if ($property->is_sale) {
            return view("{$basePath}.sale-property-detail", $viewData);
        }

        return view("{$basePath}.default-property-detail", $viewData);
    }

    /**
     * Calculate lodging price via AJAX.
     *
     * @param CalculateLodgingPriceRequest $request
     * @param Property $property
     * @return JsonResponse
     */
    public function calculateLodgingPrice(CalculateLodgingPriceRequest $request, Property $property): JsonResponse
    {
        $validated = $request->validated();

        $calculation = $this->propertyService->calculateEstimatedLodging(
            $property,
            (string) $validated['check_in'],
            (string) $validated['check_out']
        );

        return response()->json($calculation);
    }
}
