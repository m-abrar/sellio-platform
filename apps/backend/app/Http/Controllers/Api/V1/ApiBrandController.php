<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use App\Models\Brand;
use App\Services\BrandService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiBrandController extends Controller
{
    protected BrandService $brandService;

    public function __construct(BrandService $brandService)
    {
        // Injecting the BrandService to handle business logic
        $this->brandService = $brandService;
    }

    /**
     * Display a listing of brands.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $brands = $this->brandService->getBrandList(
            $request->only(['is_featured', 'is_published', 'search'])
        );

        return BrandResource::collection($brands);
    }

    /**
     * Display the specified brand details.
     */
    public function show(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)
            ->active() // Assuming you have a global or local scope for active brands
            ->with(['media']) // Leveraging Spatie Media collection
            ->firstOrFail();

        return $this->successResponse(
            new BrandResource($brand),
            null,
            200,
            ['stats' => $this->brandService->getBrandStats($brand)]
        );
    }
}
