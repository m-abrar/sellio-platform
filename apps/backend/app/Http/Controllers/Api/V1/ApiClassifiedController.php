<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClassifiedResource;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Type;
use App\Services\ClassifiedManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Class ApiClassifiedController
 * Orchestrates the API-driven discovery and retrieval of classified marketplace listings,
 * integrating faceted search, sidebar filtering, and related entity mapping.
 */
class ApiClassifiedController extends Controller
{
    /**
     * Internal service coordinator for classified marketplace business logic.
     * @var ClassifiedManagementService
     */
    protected ClassifiedManagementService $classifiedService;

    /**
     * ApiClassifiedController constructor.
     * @param ClassifiedManagementService $classifiedService
     */
    public function __construct(ClassifiedManagementService $classifiedService)
    {
        $this->classifiedService = $classifiedService;
    }

    /**
     * List / search classifieds with sidebar filter metadata.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $classifieds = $this->classifiedService->getPaginatedClassifieds($request->all(), auth()->user());

        return ClassifiedResource::collection($classifieds)->additional([
            'sidebar' => [
                'categories' => Category::where('is_classified', true)->get(),
                'locations'  => Location::where('is_classified', true)->get(),
                'types'      => Type::where('is_classified', true)->get(),
                'tags'       => Tag::where('is_classified', true)->get(),
            ]
        ]);
    }

    /**
     * Show a single classified listing with related items.
     */
    public function show(string $slug): JsonResponse
    {
        $classified = Classified::where('slug', $slug)
            ->visibleTo(auth()->user())
            ->with(['media', 'user', 'category', 'type', 'location', 'tags', 'user.reviews'])
            ->firstOrFail();

        $relatedItems = $this->classifiedService->getRelatedItems($classified);

        return $this->successResponse(
            new ClassifiedResource($classified),
            null,
            200,
            [
                'related_items' => ClassifiedResource::collection($relatedItems),
                'all_photos_count' => $classified->all_photos->count(),
            ]
        );
    }

    /**
     * Filter classifieds by category slug.
     */
    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }
}
