<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceQuote;
use App\Models\Category;
use App\Models\Location;
use App\Http\Requests\Admin\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

use App\Traits\ManagesApproval;

class ServiceController extends Controller
{
    use ManagesApproval;

    protected $modelClass = Service::class;

    public function index(Request $request): View
    {
        $categories = Category::all();
        $locations = Location::all();

        $services = Service::query()
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.services.index', compact('services', 'categories', 'locations'));
    }

    public function create(): View
    {
        $categories = Category::all();
        $locations = Location::all();
        return view('admin.services.form', compact('categories', 'locations'));
    }

    public function store(ServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_subscription'] = $request->boolean('is_subscription');
        $validated['is_project_based'] = $request->boolean('is_project_based');

        $service = Service::create($validated);

        return redirect()
            ->route('admin.services.edit', $service->id)
            ->with('success', __('Service created successfully.'));
    }

    public function edit(Service $service): View
    {
        $categories = Category::all();
        $locations = Location::all();
        
        $recentQuotes = ServiceQuote::where('service_id', $service->id)->latest()->take(5)->get();

        return view('admin.services.form', compact('service', 'categories', 'locations', 'recentQuotes'));
    }

    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_subscription'] = $request->boolean('is_subscription');
        $validated['is_project_based'] = $request->boolean('is_project_based');

        $service->update($validated);

        return redirect()
            ->route('admin.services.edit', $service->id)
            ->with('success', __('Service updated successfully.'));
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();
        return redirect()->route('admin.services.index')->with('success', __('Service deleted successfully.'));
    }

    public function duplicate(Service $service): RedirectResponse
    {
        $clone = $service->replicate();
        $clone->is_published = false;
        $clone->approved_at = null;
        $clone->title = $service->title . ' (Copy)';
        $clone->save();

        return redirect()
            ->route('admin.services.edit', $clone->id)
            ->with('success', __('Service duplicated as draft successfully.'));
    }
}
