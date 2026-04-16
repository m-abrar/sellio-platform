<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\MediaLibrary\HasMedia;

class MediaController extends Controller
{
    /**
     * Handle AJAX image uploads.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image'    => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'model'    => 'required|string',
            'id'       => 'nullable|integer',
            'name'     => 'nullable|string',
            'multiple' => 'nullable|boolean',
        ]);

        $modelClass = $request->model;

        if (!class_exists($modelClass)) {
            return response()->json(['success' => false, 'message' => "Invalid model: $modelClass"], 422);
        }

        if (!in_array(HasMedia::class, class_implements($modelClass))) {
            return response()->json(['success' => false, 'message' => 'Model does not support media.'], 422);
        }

        // Find existing or create placeholder
        $model = $request->filled('id') ? $modelClass::find($request->id) : $modelClass::create();

        if (!$model) {
            return response()->json(['success' => false, 'message' => 'Model not found.'], 404);
        }

        // Determine collection (Matches your original logic)
        $isMultiple = $request->boolean('multiple');
        $collection = $isMultiple ? 'images' : 'featured_image';

        if ($request->filled('name')) {
            $collection = ($request->name === 'image') ? 'featured_image' : $request->name;
        }

        // If single image, clear previous
        if ($collection === 'featured_image') {
            $model->clearMediaCollection('featured_image');
        }

        $media = $model->addMediaFromRequest('image')->toMediaCollection($collection);

        return response()->json([
            'success'    => true,
            'media_id'   => $media->id,
            'url'        => $media->getUrl(),
            'name'       => $media->name,
            'filepath'   => $media->getPath(),
            'collection' => $collection,
        ]);
    }

    /**
     * Handle AJAX image deletion.
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|string',
            'model' => 'required|string',
            'id'    => 'required|integer',
            'name'  => 'required|string',
        ]);

        // Standardizing the model path
        $modelClass = str_starts_with($request->model, 'App\\Models\\') 
            ? $request->model 
            : 'App\\Models\\' . $request->model;

        if (!class_exists($modelClass)) {
            return response()->json(['success' => false, 'message' => 'Invalid model.']);
        }

        $model = $modelClass::find($request->id);

        if (!$model) {
            return response()->json(['success' => false, 'message' => 'Model not found.']);
        }

        $mediaItems = $model->getMedia($request->name);
        foreach ($mediaItems as $media) {
            if ($media->getUrl() === $request->image) {
                $media->delete();
                return response()->json(['success' => true]);
            }
        }

        return response()->json(['success' => false, 'message' => 'Image not found.']);
    }
}
