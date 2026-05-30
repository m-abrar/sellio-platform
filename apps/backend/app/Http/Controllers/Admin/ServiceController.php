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
use App\Services\Admin\ServiceManagementService;
use Illuminate\Support\Facades\Log;

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
     * @var ServiceManagementService
     */
    protected $serviceManagement;

    /**
     * ServiceController constructor.
     *
     * @param ServiceManagementService $serviceManagement
     */
    public function __construct(ServiceManagementService $serviceManagement)
    {
        $this->serviceManagement = $serviceManagement;
    }

    /**
     * Display a filtered and paginated listing of all professional services.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->where('is_service', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_service', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();

        $services = Service::query()
            ->with(['user', 'category', 'location', 'media'])
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
        $categories = Category::active()->where('is_service', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_service', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        
        $titleSuggestions = Service::select('title')->distinct()->limit(20)->pluck('title');
        
        return view('admin.services.form', compact('service', 'categories', 'locations', 'titleSuggestions'));
    }

    /**
     * Store a newly created service and initialize its professional parameters.
     *
     * @param  \App\Http\Requests\Admin\ServiceRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ServiceRequest $request): RedirectResponse
    {
        try {
            $service = $this->serviceManagement->saveService($request->validated());

            return redirect()
                ->route('admin.services.edit', $service->id)
                ->with('success', __('Service created successfully.'));
        } catch (\Exception $e) {
            Log::error("Service Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure.'));
        }
    }

    /**
     * Show the comprehensive edit interface, including recent quote metrics.
     *
     * @param  \App\Models\Service  $service
     * @return \Illuminate\View\View
     */
    public function edit(Service $service): View
    {
        $categories   = Category::active()->where('is_service', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations    = Location::active()->where('is_service', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        $recentQuotes = ServiceQuote::where('service_id', $service->id)->latest()->take(5)->get();
        $titleSuggestions = Service::select('title')->distinct()->limit(20)->pluck('title');

        return view('admin.services.form', compact('service', 'categories', 'locations', 'recentQuotes', 'titleSuggestions'));
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
        try {
            $this->serviceManagement->saveService($request->validated(), $service);

            return redirect()
                ->route('admin.services.edit', $service->id)
                ->with('success', __('Service updated successfully.'));
        } catch (\Exception $e) {
            Log::error("Service Update Failure: {$e->getMessage()}", ['id' => $service->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
        }
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
        try {
            $clone = $this->serviceManagement->duplicateService($service);

            return redirect()
                ->route('admin.services.edit', $clone->id)
                ->with('success', __('Service duplicated as draft successfully.'));
        } catch (\Exception $e) {
            Log::error("Service Duplication Failure: {$e->getMessage()}", ['id' => $service->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }
}
