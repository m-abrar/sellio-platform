<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\StorePropertyRequest;
use App\Http\Requests\Partner\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Amenity;
use App\Models\Category;
use App\Models\Location;
use App\Models\Property;
use App\Models\Type;
use App\Services\Partner\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class PropertyController
 *
 * Orchestrates the administrative lifecycle for partner-owned real estate listings.
 * Manages complex validation, tiered subscription limits, and media synchronization
 * via the Spatie MediaLibrary integration.
 */
class PropertyController extends Controller
{
    protected PropertyService $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    /**
     * Display a listing of the partner's properties.
     */
    public function index(Request $request): JsonResponse
    {
        $properties = Property::where('user_id', Auth::id())
            ->with(['media', 'category', 'type', 'location', 'amenities'])
            ->latest()
            ->paginate($request->integer('per_page', 120));

        return $this->successResponse(
            PropertyResource::collection($properties),
            null,
            200,
            ['form' => $this->getFormData()]
        );
    }

    /**
     * Return form metadata for create/edit screens.
     */
    public function create(): JsonResponse
    {
        return $this->successResponse($this->getFormData());
    }

    /**
     * Store a newly created property.
     */
    public function store(StorePropertyRequest $request) {
        $user = Auth::user();

        if (!$this->propertyService->canCreateProperty($user)) {
            return $this->successResponse(null, __('You have reached your listing limit. Please upgrade your plan.'), 403);
        }

        $data = $request->validated();
        $data['amenities'] = $request->input('amenities', []);

        // Handle Feature limit fallback
        if ($request->input('is_featured') && !$this->propertyService->canFeatureProperty($user)) {
            $data['is_featured'] = false;
        }

        // Exclude media from the main model creation if handled via Spatie
        $cleanData = collect($data)->except(['main_image', 'gallery'])->toArray();

        
        // Using your service's logic but ensuring media is handled
        $property = $this->propertyService->saveProperty($user, $cleanData);
        
        $this->handleMedia($property, $request);

        return $this->successResponse(
            new PropertyResource($property->load('media')),
            __('Property created successfully.'),
            201
        );
    }

    /**
     * Display the specified property.
     */
    public function show($property): JsonResponse
    {
        $model = Property::where('user_id', Auth::id())
            ->where(is_numeric($property) ? 'id' : 'slug', $property)
            ->with(['amenities', 'media', 'category', 'type', 'location', 'user'])
            ->firstOrFail();

        return $this->successResponse(new PropertyResource($model));
    }

    /**
     * Update the specified property.
     */
    public function update(UpdatePropertyRequest $request, $id) {
        $property = Property::where('user_id', Auth::id())->findOrFail($id);
        $user = Auth::user();

        $data = $request->validated();
        $data['amenities'] = $request->input('amenities', []);

        // Check feature limit if trying to upgrade to featured
        if ($request->input('is_featured') && !$property->is_featured) {
            if (!$this->propertyService->canFeatureProperty($user)) {
                return $this->successResponse(null, __('Featured limit reached.'), 422);
            }
        }

        $cleanData = collect($data)->except(['main_image', 'gallery'])->toArray();

        $this->propertyService->saveProperty($user, $cleanData, $property);
        
        $this->handleMedia($property, $request);

        return $this->successResponse(
            new PropertyResource($property->fresh(['media'])),
            __('Property updated successfully.')
        );
    }

    /**
     * Remove the specified property.
     */
    public function destroy($id) {
        $property = Property::where('user_id', Auth::id())->findOrFail($id);

        // Spatie Media handles file deletion automatically on model delete
        $property->delete();

        return $this->successResponse(null, __('Property deleted successfully.')
        );
    }

    /**
     * Handle Spatie Media collections.
     */
    protected function handleMedia(Property $property, Request $request): void
    {
        // 1. Handle Primary Image (Main Image)
        if ($request->hasFile('main_image')) {
            $property->clearMediaCollection(Property::PRIMARY_MEDIA);
            $property->addMediaFromRequest('main_image')->toMediaCollection(Property::PRIMARY_MEDIA);
        } elseif ($request->filled('existing_main_media_id')) {
            $media = $property->media()
                ->whereKey((int) $request->input('existing_main_media_id'))
                ->first();

            if ($media && $media->collection_name !== Property::PRIMARY_MEDIA) {
                $property->clearMediaCollection(Property::PRIMARY_MEDIA);
                $media->collection_name = Property::PRIMARY_MEDIA;
                $media->save();
            }
        }

        // 2. Sync Existing Gallery Images & Order
        if ($request->has('sync_existing_media')) {
            $keepIds = array_map('intval', (array)$request->input('existing_media_ids'));
            
            $property->getMedia(Property::GALLERY_MEDIA)
                ->reject(fn($media) => in_array($media->id, $keepIds))
                ->each(fn($media) => $media->delete());

            if ($keepIds !== []) {
                \Spatie\MediaLibrary\MediaCollections\Models\Media::setNewOrder($keepIds);
            }
        }

        // 3. Add New Gallery Images
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $property->addMedia($file)->toMediaCollection(Property::GALLERY_MEDIA);
            }
        }
    }

    protected function getFormData(): array
    {
        return [
            'categories' => Category::where('is_property', true)->active()->get(['id', 'title']),
            'types'      => Type::where('is_property', true)->active()->get(['id', 'title']),
            'locations'  => Location::where('is_property', true)->active()->get(['id', 'title']),
            'amenities'  => Amenity::where('is_property', true)->active()->get(['id', 'title']),
        ];
    }
}
