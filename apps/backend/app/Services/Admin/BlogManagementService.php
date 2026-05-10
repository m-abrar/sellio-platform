<?php

namespace App\Services\Admin;

use App\Models\Blog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Class BlogManagementService
 * Orchestrates the administrative lifecycle for blog posts, managing persistence,
 * relationship synchronization, and media attachments.
 */
class BlogManagementService
{
    /**
     * Get paginated list of blog posts with associated metadata.
     *
     * @param bool|null $isPublished
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getBlogs(?bool $isPublished = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Blog::with(['category', 'user'])->latest();

        if ($isPublished !== null) {
            $query->where('is_published', $isPublished);
        }

        return $query->paginate($perPage);
    }

    /**
     * Create a new blog post and synchronize its dependencies.
     *
     * @param array $data
     * @return Blog
     */
    public function createBlog(array $data): Blog
    {
        return DB::transaction(function () use ($data) {
            if (isset($data['is_published']) && filter_var($data['is_published'], FILTER_VALIDATE_BOOLEAN) && !isset($data['published_at'])) {
                $data['published_at'] = now();
            }

            $blog = Blog::create($data);

            if (isset($data['tags'])) {
                $blog->tags()->sync($data['tags']);
            }

            if (isset($data['featured_image'])) {
                $blog->addMedia($data['featured_image'])
                     ->toMediaCollection('featured_image');
            }

            return $blog;
        });
    }

    /**
     * Update an existing blog post and synchronize its dependencies.
     *
     * @param Blog $blog
     * @param array $data
     * @return Blog
     */
    public function updateBlog(Blog $blog, array $data): Blog
    {
        return DB::transaction(function () use ($blog, $data) {
            if (isset($data['is_published']) && filter_var($data['is_published'], FILTER_VALIDATE_BOOLEAN) && !$blog->is_published) {
                $data['published_at'] = now();
            }

            $blog->update($data);

            if (isset($data['tags'])) {
                $blog->tags()->sync($data['tags']);
            }

            if (isset($data['featured_image'])) {
                $blog->addMedia($data['featured_image'])
                     ->toMediaCollection('featured_image');
            }

            return $blog;
        });
    }

    /**
     * Securely remove a blog post and its associated media.
     *
     * @param Blog $blog
     * @return bool|null
     */
    public function deleteBlog(Blog $blog): ?bool
    {
        return $blog->delete();
    }
}
