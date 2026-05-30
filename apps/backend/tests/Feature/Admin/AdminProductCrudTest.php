<?php

namespace Tests\Feature\Admin;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminProductCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_soft_delete_product(): void
    {
        $category = Category::where('is_product', true)->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.products.store'), [
            'title' => 'CRUD Test Product',
            'description' => 'Created by admin product CRUD test.',
            'base_price' => 29.99,
            'category_id' => $category->id,
            'is_published' => true,
        ])->assertRedirect(route('admin.products.index'));

        $product = Product::where('title', 'CRUD Test Product')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.products.update', $product), [
            'title' => 'Updated CRUD Product',
            'description' => 'Updated by admin product CRUD test.',
            'base_price' => 39.99,
            'category_id' => $category->id,
            'is_published' => true,
        ])->assertRedirect(route('admin.products.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Updated CRUD Product',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.products.destroy', $product))
            ->assertRedirect(route('admin.products.index'));

        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }
}
