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
     * Display a filtered and paginated list of all classified advertisements.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::where('is_classified', 1)->get();
        $locations = Location::where('is_classified', 1)->get();

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
        $categories = Category::where('is_classified', 1)->get();
        $locations = Location::where('is_classified', 1)->get();
        
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
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_for_rent'] = $request->boolean('is_for_rent');
        $validated['is_for_sale'] = $request->boolean('is_for_sale');

        $classified = Classified::create($validated);

        return redirect()
            ->route('admin.classifieds.edit', $classified->id)
            ->with('success', __('Classified ad created successfully.'));
    }

    /**
     * Show the form for editing an existing classified listing and its associated inquiries.
     *
     * @param  \App\Models\Classified  $classified
     * @return \Illuminate\View\View
     */
    public function edit(Classified $classified): View
    {
        $categories = Category::where('is_classified', 1)->get();
        $locations = Location::where('is_classified', 1)->get();
        
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
        $validated = $request->validated();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_for_rent'] = $request->boolean('is_for_rent');
        $validated['is_for_sale'] = $request->boolean('is_for_sale');

        $classified->update($validated);

        return redirect()
            ->route('admin.classifieds.edit', $classified->id)
            ->with('success', __('Classified ad updated successfully.'));
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
        $clone = $classified->replicate();
        $clone->is_published = false;
        $clone->approved_at = null;
        $clone->title = $classified->title . ' (Copy)';
        $clone->save();

        return redirect()
            ->route('admin.classifieds.edit', $clone->id)
            ->with('success', __('Classified replicated as draft successfully.'));
    }
}
