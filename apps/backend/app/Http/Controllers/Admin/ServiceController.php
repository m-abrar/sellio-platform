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

/**
 * Class ServiceController
 * Orchestrates the professional services vertical, managing listing lifecycle, 
 * provider relationships, and administrative approval orchestration.
 */
class ServiceController extends Controller
{
    use ManagesApproval;

    /**
     * The model class associated with the approval trait.
     *
     * @var string
     */
    protected $modelClass = Service::class;

    /**
     * Display a filtered and paginated listing of all professional services.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::where('is_service', 1)->get();
        $locations  = Location::where('is_service', 1)->get();

        $services = Service::query()
            ->with(['user', 'category', 'location'])
            ->when($request->query('title'), fn($q) => $q->where('title', 'like', '%' . $request->query('title') . '%'))
            ->when($request->query('category_id'), fn($q) => $q->where('category_id', $request->query('category_id')))
            ->when($request->query('location_id'), fn($q) => $q->where('location_id', $request->query('location_id')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.services.index', compact('services', 'categories', 'locations'));
    }

    /**
     * Show the interface for initializing a new professional service listing.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $service    = new Service();
        $categories = Category::where('is_service', 1)->get();
        $locations  = Location::where('is_service', 1)->get();
        
        return view('admin.services.form', compact('service', 'categories', 'locations'));
    }

    /**
     * Store a newly created service and initialize its professional parameters.
     *
     * @param  \App\Http\Requests\Admin\ServiceRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ServiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id']          = auth()->id();
        $validated['is_published']     = $request->boolean('is_published');
        $validated['is_featured']      = $request->boolean('is_featured');
        $validated['is_subscription']  = $request->boolean('is_subscription');
        $validated['is_project_based'] = $request->boolean('is_project_based');

        $service = Service::create($validated);

        return redirect()
            ->route('admin.services.edit', $service->id)
            ->with('success', __('Service created successfully.'));
    }

    /**
     * Show the comprehensive edit interface, including recent quote metrics.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\View\View
     */
    public function edit(Service $service): View
    {
        $categories   = Category::where('is_service', 1)->get();
        $locations    = Location::where('is_service', 1)->get();
        $recentQuotes = ServiceQuote::where('service_id', $service->id)->latest()->take(5)->get();

        return view('admin.services.form', compact('service', 'categories', 'locations', 'recentQuotes'));
    }

    /**
     * Update an existing professional service and synchronize its parameters.
     *
     * @param  \App\Http\Requests\Admin\ServiceRequest  $request
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        $validated = $request->validated();
        $validated['is_published']     = $request->boolean('is_published');
        $validated['is_featured']      = $request->boolean('is_featured');
        $validated['is_subscription']  = $request->boolean('is_subscription');
        $validated['is_project_based'] = $request->boolean('is_project_based');

        $service->update($validated);

        return redirect()
            ->route('admin.services.edit', $service->id)
            ->with('success', __('Service updated successfully.'));
    }

    /**
     * Remove a professional service from the active marketplace.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();
        return redirect()->route('admin.services.index')->with('success', __('Service deleted successfully.'));
    }

    /**
     * Replicate a professional service as a draft copy for quick entry.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(Service $service): RedirectResponse
    {
        $clone = $service->replicate();
        $clone->is_published = false;
        $clone->approved_at  = null;
        $clone->title        = $service->title . ' ' . __('(Copy)');
        $clone->save();

        return redirect()
            ->route('admin.services.edit', $clone->id)
            ->with('success', __('Service duplicated as draft successfully.'));
    }
}
