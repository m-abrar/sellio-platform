<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Feature;
use App\Models\Product;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PartnerProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_partner_can_create_update_and_delete_product_listing(): void
    {
        Storage::fake('public');

        // Create partner user and role
        $partner = User::factory()->partner()->create();
        Role::create(['name' => 'partner']);
        $partner->assignRole('partner');

        // Create metadata for products
        $category = Category::factory()->create(['is_product' => true]);
        $type = Type::factory()->create(['is_product' => true]);
        $brand = Brand::factory()->create(['is_product' => true]);
        $feature = Feature::create([
            'title' => 'Waterproof',
            'is_product' => true,
            'is_published' => true,
        ]);

        // 1. Create a Product Listing
        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/products', [
                'title' => 'Ultimate Running Shoes',
                'slug' => 'ultimate-running-shoes',
                'sku' => 'RUN-SHOE-001',
                'description' => 'A pair of ultimate running shoes designed for high-performance and absolute comfort.',
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'type_id' => $type->id,
                'base_price' => '120.00',
                'cost_price' => '60.00',
                'manage_stock' => '1',
                'stock_quantity' => '50',
                'low_stock_threshold' => '5',
                'weight' => '1.2',
                'length' => '30',
                'width' => '15',
                'height' => '12',
                'is_published' => '1',
                'is_featured' => '0',
                'is_digital' => '0',
                'tags' => ['Running', 'Athletic', 'Footwear'],
                'features' => [$feature->id],
                'main_image' => UploadedFile::fake()->image('shoe-main.jpg', 800, 800),
                'gallery' => [
                    UploadedFile::fake()->image('shoe-side.jpg', 800, 800),
                ],
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.title', 'Ultimate Running Shoes')
            ->assertJsonPath('data.pricing.base_price', '120.00')
            ->assertJsonPath('data.specs.sku', 'RUN-SHOE-001')
            ->assertJsonPath('data.specs.stock_quantity', 50)
            ->assertJsonPath('data.specs.weight', '1.2');

        $product = Product::with(['media', 'category', 'brand', 'type', 'features', 'tags'])->findOrFail($createResponse->json('data.id'));
        $this->assertNotNull($product->getFirstMedia(Product::PRIMARY_MEDIA));
        $this->assertCount(1, $product->getMedia(Product::GALLERY_MEDIA));
        $this->assertCount(1, $product->features);
        $this->assertCount(3, $product->tags);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'user_id' => $partner->id,
            'title' => 'Ultimate Running Shoes',
            'sku' => 'RUN-SHOE-001',
            'base_price' => '120.00',
            'stock_quantity' => 50,
            'weight' => '1.2',
            'length' => '30',
        ]);

        // 2. Update the Product Listing
        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/products/{$product->id}", [
                '_method' => 'PATCH',
                'title' => 'Ultimate Running Shoes Pro', // Modified title
                'slug' => 'ultimate-running-shoes-pro',
                'sku' => 'RUN-SHOE-001-PRO', // Modified SKU
                'description' => 'Updated pair of high performance running shoes.',
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'type_id' => $type->id,
                'base_price' => '140.00', // Increased price
                'sale_price' => '125.00',
                'cost_price' => '70.00',
                'manage_stock' => '1',
                'stock_quantity' => '100', // Increased stock
                'low_stock_threshold' => '5',
                'weight' => '1.1', // Reduced weight
                'length' => '30',
                'width' => '15',
                'height' => '12',
                'is_published' => '1',
                'is_featured' => '1',
                'is_digital' => '0',
                'tags' => ['Running', 'Pro', 'Footwear'],
                'features' => [$feature->id],
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $product->getFirstMedia(Product::PRIMARY_MEDIA)->id,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.title', 'Ultimate Running Shoes Pro')
            ->assertJsonPath('data.pricing.base_price', '140.00')
            ->assertJsonPath('data.pricing.sale_price', '125.00')
            ->assertJsonPath('data.specs.sku', 'RUN-SHOE-001-PRO')
            ->assertJsonPath('data.specs.stock_quantity', 100);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Ultimate Running Shoes Pro',
            'sku' => 'RUN-SHOE-001-PRO',
            'base_price' => '140.00',
            'sale_price' => '125.00',
            'stock_quantity' => 100,
            'weight' => '1.1',
        ]);

        // 3. Delete the Product Listing
        $deleteResponse = $this->actingAs($partner, 'sanctum')
            ->delete("/api/dashboard/partner/products/{$product->id}", [], ['Accept' => 'application/json']);

        $deleteResponse->assertOk();
        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }

    public function test_unauthorized_partner_cannot_delete_other_products(): void
    {
        Role::create(['name' => 'partner']);
        
        $partnerOne = User::factory()->partner()->create();
        $partnerOne->assignRole('partner');
        
        $partnerTwo = User::factory()->partner()->create();
        $partnerTwo->assignRole('partner');

        $product = Product::factory()->create([
            'user_id' => $partnerOne->id,
        ]);

        $response = $this->actingAs($partnerTwo, 'sanctum')
            ->delete("/api/dashboard/partner/products/{$product->id}", [], ['Accept' => 'application/json']);

        $response->assertStatus(403);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'deleted_at' => null,
        ]);
    }
}
