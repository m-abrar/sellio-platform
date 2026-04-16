<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use App\Models\Location;
use App\Services\Partner\ServiceService;
use App\Http\Requests\Partner\ServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Http\Resources\ServiceResource;

/**
 * Class ServiceController
 * Handles the lifecycle of professional services for partners.
 */
class ServiceController extends Controller
{
    /**
     * @var ServiceService
     */
    protected $serviceService;

    /**
     * ServiceController constructor.
     *
     * @param ServiceService $serviceService
     */
    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    /**
     * Display a listing of the partner's services.
     *
     * @return View
     */
    public function index(Request $request)
    {
        $services = Service::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return $this->successResponse(ServiceResource::collection($services));
    }

    /**
     * Show the form for creating a new service.
     *
     * @return View
     */
    public function create() {
        return $this->successResponse($this->getFormData());
    }

    /**
     * Store a newly created service in storage.
     *
     * @param ServiceRequest $request
     * @return RedirectResponse
     */
    public function store(ServiceRequest $request)
    {
        $service = $this->serviceService->saveService(Auth::user(), $request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new ServiceResource($service),
                __('Service created successfully.'),
                201
            );
        }

        return $this->successResponse(null, __('Service created successfully! Now complete the remaining details.'));
    }

    /**
     * Show the form for editing the specified service.
     *
     * @param Service $service
     * @return View
     */
    public function edit(Service $service) {
        $this->authorizeOwner($service);

        return $this->successResponse(array_merge(
            $this->getFormData(),
            ['service' => $service]
        ));
    }

    /**
     * Update the specified service in storage.
     *
     * @param ServiceRequest $request
     * @param Service $service
     * @return RedirectResponse
     */
    public function update(ServiceRequest $request, Service $service)
    {
        $this->authorizeOwner($service);

        $this->serviceService->saveService(Auth::user(), $request->validated(), $service);

        if ($request->wantsJson()) {
            return $this->successResponse(
                new ServiceResource($service->fresh()),
                __('Service updated successfully.')
            );
        }

        return $this->successResponse(null, __('Service updated successfully.'));
    }

    /**
     * Remove the specified service from storage.
     *
     * @param Service $service
     * @return RedirectResponse
     */
    public function destroy(Service $service)
    {
        $this->authorizeOwner($service);

        $service->delete();

        if (request()->wantsJson()) {
            return $this->successResponse(null, __('Service deleted successfully.')
            );
        }

        return $this->successResponse(null, __('Service deleted successfully.'));
    }

    /**
     * Fetch categories and locations for forms.
     *
     * @return array
     */
    protected function getFormData(): array
    {
        return [
            'categories' => Category::where('is_service', true)->get(),
            'locations'  => Location::all(),
        ];
    }

    /**
     * Check if the authenticated user owns the resource.
     *
     * @param Service $service
     * @return void
     */
    protected function authorizeOwner(Service $service): void
    {
        if (Auth::id() !== $service->user_id) {
            abort(403, __('Unauthorized action. You do not own this service.'));
        }
    }
}
