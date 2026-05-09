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
        $titleSuggestions = Blog::select('title')->distinct()->limit(20)->pluck('title');
        
        return view('admin.blogs.form', compact('blog', 'categories', 'tags', 'titleSuggestions'));
    }

    /**
     * Store a newly created blog post and manage its media and tag associations.
     *
     * @param  \App\Http\Requests\Admin\BlogRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(\App\Http\Requests\Admin\BlogRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id();
        
        if ($request->boolean('is_published')) {
            $validated['published_at'] = now();
        }

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
        $titleSuggestions = Blog::select('title')->distinct()->limit(20)->pluck('title');

        return view('admin.blogs.form', compact('blog', 'categories', 'tags', 'selectedTags', 'titleSuggestions'));
    }

    /**
     * Update an existing blog post and synchronize its relationships and media.
     *
     * @param  \App\Http\Requests\Admin\BlogRequest  $request
     * @param  \App\Models\Blog  $blog
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(\App\Http\Requests\Admin\BlogRequest $request, Blog $blog): RedirectResponse
    {
        $validated = $request->validated();
        
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
