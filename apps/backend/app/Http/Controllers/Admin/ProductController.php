<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand; // Assuming you have a Brand model
use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\ProductRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $categories = Category::where('is_product', 1)->get();

        $products = Product::query()
            ->when(request('title'), fn($q) => $q->where('title', 'like', '%' . request('title') . '%'))
            ->when(request('category_id'), fn($q) => $q->where('category_id', request('category_id')))
            ->when(request('sku'), fn($q) => $q->where('sku', 'like', '%' . request('sku') . '%'))
            ->when(request('status') !== null, fn($q) => $q->where('is_published', request('status')))
            ->with(['category'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('is_product', 1)->get();
        $brands = Brand::where('is_product', 1)->get();
        $tags = Tag::all();
        $product = new Product();

        return view('admin.products.form', compact('product', 'categories', 'brands', 'tags'));
    }

    public function store(ProductRequest $request)
    {
        $validatedData = $request->validated();

        // Auto-generate slug if empty
        if (empty($validatedData['slug'])) {
            $validatedData['slug'] = Str::slug($validatedData['title']);
        }

        \DB::transaction(function () use ($validatedData) {
            // Remove non-column fields before create
            $productData = collect($validatedData)->except(['tags', 'attributes', 'addons'])->toArray();
            $productData['user_id'] = auth()->id();

            $product = Product::create($productData);

            // Sync tags safely
            if (!empty($validatedData['tags'])) {
                $product->tags()->sync($validatedData['tags']);
            }

            // Sync Attributes (Variations)
            if (!empty($validatedData['attributes'])) {
                foreach ($validatedData['attributes'] as $attr) {
                    $product->attributes()->create($attr);
                }
            }

            // Sync Addons
            if (!empty($validatedData['addons'])) {
                foreach ($validatedData['addons'] as $addon) {
                    $product->addons()->create($addon);
                }
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $product->load(['attributes', 'addons', 'tags']);
        $categories = Category::where('is_product', 1)->get();
        $brands = Brand::where('is_product', 1)->get();
        $tags = Tag::all();

        return view('admin.products.form', compact('product', 'categories', 'brands', 'tags'));
    }


    public function update(ProductRequest $request, Product $product)
    {
        Log::info('Product update request started', [
            'product_id' => $product->id,
            'payload' => $request->except(['_token']), 
        ]);

        $validated = $request->validated();

        \DB::transaction(function () use ($validated, $product) {
            $productData = collect($validated)->except(['tags', 'attributes', 'addons'])->toArray();
            $product->update($productData);

            // Sync tags
            $product->tags()->sync($validated['tags'] ?? []);

            // Sync Attributes (Recreate strategy)
            $product->attributes()->delete();
            if (!empty($validated['attributes'])) {
                foreach ($validated['attributes'] as $attr) {
                    $product->attributes()->create($attr);
                }
            }

            // Sync Addons (Recreate strategy)
            $product->addons()->delete();
            if (!empty($validated['addons'])) {
                foreach ($validated['addons'] as $addon) {
                    $product->addons()->create($addon);
                }
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }


    public function duplicate(Product $product)
    {
        $newProduct = $product->replicate();
        $newProduct->title .= ' (Copy)';
        $newProduct->sku .= '-COPY';
        $newProduct->slug = Str::slug($newProduct->title) . '-' . uniqid();
        $newProduct->save();

        // Duplicate Tags
        $newProduct->tags()->sync($product->tags->pluck('id')->toArray());

        // Note: Spatie Media replication usually requires manual copying of files
        // if you want the images duplicated as well.
        foreach ($product->getMedia(Product::GALLERY_MEDIA) as $media) {
            $media->copy($newProduct, Product::GALLERY_MEDIA);
        }

        return redirect()->route('admin.products.edit', $newProduct->id)
            ->with('success', 'Product duplicated successfully.');
    }

    public function destroy(Product $product)
    {
        // Spatie media files are automatically deleted if your Model uses SoftDeletes or standard delete
        $product->delete();
        return redirect()->route('admin.products.index')
            ->with('success', 'Product moved to trash.');
    }
}
