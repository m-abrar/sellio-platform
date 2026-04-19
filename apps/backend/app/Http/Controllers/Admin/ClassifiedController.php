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

class ClassifiedController extends Controller
{
    use ManagesApproval;

    protected $modelClass = Classified::class;

    public function index(Request $request): View
    {
        $categories = Category::where('is_classified', 1)->get();
        $locations = Location::where('is_classified', 1)->get();

        $classifieds = Classified::query()
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.classifieds.index', compact('classifieds', 'categories', 'locations'));
    }

    public function create(): View
    {
        $categories = Category::all();
        $locations = Location::all();
        return view('admin.classifieds.form', compact('categories', 'locations'));
    }

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

    public function edit(Classified $classified): View
    {
        $categories = Category::all();
        $locations = Location::all();
        
        $recentInquiries = ClassifiedInquiry::where('classified_id', $classified->id)->latest()->take(5)->get();

        return view('admin.classifieds.form', compact('classified', 'categories', 'locations', 'recentInquiries'));
    }

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

    public function destroy(Classified $classified): RedirectResponse
    {
        $classified->delete();
        return redirect()->route('admin.classifieds.index')->with('success', __('Classified ad deleted successfully.'));
    }

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
