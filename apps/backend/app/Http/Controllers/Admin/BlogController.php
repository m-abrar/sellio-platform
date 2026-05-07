<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class BlogController
 * Orchestrates the administrative lifecycle for marketplace content (blog posts), 
 * managing categories, polymorphic tags, and Spatie-backed media collections.
 */
class BlogController extends Controller
{
    /**
     * Display a paginated list of all blog posts with associated relationships.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $blogs = Blog::with(['category', 'user'])->latest()->paginate(10);
        return view('admin.blogs.index', compact('blogs'));
    }

    /**
     * Display a paginated list of unpublished/draft blog posts.
     *
     * @return \Illuminate\View\View
     */
    public function pending(): View
    {
        $blogs = Blog::with(['category', 'user'])->where('is_published', false)->latest()->paginate(10);
        return view('admin.blogs.index', compact('blogs'));
    }

    /**
     * Show the form for creating a new marketplace blog post.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $blog = new Blog();
        $categories = Category::where('is_blog', true)->get();
        $tags = Tag::where('is_blog', true)->get();
        
        return view('admin.blogs.form', compact('blog', 'categories', 'tags'));
    }

    /**
     * Store a newly created blog post and manage its media and tag associations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
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
            'featured_image'  => 'nullable|image|max:2048',
        ]);

        $validated['user_id'] = Auth::id();
        $validated['slug'] = $validated['slug'] ?: Str::slug($validated['title']);
        $validated['published_at'] = $request->boolean('is_published') ? now() : null;

        $blog = Blog::create($validated);

        if ($request->has('tags')) {
            $blog->tags()->sync($request->tags);
        }

        if ($request->hasFile('featured_image')) {
            $blog->addMediaFromRequest('featured_image')
                 ->toMediaCollection('featured_image');
        }

        return redirect()->route('admin.blogs.index')
            ->with('success', __('Blog post created successfully.'));
    }

    /**
     * Show the form for editing an existing marketplace blog post.
     *
     * @param  \App\Models\Blog  $blog
     * @return \Illuminate\View\View
     */
    public function edit(Blog $blog): View
    {
        $categories = Category::where('is_blog', true)->get();
        $tags = Tag::where('is_blog', true)->get();
        $selectedTags = $blog->tags->pluck('id')->toArray();

        return view('admin.blogs.form', compact('blog', 'categories', 'tags', 'selectedTags'));
    }

    /**
     * Update an existing blog post and synchronize its relationships and media.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Blog  $blog
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Blog $blog): RedirectResponse
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'slug'            => 'required|string|max:255|unique:blogs,slug,' . $blog->id,
            'category_id'     => 'required|exists:categories,id',
            'content'         => 'required|string',
            'is_published'    => 'boolean',
            'featured_image'  => 'nullable|image|max:2048',
        ]);
        
        if ($request->boolean('is_published') && !$blog->is_published) {
            $validated['published_at'] = now();
        }

        $blog->update($validated);
        $blog->tags()->sync($request->tags ?? []);

        if ($request->hasFile('featured_image')) {
            $blog->addMediaFromRequest('featured_image')
                 ->toMediaCollection('featured_image');
        }

        return redirect()->route('admin.blogs.index')
            ->with('success', __('Blog post updated successfully.'));
    }

    /**
     * Remove a blog post and its associated media from the database.
     *
     * @param  \App\Models\Blog  $blog
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Blog $blog): RedirectResponse
    {
        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('success', __('Blog post deleted successfully.'));
    }
}
