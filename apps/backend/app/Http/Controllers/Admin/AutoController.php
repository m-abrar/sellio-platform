<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Location;
use App\Http\Requests\Admin\AutoRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

use App\Traits\ManagesApproval;

class AutoController extends Controller
{
    use ManagesApproval;

    protected $modelClass = Auto::class;

    public function index(Request $request): View
    {
        $categories = Category::all();
        $brands = Brand::all();
        $locations = Location::all();

        $autos = Auto::query()
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->brand_id, fn($q) => $q->where('brand_id', $request->brand_id))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.autos.index', compact('autos', 'categories', 'brands', 'locations'));
    }

    public function create(): View
    {
        $categories = Category::all();
        $brands = Brand::all();
        $locations = Location::all();
        return view('admin.autos.form', compact('categories', 'brands', 'locations'));
    }

    public function store(AutoRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');

        $auto = Auto::create($validated);

        return redirect()
            ->route('admin.autos.edit', $auto->id)
            ->with('success', __('Auto created successfully.'));
    }

    public function edit(Auto $auto): View
    {
        $categories = Category::all();
        $brands = Brand::all();
        $locations = Location::all();
        
        $recentInquiries = AutoInquiry::where('auto_id', $auto->id)->latest()->take(5)->get();

        return view('admin.autos.form', compact('auto', 'categories', 'brands', 'locations', 'recentInquiries'));
    }

    public function update(AutoRequest $request, Auto $auto): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');

        $auto->update($validated);

        return redirect()
            ->route('admin.autos.edit', $auto->id)
            ->with('success', __('Auto updated successfully.'));
    }

    public function destroy(Auto $auto): RedirectResponse
    {
        $auto->delete();
        return redirect()->route('admin.autos.index')->with('success', __('Auto deleted successfully.'));
    }

    public function duplicate(Auto $auto): RedirectResponse
    {
        $clone = $auto->replicate();
        $clone->is_published = false;
        $clone->approved_at = null;
        $clone->title = $auto->title . ' (Copy)';
        $clone->save();

        return redirect()
            ->route('admin.autos.edit', $clone->id)
            ->with('success', __('Auto duplicated as draft successfully.'));
    }
}
