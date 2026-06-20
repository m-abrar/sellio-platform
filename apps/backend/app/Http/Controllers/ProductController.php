<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchProductRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class ProductController
 *
 * Optimized for security and performance. Handles retail product workflows.
 */
class ProductController extends Controller
{
    /**
     * @var ProductService
     */
    protected ProductService $productService;

    /**
     * Whitelisted theme variants to prevent View Path Injection.
     */
    protected const ALLOWED_THEMES = ['default', 'grid', 'list', 'dark'];

    /**
     * ProductController constructor.
     */
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display the product listing index.
     */
    public function index(SearchProductRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform product search with filters.
     */
    public function search(SearchProductRequest $request): View
    {
        $filters = $request->validated();
        $data = $this->productService->getSearchPageData($filters, auth()->user());
        $data['activeFilterCount'] = count(array_filter($request->only(['q', 'category', 'brand', 'min_price', 'max_price'])));
        // Security: Whitelist the theme variant input
        return view("frontend.products.search", $data);
    }

    /**
     * Display a specific product listing.
     * Eager loads aggregates and relations to satisfy N+1 requirements.
     */
    public function show(Request $request, string $slug): View
    {
        $product = Product::where('slug', $slug)
            ->where('is_published', true)
            ->whereNotNull('approved_at')
            ->with([
                'user', 'category', 'brand', 'tags', 'media',
                'reviews' => fn($q) => $q->latest()->limit(10),
                'reviews.user'
            ])
            ->withAvg('reviews', 'rating') // Prevents N+1 in the stars display
            ->withCount('reviews')
            ->firstOrFail();

        $viewData = $this->productService->getProductDetailsData($product);
        
        // Log the view for analytics
        $this->productService->logListingView($product);

        return view('frontend.products.show.physical-product-detail', $viewData);
    }

    /**
     * Calculate dynamic price via AJAX for variants and addons.
     */
    public function calculateDynamicPrice(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'attribute_ids'   => ['nullable', 'array'],
            'attribute_ids.*' => ['exists:product_attributes,id'],
            'addon_ids'       => ['nullable', 'array'],
            'addon_ids.*'     => ['exists:product_addons,id'],
            'quantity'        => ['integer', 'min:1']
        ]);

        $calculation = $this->productService->calculateSelectionPrice(
            $product,
            $validated['attribute_ids'] ?? [],
            $validated['addon_ids'] ?? [],
            (int) ($validated['quantity'] ?? 1)
        );

        return response()->json($calculation, 200);
    }
}
