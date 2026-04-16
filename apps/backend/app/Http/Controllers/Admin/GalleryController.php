<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Support\Str;

class GalleryController extends Controller
{
    /**
     * Display a listing of ALL media in the system.
     */
    public function index(Request $request)
    {
        $query = Media::with('model')->latest();

        // Filter by Model Type (Source)
        if ($request->filled('source')) {
            $source = $request->source;
            if ($source === 'Gallery') {
                $query->where('model_type', Gallery::class);
            } else {
                $query->where('model_type', 'LIKE', '%' . $source);
            }
        }

        // Search by File Name or Collection
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('file_name', 'LIKE', "%$search%")
                  ->orWhere('collection_name', 'LIKE', "%$search%");
            });
        }

        $mediaItems = $query->paginate(24)->withQueryString();

        // Get unique model types for the filter dropdown
        $sources = Media::distinct()->pluck('model_type')->map(function($type) {
            return Str::afterLast($type, '\\');
        })->unique();

        return view('admin.gallery.index', compact('mediaItems', 'sources'));
    }

    /**
     * Store a new "Standalone" asset (attached to the Gallery model).
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'title' => 'nullable|string|max:255',
        ]);

        // We use a "Default" Gallery record or create a new one for each standalone asset
        // This ensures every image has a parent model (Spatie requirement)
        $gallery = Gallery::create([
            'title' => $request->title ?: 'Upload ' . now()->format('Y-m-d H:i'),
        ]);

        if ($request->hasFile('image')) {
            $gallery->addMediaFromRequest('image')->toMediaCollection('images');
        }

        return back()->with('success', '🖼️ New standalone asset added to gallery!');
    }

    /**
     * Replace any media file in the system.
     */
    public function update(Request $request, $id)
    {
        $media = Media::findOrFail($id);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $model = $media->model;
        $collection = $media->collection_name;

        if (!$model) {
            return back()->with('error', '❌ Parent model not found or deleted.');
        }

        // 1. Delete the old media item
        $media->delete();

        // 2. Add the new one to the same collection on the same parent model
        $model->addMediaFromRequest('image')->toMediaCollection($collection);

        return back()->with('success', '🔄 Asset replaced successfully on ' . Str::afterLast(get_class($model), '\\') . '!');
    }

    /**
     * Delete any media record.
     */
    public function destroy($id)
    {
        $media = Media::findOrFail($id);
        
        // This removes the DB record and the physical file
        $media->delete();

        return back()->with('success', '🗑️ Media asset removed successfully!');
    }
}
