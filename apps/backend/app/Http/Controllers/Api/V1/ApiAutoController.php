<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AutoResource;
use App\Models\Auto;
use App\Services\AutoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiAutoController extends Controller
{
    protected AutoService $autoService;

    public function __construct(AutoService $autoService)
    {
        $this->autoService = $autoService;
    }

    /**
     * List / search vehicles with sidebar filter metadata.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $serviceData = $this->autoService->getSearchPageData($request->all(), auth()->user());

        return AutoResource::collection($serviceData['autos'])->additional([
            'sidebar' => [
                'categories'          => $serviceData['categories'],
                'locations'           => $serviceData['locations'],
                'types'               => $serviceData['types'],
                'tags'                => $serviceData['tags'],
                'brands'              => $serviceData['brands'],
                'transaction_types'   => $serviceData['transactionType'],
                'transmission_options'=> $serviceData['transmissionOptions'],
            ]
        ]);
    }

    /**
     * Show a single vehicle listing with related vehicles.
     */
    public function show(string $slug): JsonResponse
    {
        $auto = Auto::where('slug', $slug)
            ->visibleTo(auth()->user())
            ->with(['user', 'category', 'brand', 'tags', 'features', 'media'])
            ->firstOrFail();

        $relatedAutos = $this->autoService->getRelatedAutos($auto);

        return $this->successResponse(
            new AutoResource($auto),
            null,
            200,
            [
                'related_vehicles' => AutoResource::collection($relatedAutos),
            ]
        );
    }

    /**
     * Filter vehicles by category slug.
     */
    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }
}
