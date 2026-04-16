<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiCategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of top-level categories with their children.
     */
    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->getCategoryTree(
            $request->only(['type', 'is_published'])
        );

        return $this->successResponse(CategoryResource::collection($categories));
    }

    /**
     * Display the specified category and its direct children.
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->active()
            ->with(['children', 'parent', 'media'])
            ->firstOrFail();

        return $this->successResponse(
            new CategoryResource($category),
            null,
            200,
            ['breadcrumbs' => $this->categoryService->getBreadcrumbs($category)]
        );
    }
}
