<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\ClassifiedRequest;
use App\Http\Resources\ClassifiedResource;
use App\Models\Classified;
use App\Services\Partner\ClassifiedService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class ClassifiedController
 * Manages partner-owned classified advertisements.
 */
class ClassifiedController extends Controller
{
    protected ClassifiedService $classifiedService;

    public function __construct(ClassifiedService $classifiedService)
    {
        $this->classifiedService = $classifiedService;
    }

    public function index(Request $request): JsonResponse
    {
        $classifieds = $this->classifiedService->getPartnerClassifieds(
            Auth::user(),
            $request->integer('per_page', 120)
        );

        return $this->successResponse(
            ClassifiedResource::collection($classifieds),
            null,
            200,
            ['form' => $this->classifiedService->getFormData()]
        );
    }

    public function create(): JsonResponse
    {
        return $this->successResponse($this->classifiedService->getFormData());
    }

    public function store(ClassifiedRequest $request): JsonResponse
    {
        $data = $request->validated();
        $classified = $this->classifiedService->saveClassified(Auth::user(), $data);
        $this->handleMedia($classified, $request);

        return $this->successResponse(
            new ClassifiedResource($classified->load(['media', 'category', 'type', 'location'])),
            __('Classified created successfully!'),
            201
        );
    }

    public function show($classified): JsonResponse
    {
        $model = Classified::where('user_id', Auth::id())
            ->where(is_numeric($classified) ? 'id' : 'slug', $classified)
            ->with(['media', 'category', 'type', 'location', 'tags'])
            ->firstOrFail();

        return $this->successResponse(new ClassifiedResource($model));
    }

    public function edit(Classified $classified): JsonResponse
    {
        $this->authorizeOwner($classified);

        return $this->successResponse(
            new ClassifiedResource($classified->load(['media', 'category', 'type', 'location', 'tags']))
        );
    }

    public function update(ClassifiedRequest $request, Classified $classified): JsonResponse
    {
        $this->authorizeOwner($classified);
        $this->classifiedService->saveClassified(Auth::user(), $request->validated(), $classified);
        $this->handleMedia($classified, $request);

        return $this->successResponse(
            new ClassifiedResource($classified->fresh(['media', 'category', 'type', 'location', 'tags'])),
            __('Classified updated successfully.')
        );
    }

    public function destroy(Classified $classified): JsonResponse
    {
        $this->authorizeOwner($classified);
        $this->classifiedService->deleteClassified($classified);

        return $this->successResponse(null, __('Classified deleted successfully.'));
    }

    protected function authorizeOwner(Classified $classified): void
    {
        if (Auth::id() !== $classified->user_id) {
            abort(403, __('Unauthorized action. You do not own this classified.'));
        }
    }

    protected function handleMedia(Classified $classified, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $classified->clearMediaCollection(Classified::PRIMARY_MEDIA);
            $classified->addMediaFromRequest('main_image')->toMediaCollection(Classified::PRIMARY_MEDIA);
        }

        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array) $request->input('existing_media_ids'));

            $classified->getMedia(Classified::GALLERY_MEDIA)
                ->reject(fn ($media) => in_array($media->id, $keepIds))
                ->each(fn ($media) => $media->delete());

            Media::setNewOrder($keepIds);
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $classified->addMedia($file)->toMediaCollection(Classified::GALLERY_MEDIA);
            }
        }
    }
}
