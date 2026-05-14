<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\Admin\CategoryRequest;
use App\Services\Admin\CategoryManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class CategoryController
 * Orchestrates the administrative management of the platform's multi-level taxonomy, 
 * coordinating hierarchical relationships and vertical-specific categorization.
 */
class CategoryController extends Controller
{
    /**
     * The category management service.
     *
     * @var \App\Services\Admin\CategoryManagementService
     */
    protected CategoryManagementService $categoryService;

    /**
     * CategoryController constructor.
     *
     * @param  \App\Services\Admin\CategoryManagementService  $categoryService
     */
    public function __construct(CategoryManagementService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a filtered and hierarchical listing of all registered categories.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::with('parent')
            ->latest()
            ->when($request->query('search'), function($q) use ($request) {
                $q->where('title', 'like', "%{$request->query('search')}%");
            })
            ->paginate(20);

        return view('admin.categories.index', compact('categories'));
    }

    /**
     * Show the form for creating a new marketplace category.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $category = new Category();
        $categories = Category::orderBy('title')->get();
        $titleSuggestions = Category::select('title')->distinct()->limit(20)->pluck('title');
        
        return view('admin.categories.form', compact('category', 'categories', 'titleSuggestions'));
    }

    /**
     * Store a newly created category and its associated configuration.
     *
     * @param  \App\Http\Requests\Admin\CategoryRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CategoryRequest $request): RedirectResponse
    {
        $category = $this->categoryService->saveCategory($request->validated());

        return redirect()->route('admin.categories.edit', $category->id)
            ->with('success', __('Category added successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace category.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\View\View
     */
    public function edit(Category $category): View
    {
        $categories = Category::where('id', '!=', $category->id)->orderBy('title')->get();
        $titleSuggestions = Category::select('title')->distinct()->limit(20)->pluck('title');
        
        return view('admin.categories.form', compact('category', 'categories', 'titleSuggestions'));
    }

    /**
     * Update an existing marketplace category configuration in the database.
     *
     * @param  \App\Http\Requests\Admin\CategoryRequest  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $this->categoryService->saveCategory($request->validated(), $category);

        return redirect()->route('admin.categories.index')
            ->with('success', __('Category updated successfully.'));
    }

    /**
     * Remove a category configuration from the database.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', __('Category deleted successfully.'));
    }
}
