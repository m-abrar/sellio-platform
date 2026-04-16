<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Services\BlogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiBlogController extends Controller
{
    protected BlogService $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    public function index(SearchBlogRequest $request): AnonymousResourceCollection
    {
        $perPage = $request->query('per_page', 3);

        $serviceData = $this->blogService->getBlogListPageData(
            $request->validated(), 
            $perPage
        );

        // Returning the Resource Collection directly is the key to getting 'meta' and 'links'
        return BlogResource::collection($serviceData['blogs'])->additional([
            'sidebar' => [
                'categories'   => $serviceData['categories'],
                'recent_posts' => BlogResource::collection($serviceData['recent_posts'])
            ]
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $blog = Blog::where('slug', $slug)
            ->active()
            ->with(['user', 'category', 'tags', 'reviews.user', 'media'])
            ->firstOrFail();

        $this->blogService->logBlogView($blog);
        $viewData = $this->blogService->getBlogDetailsData($blog);

        return $this->successResponse(
            new BlogResource($blog),
            null,
            200,
            [
                'related_posts' => BlogResource::collection($viewData['related_posts']),
                'author_meta'   => $viewData['author_meta']
            ]
        );
    }

    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new SearchBlogRequest(['category' => $categorySlug]));
    }
}
