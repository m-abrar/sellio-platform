<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\AutoRequest;
use App\Http\Resources\AutoResource;
use App\Models\Auto;
use App\Services\Partner\AutoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AutoController extends Controller
{
    protected AutoService $autoService;

    public function __construct(AutoService $autoService)
    {
        $this->autoService = $autoService;
    }

    public function index(Request $request): JsonResponse
    {
        $autos = $this->autoService->getPartnerAutos(
            Auth::user(),
            $request->integer('per_page', 120)
        );

        return $this->successResponse(
            AutoResource::collection($autos),
            null,
            200,
            ['form' => $this->autoService->getFormData()]
        );
    }

    public function create(): JsonResponse
    {
        return $this->successResponse($this->autoService->getFormData());
    }

    public function store(AutoRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['main_image', 'gallery', 'existing_media_ids']);
        $auto = $this->autoService->saveAuto(Auth::user(), $data);
        $this->handleMedia($auto, $request);

        return $this->successResponse(
            new AutoResource($auto->load(['media', 'category', 'brand', 'location'])),
            __('Vehicle listing created successfully.'),
            201
        );
    }

    public function show($auto): JsonResponse
    {
        $model = Auto::where('user_id', Auth::id())
            ->where(is_numeric($auto) ? 'id' : 'slug', $auto)
            ->with(['media', 'category', 'brand', 'location', 'user', 'features'])
            ->firstOrFail();

        return $this->successResponse(new AutoResource($model));
    }

    public function update(AutoRequest $request, Auto $auto): JsonResponse
    {
        $this->authorizeOwner($auto);

        $data = $request->safe()->except(['main_image', 'gallery', 'existing_media_ids']);
        $this->autoService->saveAuto(Auth::user(), $data, $auto);
        $this->handleMedia($auto, $request);

        return $this->successResponse(
            new AutoResource($auto->fresh(['media', 'category', 'brand', 'location'])),
            __('Vehicle updated successfully.')
        );
    }

    public function destroy(Auto $auto): JsonResponse
    {
        $this->authorizeOwner($auto);
        $this->autoService->deleteAuto($auto);

        return $this->successResponse(null, __('Vehicle deleted successfully.'));
    }

    protected function authorizeOwner(Auto $auto): void
    {
        if (Auth::id() !== $auto->user_id) {
            abort(403, __('Unauthorized access to this vehicle.'));
        }
    }

    protected function handleMedia(Auto $auto, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $auto->clearMediaCollection(Auto::PRIMARY_MEDIA);
            $auto->addMediaFromRequest('main_image')->toMediaCollection(Auto::PRIMARY_MEDIA);
        }

        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array) $request->input('existing_media_ids'));

            $auto->getMedia(Auto::GALLERY_MEDIA)
                ->reject(fn ($media) => in_array($media->id, $keepIds))
                ->each(fn ($media) => $media->delete());

            \Spatie\MediaLibrary\MediaCollections\Models\Media::setNewOrder($keepIds);
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $auto->addMedia($file)->toMediaCollection(Auto::GALLERY_MEDIA);
            }
        }
    }
}
