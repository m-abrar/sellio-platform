<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\Partner\ServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class ServiceController
 * Handles the lifecycle of professional services for partners.
 */
class ServiceController extends Controller
{
    protected ServiceService $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function index(Request $request): JsonResponse
    {
        $services = $this->serviceService->getPartnerServices(
            Auth::user(),
            $request->integer('per_page', 120)
        );

        return $this->successResponse(
            ServiceResource::collection($services),
            null,
            200,
            ['form' => $this->serviceService->getFormData()]
        );
    }

    public function create(): JsonResponse
    {
        return $this->successResponse($this->serviceService->getFormData());
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['main_image', 'gallery', 'existing_media_ids']);
        $service = $this->serviceService->saveService(Auth::user(), $data);
        $this->handleMedia($service, $request);

        return $this->successResponse(
            new ServiceResource($service->load(['media', 'category', 'location'])),
            __('Service created successfully.'),
            201
        );
    }

    public function show($service): JsonResponse
    {
        $model = Service::where('user_id', Auth::id())
            ->where(is_numeric($service) ? 'id' : 'slug', $service)
            ->with(['media', 'category', 'location', 'features'])
            ->firstOrFail();

        return $this->successResponse(new ServiceResource($model));
    }

    public function edit(Service $service): JsonResponse
    {
        $this->authorizeOwner($service);

        return $this->successResponse(
            new ServiceResource($service->load(['media', 'category', 'location', 'features']))
        );
    }

    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $this->authorizeOwner($service);

        $data = $request->safe()->except(['main_image', 'gallery', 'existing_media_ids']);
        $this->serviceService->saveService(Auth::user(), $data, $service);
        $this->handleMedia($service, $request);

        return $this->successResponse(
            new ServiceResource($service->fresh(['media', 'category', 'location', 'features'])),
            __('Service updated successfully.')
        );
    }

    public function destroy(Service $service): JsonResponse
    {
        $this->authorizeOwner($service);
        $this->serviceService->deleteService($service);

        return $this->successResponse(null, __('Service deleted successfully.'));
    }

    protected function authorizeOwner(Service $service): void
    {
        if (Auth::id() !== $service->user_id) {
            abort(403, __('Unauthorized action. You do not own this service.'));
        }
    }

    protected function handleMedia(Service $service, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $service->clearMediaCollection(Service::PRIMARY_MEDIA);
            $service->addMediaFromRequest('main_image')->toMediaCollection(Service::PRIMARY_MEDIA);
        }

        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array) $request->input('existing_media_ids'));

            $service->getMedia(Service::GALLERY_MEDIA)
                ->reject(fn ($media) => in_array($media->id, $keepIds))
                ->each(fn ($media) => $media->delete());

            Media::setNewOrder($keepIds);
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $service->addMedia($file)->toMediaCollection(Service::GALLERY_MEDIA);
            }
        }
    }
}
