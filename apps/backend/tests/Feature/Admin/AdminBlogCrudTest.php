<?php

namespace Tests\Feature\Admin;

use App\Models\Blog;
use App\Models\Category;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminBlogCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_blog(): void
    {
        $category = Category::where('is_blog', true)->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.blogs.store'), [
            'title' => 'CRUD Test Blog',
            'category_id' => $category->id,
            'content' => 'Blog content for CRUD test.',
            'is_published' => true,
        ])->assertRedirect(route('admin.blogs.index'));

        $blog = Blog::where('title', 'CRUD Test Blog')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.blogs.update', $blog), [
            'title' => 'Updated CRUD Blog',
            'category_id' => $category->id,
            'content' => 'Updated blog content.',
            'is_published' => true,
        ])->assertRedirect(route('admin.blogs.index'));

        $this->assertDatabaseHas('blogs', [
            'id' => $blog->id,
            'title' => 'Updated CRUD Blog',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.blogs.destroy', $blog))
            ->assertRedirect(route('admin.blogs.index'));

        $this->assertSoftDeleted('blogs', ['id' => $blog->id]);
    }
}
