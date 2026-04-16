<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Category;
use App\Models\Feature;
use App\Models\Location;
use App\Models\Service;
use App\Models\Tag;
use App\Models\Type;
use App\Services\ServiceManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiServiceController extends Controller
{
    protected ServiceManagementService $serviceManagement;

    public function __construct(ServiceManagementService $serviceManagement)
    {
        $this->serviceManagement = $serviceManagement;
    }

    /**
     * List / search services with sidebar filter metadata.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $services = $this->serviceManagement->searchServices($request->all(), auth()->user());

        return ServiceResource::collection($services)->additional([
            'sidebar' => [
                'categories'       => Category::where('is_service', true)->get(),
                'locations'        => Location::where('is_service', true)->get(),
                'types'            => Type::where('is_service', true)->get(),
                'features'         => Feature::where('is_service', true)->get(),
                'tags'             => Tag::where('is_service', true)->get(),
                'expertise_levels' => $this->serviceManagement->getExpertiseLevels(),
            ]
        ]);
    }

    /**
     * Show a single service detail.
     */
    public function show(string $slug): JsonResponse
    {
        $service = Service::where('slug', $slug)
            ->visibleTo(auth()->user())
            ->with(['category', 'type', 'location', 'brand', 'features', 'tags', 'packages', 'user.reviews', 'media'])
            ->firstOrFail();

        return $this->successResponse(
            new ServiceResource($service),
            null,
            200,
            [
                'service_type' => $this->serviceManagement->determineViewName($service),
                'badges' => [
                    'featured'      => (bool) $service->is_featured,
                    'subscription'  => (bool) $service->is_subscription,
                    'project_based' => (bool) $service->is_project_based,
                ],
            ]
        );
    }

    /**
     * Filter services by category slug.
     */
    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }
}
