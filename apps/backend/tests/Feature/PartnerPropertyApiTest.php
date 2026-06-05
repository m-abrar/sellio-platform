<?php

namespace Tests\Feature;

use App\Models\Amenity;
use App\Models\Category;
use App\Models\Location;
use App\Models\Property;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithPartnerApi;
use Tests\TestCase;

class PartnerPropertyApiTest extends TestCase
{
    use RefreshDatabase;
    use InteractsWithPartnerApi;

    public function test_partner_can_create_update_and_delete_property_listing(): void
    {
        Storage::fake('public');

        // Create partner user and role
        $partner = $this->createPartner();

        // Create metadata for properties
        $category = Category::factory()->create(['is_property' => true]);
        $type = Type::factory()->create(['is_property' => true]);
        $location = Location::factory()->create(['is_property' => true]);
        $amenity = Amenity::create([
            'title' => 'WiFi',
            'is_property' => true,
            'is_published' => true,
        ]);

        // 1. Create a Property Listing
        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/properties', [
                'title' => 'Luxury Beachfront Villa',
                'description' => 'Stunning beachfront villa with private pool and beautiful sunset views.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '450000',
                'is_sale' => '1',
                'is_rental' => '0',
                'number_of_bedrooms' => '4',
                'number_of_bathrooms' => '3',
                'area_sq_ft' => '3200',
                'year_built' => '2022',
                'address' => '123 Ocean Drive',
                'city' => 'Miami',
                'country' => 'USA',
                'is_published' => '1',
                'amenities' => [$amenity->id],
                'scores' => [
                    ['title' => 'Walk Score', 'score' => '82', 'units' => '/100', 'description' => 'Very Walkable'],
                ],
                'seasonal_prices' => [
                    [
                        'season_name' => 'Holiday Season',
                        'start_date' => now()->addMonths(4)->toDateString(),
                        'end_date' => now()->addMonths(5)->toDateString(),
                        'price' => '320',
                    ],
                ],
                'main_image' => UploadedFile::fake()->image('villa-main.jpg', 1200, 800),
                'gallery' => [
                    UploadedFile::fake()->image('villa-pool.jpg', 1200, 800),
                ],
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.title', 'Luxury Beachfront Villa')
            ->assertJsonPath('data.status.is_sale', true)
            ->assertJsonPath('data.specs.bedrooms', '4')
            ->assertJsonPath('data.specs.bathrooms', '3')
            ->assertJsonPath('data.specs.area_sq_ft', '3200')
            ->assertJsonPath('data.location.address', '123 Ocean Drive')
            ->assertJsonPath('data.location.city', 'Miami');

        $property = Property::with('media')->findOrFail($createResponse->json('data.id'));
        $this->assertNotNull($property->getFirstMedia(Property::PRIMARY_MEDIA));
        $this->assertCount(1, $property->getMedia(Property::GALLERY_MEDIA));
        
        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'user_id' => $partner->id,
            'title' => 'Luxury Beachfront Villa',
            'base_price' => '450000',
            'is_sale' => true,
            'number_of_bedrooms' => 4,
            'number_of_bathrooms' => 3,
            'address' => '123 Ocean Drive',
            'city' => 'Miami',
        ]);

        $this->assertDatabaseHas('property_scores', [
            'property_id' => $property->id,
            'title' => 'Walk Score',
            'score' => 82,
        ]);

        $this->assertDatabaseHas('seasonal_prices', [
            'property_id' => $property->id,
            'title' => 'Holiday Season',
            'price' => 320,
        ]);

        // 2. Update the Property Listing
        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/properties/{$property->id}", [
                '_method' => 'PATCH',
                'title' => 'Luxury Beachfront Villa Updated',
                'description' => 'Updated beachfront villa details with more rooms.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '475000',
                'is_sale' => '1',
                'is_rental' => '0',
                'number_of_bedrooms' => '5', // Increased bedrooms
                'number_of_bathrooms' => '4', // Increased bathrooms
                'area_sq_ft' => '3500',
                'year_built' => '2022',
                'address' => '123 Ocean Drive Updated',
                'city' => 'Miami',
                'country' => 'USA',
                'is_published' => '1',
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $property->getFirstMedia(Property::PRIMARY_MEDIA)->id,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.title', 'Luxury Beachfront Villa Updated')
            ->assertJsonPath('data.specs.bedrooms', 5)
            ->assertJsonPath('data.specs.bathrooms', 4)
            ->assertJsonPath('data.location.address', '123 Ocean Drive Updated');

        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'title' => 'Luxury Beachfront Villa Updated',
            'base_price' => '475000',
            'number_of_bedrooms' => 5,
            'number_of_bathrooms' => 4,
            'address' => '123 Ocean Drive Updated',
        ]);

        // 3. Delete the Property Listing
        $deleteResponse = $this->actingAs($partner, 'sanctum')
            ->delete("/api/dashboard/partner/properties/{$property->id}", [], ['Accept' => 'application/json']);

        $deleteResponse->assertOk();
        $this->assertSoftDeleted('properties', [
            'id' => $property->id,
        ]);
    }

    public function test_unauthorized_partner_cannot_delete_other_properties(): void
    {
        Role::create(['name' => 'partner']);
        
        $partnerOne = User::factory()->partner()->create();
        $partnerOne->assignRole('partner');
        
        $partnerTwo = User::factory()->partner()->create();
        $partnerTwo->assignRole('partner');

        $property = Property::factory()->create([
            'user_id' => $partnerOne->id,
        ]);

        $response = $this->actingAs($partnerTwo, 'sanctum')
            ->delete("/api/dashboard/partner/properties/{$property->id}", [], ['Accept' => 'application/json']);

        $response->assertStatus(404);
        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'deleted_at' => null,
        ]);
    }
}
