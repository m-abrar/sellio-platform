<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\Category;
use App\Models\Location;
use App\Http\Requests\Admin\ClassifiedRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Traits\ManagesApproval;
use App\Services\Admin\ClassifiedManagementService;

/**
 * Class ClassifiedController
 * Manages the general classifieds vertical of the marketplace, 
 * coordinating listing approval, inventory categorization, and inquiry lifecycle management.
 */
class ClassifiedController extends Controller
{
    use ManagesApproval;

    /**
     * The model class associated with the approval trait.
     *
     * @var string
     */
    protected $modelClass = Classified::class;

    /**
     * @var ClassifiedManagementService
     */
    protected $classifiedService;

    /**
     * ClassifiedController constructor.
     *
     * @param ClassifiedManagementService $classifiedService
     */
    public function __construct(ClassifiedManagementService $classifiedService)
    {
        $this->classifiedService = $classifiedService;
    }

    /**
     * Display a filtered and paginated list of all classified advertisements.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->where('is_classified', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_classified', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();

        $classifieds = Classified::query()
            ->with(['user', 'category', 'location'])
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.classifieds.index', compact('classifieds', 'categories', 'locations'));
    }

    /**
     * Show the form for creating a new classified listing.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $classified = new Classified();
        $categories = Category::active()->where('is_classified', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_classified', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        
        return view('admin.classifieds.form', compact('classified', 'categories', 'locations'));
    }

    /**
     * Store a newly created classified listing in the database.
     *
     * @param  \App\Http\Requests\Admin\ClassifiedRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ClassifiedRequest $request): RedirectResponse
    {
        try {
            $classified = $this->classifiedService->saveClassified($request->validated());

            return redirect()
                ->route('admin.classifieds.edit', $classified->id)
                ->with('success', __('Classified ad created successfully.'));
        } catch (\Exception $e) {
            Log::error("Classified Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure.'));
        }
    }

    /**
     * Show the form for editing an existing classified listing and its associated inquiries.
     *
     * @param  \App\Models\Classified  $classified
     * @return \Illuminate\View\View
     */
    public function edit(Classified $classified): View
    {
        $categories = Category::active()->where('is_classified', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_classified', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        
        $recentInquiries = ClassifiedInquiry::where('classified_id', $classified->id)->latest()->take(5)->get();

        return view('admin.classifieds.form', compact('classified', 'categories', 'locations', 'recentInquiries'));
    }

    /**
     * Update an existing classified listing in the database.
     *
     * @param  \App\Http\Requests\Admin\ClassifiedRequest  $request
     * @param  \App\Models\Classified  $classified
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ClassifiedRequest $request, Classified $classified): RedirectResponse
    {
        try {
            $this->classifiedService->saveClassified($request->validated(), $classified);

            return redirect()
                ->route('admin.classifieds.edit', $classified->id)
                ->with('success', __('Classified ad updated successfully.'));
        } catch (\Exception $e) {
            Log::error("Classified Update Failure: {$e->getMessage()}", ['id' => $classified->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
        }
    }

    /**
     * Remove a classified listing from the database.
     *
     * @param  \App\Models\Classified  $classified
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Classified $classified): RedirectResponse
    {
        $classified->delete();
        return redirect()->route('admin.classifieds.index')->with('success', __('Classified ad deleted successfully.'));
    }

    /**
     * Replicate an existing classified listing as a draft copy for quick entry.
     *
     * @param  \App\Models\Classified  $classified
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(Classified $classified): RedirectResponse
    {
        try {
            $clone = $this->classifiedService->duplicateClassified($classified);

            return redirect()
                ->route('admin.classifieds.edit', $clone->id)
                ->with('success', __('Classified replicated as draft successfully.'));
        } catch (\Exception $e) {
            Log::error("Classified Duplication Failure: {$e->getMessage()}", ['id' => $classified->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }
}
