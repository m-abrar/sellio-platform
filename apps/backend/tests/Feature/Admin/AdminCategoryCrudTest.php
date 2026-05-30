<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminCategoryCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_category(): void
    {
        $createResponse = $this->actingAsSuperAdmin()->post(route('admin.categories.store'), [
            'title' => 'Admin Test Category',
            'slug' => 'admin-test-category',
            'description' => 'Created by admin CRUD test.',
            'is_published' => true,
            'is_product' => true,
        ]);

        $category = Category::where('slug', 'admin-test-category')->firstOrFail();
        $createResponse->assertRedirect(route('admin.categories.edit', $category));
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'title' => 'Admin Test Category',
        ]);

        $this->actingAsSuperAdmin()->put(route('admin.categories.update', $category), [
            'title' => 'Updated Admin Category',
            'slug' => 'admin-test-category',
            'description' => 'Updated by admin CRUD test.',
            'is_published' => true,
            'is_product' => true,
        ])->assertRedirect(route('admin.categories.index'));

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'title' => 'Updated Admin Category',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.categories.destroy', $category))
            ->assertRedirect(route('admin.categories.index'));

        $this->assertNull(Category::find($category->id));
    }

    public function test_category_index_shows_seeded_row_and_search_filter(): void
    {
        Category::factory()->create(['title' => 'Filterable Category XYZ']);

        $indexResponse = $this->actingAsSuperAdmin()->get(route('admin.categories.index', ['search' => 'Test Category']));
        $indexResponse->assertOk();
        $indexResponse->assertSee('Test Category', false);

        $searchResponse = $this->actingAsSuperAdmin()->get(route('admin.categories.index', ['search' => 'Filterable Category XYZ']));
        $searchResponse->assertOk();
        $searchResponse->assertSee('Filterable Category XYZ', false);
    }
}
