<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Classified;
use App\Models\Location;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithPartnerApi;
use Tests\TestCase;

class PartnerClassifiedApiTest extends TestCase
{
    use RefreshDatabase;
    use InteractsWithPartnerApi;

    public function test_partner_can_create_update_clear_fields_and_promote_existing_media(): void
    {
        Storage::fake('public');

        $partner = $this->createPartner();

        $category = Category::factory()->create(['is_classified' => true]);
        $type = Type::factory()->create(['is_classified' => true]);
        $location = Location::factory()->create(['is_classified' => true]);

        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/classifieds', [
                'title' => 'Vintage Record Player',
                'description' => 'Warm sounding turntable with fresh belt, dust cover, and original paperwork.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '450',
                'sale_price' => '400',
                'item_condition' => '8',
                'item_year_age' => '1978',
                'item_quantity' => '2',
                'item_dimensions' => '18.5',
                'warranty_months' => '3',
                'min_ad_duration' => '14',
                'address' => '24 Market Lane',
                'city' => 'Portland',
                'state' => 'OR',
                'country' => 'USA',
                'zip_code' => '97201',
                'is_published' => '1',
                'is_featured' => '1',
                'is_for_sale' => '1',
                'is_for_rent' => '1',
                'main_image' => UploadedFile::fake()->image('classified-main.jpg', 1200, 800),
                'gallery' => [
                    UploadedFile::fake()->image('classified-gallery-one.jpg', 1200, 800),
                    UploadedFile::fake()->image('classified-gallery-two.jpg', 1200, 800),
                ],
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.type_id', $type->id)
            ->assertJsonPath('data.status.is_featured', true)
            ->assertJsonPath('data.pricing.transaction_type.for_rent', true)
            ->assertJsonPath('data.item_specs.quantity', 2)
            ->assertJsonPath('data.taxonomy.type.id', $type->id);

        $classified = Classified::with('media')->findOrFail($createResponse->json('data.id'));
        $mainMediaId = $classified->getFirstMedia(Classified::PRIMARY_MEDIA)?->id;
        $galleryMediaIds = $classified->getMedia(Classified::GALLERY_MEDIA)->pluck('id')->all();

        $this->assertNotNull($mainMediaId);
        $this->assertCount(2, $galleryMediaIds);
        $this->assertDatabaseHas('classified_ads', [
            'id' => $classified->id,
            'type_id' => $type->id,
            'location_id' => $location->id,
            'sale_price' => 400,
            'item_condition' => 8,
            'item_year_age' => 1978,
            'item_quantity' => 2,
            'item_dimensions' => 18.5,
            'warranty_months' => 3,
            'min_ad_duration' => 14,
            'address' => '24 Market Lane',
            'city' => 'Portland',
            'state' => 'OR',
            'country' => 'USA',
            'zip_code' => '97201',
            'is_featured' => true,
            'is_for_rent' => true,
        ]);

        $promotedGalleryId = $galleryMediaIds[0];

        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/classifieds/{$classified->id}", [
                '_method' => 'PATCH',
                'title' => 'Vintage Record Player Updated',
                'description' => 'Updated listing with cleaned contacts and current photos.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => '',
                'base_price' => '425',
                'sale_price' => '',
                'item_condition' => '7',
                'item_year_age' => '',
                'item_quantity' => '1',
                'item_dimensions' => '',
                'warranty_months' => '',
                'min_ad_duration' => '',
                'address' => '',
                'city' => 'Portland',
                'state' => '',
                'country' => 'USA',
                'zip_code' => '',
                'is_published' => '0',
                'is_featured' => '0',
                'is_for_sale' => '1',
                'is_for_rent' => '0',
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $promotedGalleryId,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.media.main_photo_id', $promotedGalleryId)
            ->assertJsonPath('data.item_specs.age_years', null)
            ->assertJsonPath('data.item_specs.warranty_months', null)
            ->assertJsonPath('data.status.is_published', false)
            ->assertJsonPath('data.status.is_featured', false)
            ->assertJsonPath('data.pricing.transaction_type.for_rent', false)
            ->assertJsonCount(0, 'data.media.gallery');

        $classified->refresh()->load('media');

        $this->assertSame($promotedGalleryId, $classified->getFirstMedia(Classified::PRIMARY_MEDIA)?->id);
        $this->assertCount(0, $classified->getMedia(Classified::GALLERY_MEDIA));
        $this->assertDatabaseHas('classified_ads', [
            'id' => $classified->id,
            'location_id' => null,
            'sale_price' => null,
            'item_year_age' => null,
            'item_quantity' => 1,
            'item_dimensions' => null,
            'warranty_months' => null,
            'min_ad_duration' => null,
            'address' => null,
            'state' => null,
            'zip_code' => null,
            'is_published' => false,
            'is_featured' => false,
            'is_for_sale' => true,
            'is_for_rent' => false,
        ]);
    }
}
