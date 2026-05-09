<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\CalculatePriceRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request): JsonResponse
    {
        $serviceData = $this->productService->getSearchPageData($request->all(), auth()->user());

        return $this->successResponse(
            ProductResource::collection($serviceData['products']),
            null,
            200,
            [
                'sidebar' => [
                    'categories'        => $serviceData['categories'],
                    'brands'            => $serviceData['brands'],
                    'types'             => $serviceData['types'],
                    'features'          => $serviceData['features'],
                    'max_allowed_price' => $serviceData['maxAllowedPrice'] ?? 0,
                    'filters'           => $serviceData['filters']
                ]
            ]
        );
    }

    public function store(SaveProductRequest $request) {
        // Use safe()->except to remove media fields from the SQL insert
        $data = $request->safe()->except(['main_image', 'gallery', 'approved_at', 'user_id']);

        $product = Product::create($data + [
            'user_id' => auth()->id(),
            // 'approved_at' is NULL by default, requiring admin moderation
        ]);
        
        $this->handleMedia($product, $request);

        return $this->successResponse(
            new ProductResource($product),
            __('Product created and submitted for moderation'),
            201
        );
    }

    public function update(SaveProductRequest $request, $id) {

        $product = Product::where('user_id', auth()->id())->findOrFail($id);

        // Prevent partners from changing ownership or approval status
        $data = $request->safe()->except(['main_image', 'gallery', 'approved_at', 'user_id']);
        
        $product->update($data);
        
        $this->handleMedia($product, $request);

        return $this->successResponse(
            new ProductResource($product->fresh()),
            __('Product updated and resubmitted for moderation')
        );
    }

    public function edit(string $slug) {
        $product = Product::where('slug', $slug)
            // ->active()
            ->with(['user', 'category', 'brand', 'tags', 'media', 'attributes', 'addons'])
            ->firstOrFail();

        $this->productService->logListingView($product);
        $viewData = $this->productService->getProductDetailsData($product);

        return $this->successResponse(
            new ProductResource($product),
            null,
            200,
            [
                'related_products' => ProductResource::collection($viewData['related_products']),
                'attributes'       => $viewData['attributes'],
                'addons'           => $viewData['addons']
            ]
        );
    }

    public function calculatePrice(CalculatePriceRequest $request, Product $product) {
        $validated = $request->validated();

        return $this->successResponse($this->productService->calculateSelectionPrice(
            $product,
            $validated['attribute_ids'] ?? [],
            $validated['addon_ids'] ?? [],
            $validated['quantity'] ?? 1
        ));
    }

    public function category(string $categorySlug): JsonResponse
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }

    protected function handleMedia(Product $product, Request $request): void
    {
        // 1. Handle Primary Image
        if ($request->hasFile('main_image')) {
            $product->clearMediaCollection(Product::PRIMARY_MEDIA);
            $product->addMediaFromRequest('main_image')->toMediaCollection(Product::PRIMARY_MEDIA);
        }

        // 2. Sync Existing & Set Order
        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array)$request->input('existing_media_ids'));
            
            // Remove those not in the list
            $product->getMedia(Product::GALLERY_MEDIA)
                ->reject(fn($media) => in_array($media->id, $keepIds))
                ->each(fn($media) => $media->delete());

            // CRITICAL: Re-apply order column based on the order of IDs sent from React
            // Spatie provides a utility for this:
            \Spatie\MediaLibrary\MediaCollections\Models\Media::setNewOrder($keepIds);
        }

        // 3. Add New Gallery Images
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $product->addMedia($file)
                    // New images get added to the end by default
                    ->toMediaCollection(Product::GALLERY_MEDIA);
            }
        }
    }


    /**
     * Remove the specified product and its media.
     */
    public function destroy($id) {
        // Ensure users can only delete their own products
        $product = Product::where('user_id', auth()->id())->findOrFail($id);

        // Spatie Media Library handles the file deletion automatically
        // when the model is deleted.
        $product->delete();

        return $this->successResponse(null, __('Product and associated assets deleted successfully')
        );
    }
}
