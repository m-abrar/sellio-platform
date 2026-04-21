<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Http\Requests\Admin\BrandRequest;
use App\Services\Admin\BrandManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class BrandController
 *
 * Manages administrative brand listings and module assignments.
 */
class BrandController extends Controller
{
    /**
     * @var BrandManagementService
     */
    protected $brandService;

    /**
     * BrandController constructor.
     *
     * @param BrandManagementService $brandService
     */
    public function __construct(BrandManagementService $brandService)
    {
        $this->brandService = $brandService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $brands = Brand::latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->get();

        return view('admin.brands.index', compact('brands'));
    }

    /**
     * Show the form for creating a new brand.
     *
     * @return View
     */
    public function create(): View
    {
        return view('admin.brands.form');
    }

    /**
     * Store a newly created brand in storage.
     *
     * @param BrandRequest $request
     * @return RedirectResponse
     */
    public function store(BrandRequest $request): RedirectResponse
    {
        $brand = $this->brandService->saveBrand($request->validated());

        return redirect()->route('admin.brands.edit', $brand->id)
            ->with('success', __('Brand added successfully.'));
    }

    /**
     * Show the form for editing the specified brand.
     *
     * @param Brand $brand
     * @return View
     */
    public function edit(Brand $brand): View
    {
        return view('admin.brands.form', compact('brand'));
    }

    /**
     * Update the specified brand in storage.
     *
     * @param BrandRequest $request
     * @param Brand $brand
     * @return RedirectResponse
     */
    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $this->brandService->saveBrand($request->validated(), $brand);

        return redirect()->route('admin.brands.index')
            ->with('success', __('Brand updated successfully.'));
    }

    /**
     * Remove the specified brand from storage.
     *
     * @param Brand $brand
     * @return RedirectResponse
     */
    public function destroy(Brand $brand): RedirectResponse
    {
        $brand->delete();

        return redirect()->route('admin.brands.index')
            ->with('success', __('Brand deleted successfully.'));
    }
}
