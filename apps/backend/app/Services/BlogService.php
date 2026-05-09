<?php

namespace App\Services;

use App\Models\Blog;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class BlogService
{
    /**
     * @param array $filters
     * @param int $perPage  <-- Pass this from the Controller
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
            'recent_posts' => Blog::active()->latest()->take(5)->get(),
        ];
    }

    /**
     * Retrieve a fully hydrated active blog post by its slug.
     */
    public function findActiveBySlug(string $slug): Blog
    {
        return Blog::where('slug', $slug)
            ->active()
            ->with(['user', 'category', 'tags', 'reviews.user', 'media'])
            ->firstOrFail();
    }

    public function getBlogDetailsData(Blog $blog): array
    {
        return [
            'blog'          => $blog,
            'related_posts' => Blog::active()
                ->where('category_id', $blog->category_id)
                ->where('id', '!=', $blog->id)
                ->limit(3)
                ->get(),
            'author_meta'   => $blog->user?->profile ?? null,
        ];
    }

    public function logBlogView(Blog $blog): void
    {
        $blog->increment('view_count');
    }
}
