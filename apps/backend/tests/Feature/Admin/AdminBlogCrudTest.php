<?php

namespace Tests\Feature\Admin;

use App\Models\Blog;
use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
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

    public function test_admin_can_attach_blog_featured_image_and_gallery_assets(): void
    {
        $category = Category::where('is_blog', true)->firstOrFail();
        $blog = Blog::create([
            'user_id' => $this->admin->id,
            'category_id' => $category->id,
            'title' => 'Media Enabled Blog',
            'slug' => 'media-enabled-blog',
            'content' => 'Blog media upload coverage.',
        ]);

        $this->actingAsSuperAdmin()->postJson(route('upload.image'), [
            'image' => UploadedFile::fake()->image('blog-feature.jpg'),
            'model' => 'blog',
            'id' => $blog->id,
            'name' => Blog::PRIMARY_MEDIA,
            'multiple' => false,
        ])->assertOk()->assertJson(['success' => true]);

        $this->actingAsSuperAdmin()->postJson(route('upload.image'), [
            'image' => UploadedFile::fake()->image('blog-gallery.jpg'),
            'model' => 'blog',
            'id' => $blog->id,
            'name' => Blog::GALLERY_MEDIA,
            'multiple' => true,
        ])->assertOk()->assertJson(['success' => true]);

        $this->assertTrue(Media::where('model_type', Blog::class)
            ->where('model_id', $blog->id)
            ->where('collection_name', Blog::PRIMARY_MEDIA)
            ->where('file_name', 'blog-feature.jpg')
            ->exists());

        $this->assertTrue(Media::where('model_type', Blog::class)
            ->where('model_id', $blog->id)
            ->where('collection_name', Blog::GALLERY_MEDIA)
            ->where('file_name', 'blog-gallery.jpg')
            ->exists());
    }
}
