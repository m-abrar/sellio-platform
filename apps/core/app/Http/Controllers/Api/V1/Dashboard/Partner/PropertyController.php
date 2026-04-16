<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\StorePropertyRequest;
use App\Http\Requests\Partner\UpdatePropertyRequest;
use App\Http\Resources\PropertyResource; // Assuming this exists
use App\Models\Property;
use App\Services\Partner\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

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
    public function index(Request $request): AnonymousResourceCollection
    {
        $properties = Property::where('user_id', Auth::id())
            ->latest()
            ->paginate($request->get('per_page', 10));

        return PropertyResource::collection($properties);
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
    public function show($id) {
        $property = Property::where('user_id', Auth::id())
            ->with(['amenities', 'media'])
            ->findOrFail($id);

        return $this->successResponse(new PropertyResource($property));
    }

    /**
     * Update the specified property.
     */
    public function update(UpdatePropertyRequest $request, $id) {
        $property = Property::where('user_id', Auth::id())->findOrFail($id);
        $user = Auth::user();

        $data = $request->validated();

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
            $property->clearMediaCollection('main_image'); // Or Property::PRIMARY_MEDIA
            $property->addMediaFromRequest('main_image')->toMediaCollection('main_image');
        }

        // 2. Sync Existing Gallery Images & Order
        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array)$request->input('existing_media_ids'));
            
            $property->getMedia('gallery')
                ->reject(fn($media) => in_array($media->id, $keepIds))
                ->each(fn($media) => $media->delete());

            \Spatie\MediaLibrary\MediaCollections\Models\Media::setNewOrder($keepIds);
        }

        // 3. Add New Gallery Images
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $property->addMedia($file)->toMediaCollection('gallery');
            }
        }
    }
}
