<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Http\Requests\Admin\BrandRequest;
use App\Services\Admin\BrandManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class BrandController
 * Orchestrates the administrative management of brands, 
 * coordinating listing-brand relationships and vertical-specific module assignments.
 */
class BrandController extends Controller
{
    /**
     * The brand management service.
     *
     * @var \App\Services\Admin\BrandManagementService
     */
    protected BrandManagementService $brandService;

    /**
     * BrandController constructor.
     *
     * @param  \App\Services\Admin\BrandManagementService  $brandService
     */
    public function __construct(BrandManagementService $brandService)
    {
        $this->brandService = $brandService;
    }

    /**
     * Display a filtered listing of all registered marketplace brands.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $brands = Brand::latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->paginate(20);

        return view('admin.brands.index', compact('brands'));
    }

    /**
     * Show the form for creating a new marketplace brand.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $brand = new Brand();
        $titleSuggestions = Brand::select('title')->distinct()->limit(20)->pluck('title');
        return view('admin.brands.form', compact('brand', 'titleSuggestions'));
    }

    /**
     * Store a newly created brand and its associated configuration.
     *
     * @param  \App\Http\Requests\Admin\BrandRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(BrandRequest $request): RedirectResponse
    {
        $brand = $this->brandService->saveBrand($request->validated());

        return redirect()->route('admin.brands.edit', $brand->id)
            ->with('success', __('Brand added successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace brand.
     *
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\View\View
     */
    public function edit(Brand $brand): View
    {
        $titleSuggestions = Brand::select('title')->distinct()->limit(20)->pluck('title');
        return view('admin.brands.form', compact('brand', 'titleSuggestions'));
    }

    /**
     * Update an existing marketplace brand configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\BrandRequest  $request
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $this->brandService->saveBrand($request->validated(), $brand);

        return redirect()->route('admin.brands.index')
            ->with('success', __('Brand updated successfully.'));
    }

    /**
     * Remove a brand configuration from the database.
     *
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Brand $brand): RedirectResponse
    {
        $brand->delete();

        return redirect()->route('admin.brands.index')
            ->with('success', __('Brand deleted successfully.'));
    }
}
