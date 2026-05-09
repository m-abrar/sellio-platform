<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Spatie\MediaLibrary\HasMedia;

class MediaController extends Controller
{
    /**
     * Map of allowed model identifiers to their respective classes.
     */
    protected array $modelMap = [
        'auto'         => \App\Models\Auto::class,
        'property'     => \App\Models\Property::class,
        'event'        => \App\Models\Event::class,
        'job'          => \App\Models\JobListing::class,
        'service'      => \App\Models\Service::class,
        'product'      => \App\Models\Product::class,
        'classified'   => \App\Models\Classified::class,
        'blog'         => \App\Models\Blog::class,
        'user'         => \App\Models\User::class,
        'advertisement' => \App\Models\Advertisement::class,
    ];

    /**
     * Handle AJAX image uploads.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image'    => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            'model'    => 'required|string',
            'id'       => 'required|integer', // Made required to prevent auto-creation
            'name'     => 'nullable|string',
            'multiple' => 'nullable|boolean',
        ]);

        $modelKey = strtolower($request->model);
        
        if (!isset($this->modelMap[$modelKey])) {
            return response()->json(['success' => false, 'message' => "Unauthorized model access."], 403);
        }

        $modelClass = $this->modelMap[$modelKey];
        $model = $modelClass::find($request->id);

        if (!$model) {
            return response()->json(['success' => false, 'message' => 'Target resource not found.'], 404);
        }

        // Authorization check: User must own the resource or be an admin
        // (Assuming a simple ownership check or policy exists)
        if (method_exists($model, 'user') && $model->user_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
             return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $isMultiple = $request->boolean('multiple');
        $collection = $isMultiple ? 'images' : 'featured_image';

        if ($request->filled('name')) {
            $collection = ($request->name === 'image') ? 'featured_image' : $request->name;
        }

        if ($collection === 'featured_image') {
            $model->clearMediaCollection('featured_image');
        }

        $media = $model->addMediaFromRequest('image')->toMediaCollection($collection);

        return response()->json([
            'success'    => true,
            'media_id'   => $media->id,
            'url'        => $media->getUrl(),
            'name'       => $media->name,
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

        $modelKey = strtolower($request->model);
        
        if (!isset($this->modelMap[$modelKey])) {
            return response()->json(['success' => false, 'message' => "Unauthorized model access."], 403);
        }

        $modelClass = $this->modelMap[$modelKey];
        $model = $modelClass::find($request->id);

        if (!$model || !$model->hasRole('admin') && method_exists($model, 'user') && $model->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized or resource not found.'], 403);
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
