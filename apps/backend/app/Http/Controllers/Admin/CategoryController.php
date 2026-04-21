<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\Admin\CategoryRequest;
use App\Services\Admin\CategoryManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

/**
 * Class CategoryController
 *
 * Manages administrative category listings, creation, and updates.
 */
class CategoryController extends Controller
{
    /**
     * @var CategoryManagementService
     */
    protected $categoryService;

    /**
     * CategoryController constructor.
     *
     * @param CategoryManagementService $categoryService
     */
    public function __construct(CategoryManagementService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(\Illuminate\Http\Request $request): View
    {
        $categories = Category::with('parent')
            ->latest()
            ->when($request->search, function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%");
            })
            ->get();

        return view('admin.categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new category.
     *
     * @return View
     */
    public function create(): View
    {
        $categories = Category::orderBy('title')->get();
        return view('admin.categories.form', compact('categories'));
    }

    /**
     * Store a newly created category in storage.
     *
     * @param CategoryRequest $request
     * @return RedirectResponse
     */
    public function store(CategoryRequest $request): RedirectResponse
    {
        $category = $this->categoryService->saveCategory($request->validated());

        return redirect()->route('admin.categories.edit', $category->id)
            ->with('success', __('Category added successfully.'));
    }

    /**
     * Show the form for editing the specified category.
     *
     * @param Category $category
     * @return View
     */
    public function edit(Category $category): View
    {
        
        $categories = Category::orderBy('title')->get();
        return view('admin.categories.form', compact('category', 'categories'));

    }

    /**
     * Update the specified category in storage.
     *
     * @param CategoryRequest $request
     * @param Category $category
     * @return RedirectResponse
     */
    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $this->categoryService->saveCategory($request->validated(), $category);

        return redirect()->route('admin.categories.index')
            ->with('success', __('Category updated successfully.'));
    }

    /**
     * Remove the specified category from storage.
     *
     * @param Category $category
     * @return RedirectResponse
     */
    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', __('Category deleted successfully.'));
    }
}
