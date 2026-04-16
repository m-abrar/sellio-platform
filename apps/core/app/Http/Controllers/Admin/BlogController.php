<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index()
    {
        // Eager load category and user to optimize queries
        $blogs = Blog::with(['category', 'user'])->latest()->paginate(10);
        return view('admin.blogs.index', compact('blogs'));
    }

    public function pending()
    {
        $blogs = Blog::with(['category', 'user'])->where('is_published', false)->latest()->paginate(10);
        return view('admin.blogs.index', compact('blogs'));
    }
    /**
     * Show the form for creating a new blog post.
     */
    public function create()
    {
        // Only fetch categories and tags flagged for the blog module
        $categories = Category::where('is_blog', true)->get();
        $tags = Tag::where('is_blog', true)->get();
        
        return view('admin.blogs.form', compact('categories', 'tags'));
    }

    /**
     * Store a newly created blog post in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'slug'            => 'nullable|string|max:255|unique:blogs,slug',
            'category_id'     => 'required|exists:categories,id',
            'content'         => 'required|string',
            'subtitle'        => 'nullable|string|max:255',
            'reading_time'    => 'nullable|integer',
            'video'           => 'nullable|string',
            'is_published'    => 'boolean',
            'is_featured'     => 'boolean',
            'allow_comments'  => 'boolean',
            'featured_image'  => 'nullable|image|max:2048', // Validation for Spatie Media
        ]);

        $data = $request->all();
        $data['user_id'] = Auth::id();
        $data['slug'] = $request->slug ?: Str::slug($request->title);
        $data['published_at'] = $request->is_published ? now() : null;

        $blog = Blog::create($data);

        // Sync Tags (Polymorphic)
        if ($request->has('tags')) {
            $blog->tags()->sync($request->tags);
        }

        // --- Spatie Media Integration ---
        if ($request->hasFile('featured_image')) {
            $blog->addMediaFromRequest('featured_image')
                 ->toMediaCollection('featured_image');
        }

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog post created successfully.');
    }

    /**
     * Show the form for editing the specified blog post.
     */
    public function edit(Blog $blog)
    {
        $categories = Category::where('is_blog', true)->get();
        $tags = Tag::where('is_blog', true)->get();
        
        // Load existing tag IDs for the form
        $selectedTags = $blog->tags->pluck('id')->toArray();

        return view('admin.blogs.form', compact('blog', 'categories', 'tags', 'selectedTags'));
    }

    /**
     * Update the specified blog post in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'slug'            => 'required|string|max:255|unique:blogs,slug,' . $blog->id,
            'category_id'     => 'required|exists:categories,id',
            'content'         => 'required|string',
            'featured_image'  => 'nullable|image|max:2048',
        ]);

        $data = $request->all();
        
        // Handle publishing timestamp logic
        if ($request->is_published && !$blog->is_published) {
            $data['published_at'] = now();
        }

        $blog->update($data);

        // Update Tags
        $blog->tags()->sync($request->tags ?? []);

        // --- Spatie Media Update ---
        if ($request->hasFile('featured_image')) {
            $blog->addMediaFromRequest('featured_image')
                 ->toMediaCollection('featured_image'); // Automatically replaces old media in this collection
        }

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog post updated successfully.');
    }


    /**
     * Remove the specified blog post from storage.
     */
    public function destroy(Blog $blog)
    {
        // Spatie Media handles the deletion of associated files automatically on model delete
        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
