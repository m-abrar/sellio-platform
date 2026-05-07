<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class GalleryController
 * Orchestrates global media inventory management, providing a centralized interface 
 * for viewing, uploading, and replacing assets across all Spatie-backed model collections.
 */
class GalleryController extends Controller
{
    /**
     * Display a paginated listing of all media assets in the system with advanced source filtering.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $query = Media::with('model')->latest();

        // Source-based filtering (e.g., Blog, Auto, Gallery)
        if ($request->filled('source')) {
            $source = $request->input('source');
            if ($source === 'Gallery') {
                $query->where('model_type', Gallery::class);
            } else {
                $query->where('model_type', 'LIKE', '%' . $source);
            }
        }

        // Semantic search by filename or collection name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('file_name', 'LIKE', "%$search%")
                  ->orWhere('collection_name', 'LIKE', "%$search%");
            });
        }

        $mediaItems = $query->paginate(24)->withQueryString();

        // Dynamically resolve unique source types for the filter dropdown
        $sources = Media::distinct()->pluck('model_type')->map(function($type) {
            return Str::afterLast($type, '\\');
        })->unique();

        return view('admin.gallery.index', compact('mediaItems', 'sources'));
    }

    /**
     * Store a new standalone media asset associated with the Gallery system.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'title' => 'nullable|string|max:255',
        ]);

        // Standalone assets require a parent model; we create a Gallery record as the host
        $gallery = Gallery::create([
            'title' => $request->input('title') ?: 'Upload ' . now()->format('Y-m-d H:i'),
        ]);

        if ($request->hasFile('image')) {
            $gallery->addMediaFromRequest('image')->toMediaCollection('images');
        }

        return back()->with('success', __('🖼️ New standalone asset added to gallery!'));
    }

    /**
     * Replace an existing media asset while maintaining its relationship and collection mapping.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $media = Media::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $model = $media->model;
        $collection = $media->collection_name;

        if (!$model) {
            return back()->with('error', __('❌ Parent model not found or deleted.'));
        }

        // Atomically replace the media by removing the old record and injecting the new one
        $media->delete();
        $model->addMediaFromRequest('image')->toMediaCollection($collection);

        return back()->with('success', __('🔄 Asset replaced successfully on :type!', [
            'type' => Str::afterLast(get_class($model), '\\')
        ]));
    }

    /**
     * Remove a media asset and its physical file from the storage system.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $media = Media::findOrFail($id);
        $media->delete();

        return back()->with('success', __('🗑️ Media asset removed successfully!'));
    }
}
