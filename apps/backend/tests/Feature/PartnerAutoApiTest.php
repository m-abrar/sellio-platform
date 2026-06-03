<?php

namespace Tests\Feature;

use App\Models\Auto;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithPartnerApi;
use Tests\TestCase;

class PartnerAutoApiTest extends TestCase
{
    use RefreshDatabase;
    use InteractsWithPartnerApi;

    public function test_partner_can_create_update_clear_fields_and_promote_existing_media(): void
    {
        Storage::fake('public');

        $partner = $this->createPartner();

        $category = Category::factory()->create(['is_auto' => true]);
        $brand = Brand::factory()->create(['is_auto' => true]);
        $type = Type::factory()->create(['is_auto' => true]);
        $location = Location::factory()->create(['is_auto' => true]);

        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/autos', [
                'title' => '2024 Tesla Model S Plaid',
                'description' => 'Single owner vehicle with complete service history and premium interior.',
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '89000',
                'sale_price' => '85000',
                'year' => '2024',
                'make' => 'Tesla',
                'model' => 'Model S',
                'vin_number' => '5YJSA1E26MF123456',
                'engine_type' => 'Electric',
                'transmission' => 'Automatic',
                'fuel_economy' => '120 MPGe',
                'drivetrain' => 'AWD',
                'exterior_color' => 'Pearl White',
                'mileage_value' => '4200',
                'mileage_units' => 'mi',
                'condition_rating' => '9',
                'warranty_months' => '36',
                'stock_quantity' => '3',
                'address' => '100 Market Street',
                'city' => 'Austin',
                'state' => 'TX',
                'country' => 'USA',
                'zip_code' => '78701',
                'is_published' => '1',
                'is_featured' => '1',
                'is_lease' => '1',
                'is_selling' => '1',
                'main_image' => UploadedFile::fake()->image('main.jpg', 1200, 800),
                'gallery' => [
                    UploadedFile::fake()->image('gallery-one.jpg', 1200, 800),
                    UploadedFile::fake()->image('gallery-two.jpg', 1200, 800),
                ],
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.type_id', $type->id)
            ->assertJsonPath('data.status.is_featured', true)
            ->assertJsonPath('data.pricing.is_lease', true)
            ->assertJsonPath('data.specs.stock_quantity', 3)
            ->assertJsonPath('data.taxonomy.type.id', $type->id);

        $auto = Auto::with('media')->findOrFail($createResponse->json('data.id'));
        $mainMediaId = $auto->getFirstMedia(Auto::PRIMARY_MEDIA)?->id;
        $galleryMediaIds = $auto->getMedia(Auto::GALLERY_MEDIA)->pluck('id')->all();

        $this->assertNotNull($mainMediaId);
        $this->assertCount(2, $galleryMediaIds);
        $this->assertDatabaseHas('autos', [
            'id' => $auto->id,
            'type_id' => $type->id,
            'year' => 2024,
            'make' => 'Tesla',
            'model' => 'Model S',
            'vin_number' => '5YJSA1E26MF123456',
            'engine_type' => 'Electric',
            'transmission' => 'Automatic',
            'fuel_economy' => '120 MPGe',
            'drivetrain' => 'AWD',
            'exterior_color' => 'Pearl White',
            'condition_rating' => 9,
            'warranty_months' => 36,
            'stock_quantity' => 3,
            'address' => '100 Market Street',
            'city' => 'Austin',
            'state' => 'TX',
            'country' => 'USA',
            'zip_code' => '78701',
            'is_featured' => true,
        ]);

        $promotedGalleryId = $galleryMediaIds[0];

        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/autos/{$auto->id}", [
                '_method' => 'PATCH',
                'title' => '2024 Tesla Model S Plaid Updated',
                'description' => 'Updated narrative with pricing and warranty changes.',
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '88000',
                'sale_price' => '',
                'year' => '2024',
                'make' => 'Tesla',
                'model' => 'Model S',
                'vin_number' => '',
                'engine_type' => 'Electric',
                'transmission' => 'Automatic',
                'fuel_economy' => '',
                'drivetrain' => 'AWD',
                'exterior_color' => '',
                'mileage_value' => '5100',
                'mileage_units' => 'mi',
                'condition_rating' => '',
                'warranty_months' => '',
                'stock_quantity' => '1',
                'address' => '',
                'city' => 'Austin',
                'state' => '',
                'country' => 'USA',
                'zip_code' => '',
                'is_published' => '0',
                'is_featured' => '0',
                'is_lease' => '0',
                'is_selling' => '1',
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $promotedGalleryId,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.media.main_photo_id', $promotedGalleryId)
            ->assertJsonPath('data.specs.condition', null)
            ->assertJsonPath('data.specs.warranty_months', null)
            ->assertJsonPath('data.specs.stock_quantity', 1)
            ->assertJsonPath('data.status.is_published', false)
            ->assertJsonPath('data.status.is_featured', false)
            ->assertJsonPath('data.pricing.is_lease', false)
            ->assertJsonCount(0, 'data.media.gallery');

        $auto->refresh()->load('media');

        $this->assertSame($promotedGalleryId, $auto->getFirstMedia(Auto::PRIMARY_MEDIA)?->id);
        $this->assertCount(0, $auto->getMedia(Auto::GALLERY_MEDIA));
        $this->assertDatabaseHas('autos', [
            'id' => $auto->id,
            'sale_price' => null,
            'vin_number' => null,
            'fuel_economy' => null,
            'exterior_color' => null,
            'condition_rating' => null,
            'warranty_months' => null,
            'stock_quantity' => 1,
            'address' => null,
            'state' => null,
            'zip_code' => null,
            'is_published' => false,
            'is_featured' => false,
            'is_lease' => false,
            'is_selling' => true,
        ]);
    }
}
