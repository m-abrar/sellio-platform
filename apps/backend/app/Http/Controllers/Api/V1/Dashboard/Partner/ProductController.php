<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalculatePriceRequest;
use App\Http\Requests\SaveProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Tag;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $serviceData = $this->productService->getSearchPageData($request->all(), $user);

        $products = Product::query()
            ->where('user_id', $user->id)
            ->with(['media', 'brand', 'category', 'type', 'features', 'tags'])
            ->latest()
            ->paginate($request->integer('per_page', 120));

        return $this->successResponse(
            ProductResource::collection($products),
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
        $user = auth()->user();
        if ($user->hasReachedListingLimit()) {
            return $this->successResponse(null, __('You have reached your listing limit. Please upgrade your plan.'), 403);
        }

        return DB::transaction(function () use ($request, $user) {
            // Use safe()->except to remove media and polymorphic fields from the SQL insert
            $data = $request->safe()->except(['main_image', 'gallery', 'approved_at', 'user_id', 'tags', 'features']);

            $product = Product::create($data + [
                'user_id' => $user->id,
                // 'approved_at' is NULL by default, requiring admin moderation
            ]);
            
            $this->handleMedia($product, $request);

            // Sync features
            if ($request->has('features')) {
                $product->features()->sync($request->input('features') ?? []);
            }

            // Sync tags
            if ($request->has('tags')) {
                $tagIds = [];
                foreach ($request->input('tags') ?? [] as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['title' => trim($tagName)],
                        ['slug' => Str::slug($tagName), 'is_product' => true, 'is_published' => true]
                    );
                    $tagIds[] = $tag->id;
                }
                $product->tags()->sync($tagIds);
            }

            return $this->successResponse(
                new ProductResource($product->load(['media', 'brand', 'category', 'type', 'features', 'tags'])),
                __('Product created and submitted for moderation'),
                201
            );
        });
    }

    public function update(SaveProductRequest $request, $id) {
        return DB::transaction(function () use ($request, $id) {
            $product = Product::where('user_id', auth()->id())->findOrFail($id);

            // Prevent partners from changing ownership or approval status
            $data = $request->safe()->except(['main_image', 'gallery', 'approved_at', 'user_id', 'tags', 'features']);
            
            $product->update($data);
            
            $this->handleMedia($product, $request);

            // Sync features
            if ($request->has('features')) {
                $product->features()->sync($request->input('features') ?? []);
            }

            // Sync tags
            if ($request->has('tags')) {
                $tagIds = [];
                foreach ($request->input('tags') ?? [] as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['title' => trim($tagName)],
                        ['slug' => Str::slug($tagName), 'is_product' => true, 'is_published' => true]
                    );
                    $tagIds[] = $tag->id;
                }
                $product->tags()->sync($tagIds);
            }

            return $this->successResponse(
                new ProductResource($product->fresh(['media', 'brand', 'category', 'type', 'features', 'tags'])),
                __('Product updated and resubmitted for moderation')
            );
        });
    }

    public function show(string $product): JsonResponse
    {
        $model = Product::where('user_id', auth()->id())
            ->where(is_numeric($product) ? 'id' : 'slug', $product)
            ->with(['user', 'category', 'brand', 'type', 'tags', 'media', 'attributes', 'addons'])
            ->firstOrFail();

        $this->productService->logListingView($model);
        $viewData = $this->productService->getProductDetailsData($model);

        return $this->successResponse(
            new ProductResource($model),
            null,
            200,
            [
                'related_products' => ProductResource::collection($viewData['related_products']),
                'attributes'       => $viewData['attributes'],
                'addons'           => $viewData['addons'],
            ]
        );
    }

    public function edit(string $slug) {
        $product = Product::where('user_id', auth()->id())
            ->where('slug', $slug)
            ->with(['user', 'category', 'brand', 'type', 'tags', 'media', 'attributes', 'addons'])
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
            Media::setNewOrder($keepIds);
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
