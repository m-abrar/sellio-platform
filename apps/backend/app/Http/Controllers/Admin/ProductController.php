<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\ProductRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\View\View;
use App\Services\Admin\ProductManagementService;

/**
 * Class ProductController
 * Orchestrates the administrative lifecycle of marketplace products, coordinating 
 * categorical mapping, polymorphic tagging, and multi-entity variation management.
 */
class ProductController extends Controller
{
    /**
     * @var ProductManagementService
     */
    protected $productService;

    /**
     * ProductController constructor.
     *
     * @param ProductManagementService $productService
     */
    public function __construct(ProductManagementService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a filtered and paginated listing of all marketplace products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->where('is_product', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $products = Product::query()
            ->when($request->query('title'), fn($q) => $q->where('title', 'like', '%' . $request->query('title') . '%'))
            ->when($request->query('category_id'), fn($q) => $q->where('category_id', $request->query('category_id')))
            ->when($request->query('sku'), fn($q) => $q->where('sku', 'like', '%' . $request->query('sku') . '%'))
            ->when($request->query('status') !== null, fn($q) => $q->where('is_published', $request->query('status')))
            ->with(['category', 'user', 'brand'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.products.index', compact('products', 'categories'));
    }

    /**
     * Show the interface for initializing a new marketplace product.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $categories = Category::active()->where('is_product', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $brands = Brand::active()->where('is_product', 1)->get();
        if ($brands->isEmpty()) $brands = Brand::active()->get();
        $tags       = Tag::all();
        $product    = new Product();

        return view('admin.products.form', compact('product', 'categories', 'brands', 'tags'));
    }

    /**
     * Store a newly created product and atomically synchronize its sub-entities.
     *
     * @param  \App\Http\Requests\Admin\ProductRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        try {
            $this->productService->saveProduct($request->validated());

            return redirect()->route('admin.products.index')
                ->with('success', __('Product created and synchronized successfully.'));

        } catch (\Exception $e) {
            Log::error("Product Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure: :error', ['error' => $e->getMessage()]));
        }
    }

    /**
     * Show the interface for editing an existing product and its complex relationships.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\View\View
     */
    public function edit(Product $product): View
    {
        $product->load(['attributes', 'addons', 'tags']);
        $categories = Category::active()->where('is_product', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $brands = Brand::active()->where('is_product', 1)->get();
        if ($brands->isEmpty()) $brands = Brand::active()->get();
        $tags       = Tag::all();

        return view('admin.products.form', compact('product', 'categories', 'brands', 'tags'));
    }

    /**
     * Update an existing product and synchronize its multifaceted data structure.
     *
     * @param  \App\Http\Requests\Admin\ProductRequest  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        try {
            $this->productService->saveProduct($request->validated(), $product);

            return redirect()->route('admin.products.index')
                ->with('success', __('Product updated successfully.'));

        } catch (\Exception $e) {
            Log::error("Product Update Failure: {$e->getMessage()}", ['id' => $product->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
        }
    }

    /**
     * Replicate an existing product as a draft, including tags and media assets.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(Product $product): RedirectResponse
    {
        try {
            $newProduct = $this->productService->duplicateProduct($product);

            return redirect()->route('admin.products.edit', $newProduct->id)
                ->with('success', __('Product duplicated as draft successfully.'));
        } catch (\Exception $e) {
            Log::error("Product Duplication Failure: {$e->getMessage()}", ['id' => $product->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }

    /**
     * Remove a product from the active marketplace.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();
        
        return redirect()->route('admin.products.index')
            ->with('success', __('Product moved to trash successfully.'));
    }
}
