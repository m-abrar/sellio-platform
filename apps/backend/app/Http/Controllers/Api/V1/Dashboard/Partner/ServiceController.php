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
        $user = Auth::user();
        if ($user->hasReachedListingLimit()) {
            return $this->successResponse(null, __('You have reached your listing limit. Please upgrade your plan.'), 403);
        }

        $data = $request->safe()->except(['main_image', 'gallery', 'existing_main_media_id', 'existing_media_ids', 'sync_existing_media']);
        $service = $this->serviceService->saveService($user, $data);
        $this->handleMedia($service, $request);

        return $this->successResponse(
            new ServiceResource($service->load(['media', 'category', 'brand', 'type', 'location', 'features', 'tags'])),
            __('Service created successfully.'),
            201
        );
    }

    public function show($service): JsonResponse
    {
        $model = Service::where('user_id', Auth::id())
            ->where(is_numeric($service) ? 'id' : 'slug', $service)
            ->with(['media', 'category', 'brand', 'type', 'location', 'features', 'tags'])
            ->firstOrFail();

        return $this->successResponse(new ServiceResource($model));
    }

    public function edit(Service $service): JsonResponse
    {
        $this->authorizeOwner($service);

        return $this->successResponse(
            new ServiceResource($service->load(['media', 'category', 'brand', 'type', 'location', 'features', 'tags']))
        );
    }

    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $this->authorizeOwner($service);

        $data = $request->safe()->except(['main_image', 'gallery', 'existing_main_media_id', 'existing_media_ids', 'sync_existing_media']);
        $this->serviceService->saveService(Auth::user(), $data, $service);
        $this->handleMedia($service, $request);

        return $this->successResponse(
            new ServiceResource($service->fresh(['media', 'category', 'brand', 'type', 'location', 'features', 'tags'])),
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
        } elseif ($request->filled('existing_main_media_id')) {
            $media = $service->media()
                ->whereKey((int) $request->input('existing_main_media_id'))
                ->first();

            if ($media && $media->collection_name !== Service::PRIMARY_MEDIA) {
                $service->clearMediaCollection(Service::PRIMARY_MEDIA);
                $media->collection_name = Service::PRIMARY_MEDIA;
                $media->save();
            }
        }

        if ($request->has('sync_existing_media')) {
            $keepIds = array_map('intval', (array) $request->input('existing_media_ids'));

            $service->getMedia(Service::GALLERY_MEDIA)
                ->reject(fn ($media) => in_array($media->id, $keepIds))
                ->each(fn ($media) => $media->delete());

            if ($keepIds !== []) {
                Media::setNewOrder($keepIds);
            }
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $service->addMedia($file)->toMediaCollection(Service::GALLERY_MEDIA);
            }
        }
    }
}
