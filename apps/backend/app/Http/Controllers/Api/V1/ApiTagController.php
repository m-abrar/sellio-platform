<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Class ApiTagController
 * Orchestrates the API-driven discovery of platform tags, providing 
 * high-performance retrieval and transformation of polymorphic metadata.
 */
class ApiTagController extends Controller
{
    /**
     * Internal service coordinator for tag-related business logic.
     * @var TagService
     */
    protected TagService $tagService;

    /**
     * ApiTagController constructor.
     * @param TagService $tagService
     */
    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    /**
     * Display a listing of tags.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $tags = $this->tagService->getTagList(
            $request->only(['type', 'is_published', 'search'])
        );

        return TagResource::collection($tags);
    }

    /**
     * Display the specified tag.
     */
    public function show(string $slug): JsonResponse
    {
        $tag = Tag::where('slug', $slug)
            ->where('is_published', true)
            ->with(['media'])
            ->firstOrFail();

        return $this->successResponse(new TagResource($tag));
    }
}
