<?php

namespace App\Services;

use App\Models\Blog;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

/**
 * Class BlogService
 *
 * Provides business logic for blog post retrieval, filtering, and analytics tracking.
 */
class BlogService
{
    /**
     * Retrieve all data required for the blog listing page, including filters and recent posts.
     *
     * @param array $filters
     * @param int $perPage
     * @return array
     */
    public function getBlogListPageData(array $filters, int $perPage = 12): array
    {
        $query = Blog::query()->active()->with(['user', 'category', 'tags', 'media']);

        if (!empty($filters['category'])) {
            $query->whereHas('category', fn($q) => $q->where('slug', $filters['category']));
        }

        if (!empty($filters['tag'])) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $filters['tag']));
        }

        if (!empty($filters['search'])) {
            $query->where(fn($q) => 
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('content', 'like', '%' . $filters['search'] . '%')
            );
        }

        $sort = $filters['sort'] ?? 'latest';
        match ($sort) {
            'popular' => $query->orderBy('view_count', 'desc'),
            'oldest'  => $query->orderBy('created_at', 'asc'),
            default   => $query->orderBy('created_at', 'desc'),
        };

        return [
            // Ensure paginate() is called using the variable
            'blogs'        => $query->paginate($perPage)->withQueryString(),
            'categories'   => Cache::remember('blog_categories', 3600, fn() => Category::where('is_blog', true)->active()->get()),
            'recent_posts' => Blog::active()->with(['user', 'category', 'media'])->latest()->take(5)->get(),
        ];
    }

    /**
     * Retrieve a fully hydrated active blog post by its slug.
     *
     * @param string $slug
     * @return Blog
     */
    public function findActiveBySlug(string $slug): Blog
    {
        return Blog::where('slug', $slug)
            ->active()
            ->with(['user', 'category', 'tags', 'reviews.user', 'media'])
            ->firstOrFail();
    }

    /**
     * Prepare data for the blog post detail view.
     *
     * @param Blog $blog
     * @return array
     */
    public function getBlogDetailsData(Blog $blog): array
    {
        return [
            'blog'          => $blog,
            'related_posts' => Blog::active()
                ->where('category_id', $blog->category_id)
                ->where('id', '!=', $blog->id)
                ->with(['user', 'category', 'media'])
                ->limit(3)
                ->get(),
            'author_meta'   => $blog->user?->profile ?? null,
        ];
    }

    /**
     * Increment the view counter for a specific blog post.
     *
     * @param Blog $blog
     * @return void
     */
    public function logBlogView(Blog $blog): void
    {
        $blog->increment('view_count');
    }
}
