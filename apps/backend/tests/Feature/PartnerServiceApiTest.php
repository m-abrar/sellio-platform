<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Location;
use App\Models\Service;
use App\Models\Type;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PartnerServiceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_partner_can_create_update_clear_fields_and_promote_existing_media(): void
    {
        Storage::fake('public');

        $partner = User::factory()->partner()->create();
        Role::create(['name' => 'partner']);
        $partner->assignRole('partner');

        $category = Category::factory()->create(['is_service' => true]);
        $type = Type::factory()->create(['is_service' => true]);
        $location = Location::factory()->create(['is_service' => true]);

        $createResponse = $this->actingAs($partner, 'sanctum')
            ->post('/api/dashboard/partner/services', [
                'title' => 'Architectural Photography Package',
                'description' => 'Professional interior and exterior photography with editing and delivery.',
                'category_id' => $category->id,
                'type_id' => $type->id,
                'location_id' => $location->id,
                'base_price' => '1200',
                'sale_price' => '900',
                'operating_hours' => '09:00 AM - 06:00 PM',
                'operating_days_label' => 'Monday - Friday',
                'licenses_certs' => 'https://portfolio.example.com',
                'expertise_level' => '4',
                'availability_schedule' => '2',
                'service_radius' => '35',
                'min_contract_months' => '6',
                'max_client_slots' => '12',
                'address' => '500 Studio Avenue',
                'city' => 'Seattle',
                'state' => 'WA',
                'country' => 'USA',
                'zip_code' => '98101',
                'is_published' => '1',
                'is_featured' => '1',
                'is_subscription' => '1',
                'is_project_based' => '1',
                'main_image' => UploadedFile::fake()->image('service-main.jpg', 1200, 800),
                'gallery' => [
                    UploadedFile::fake()->image('service-gallery-one.jpg', 1200, 800),
                    UploadedFile::fake()->image('service-gallery-two.jpg', 1200, 800),
                ],
            ], ['Accept' => 'application/json']);

        $createResponse->assertCreated()
            ->assertJsonPath('data.type_id', $type->id)
            ->assertJsonPath('data.status.is_featured', true)
            ->assertJsonPath('data.pricing.billing_type.is_subscription', true)
            ->assertJsonPath('data.operations.client_slots.max', 12)
            ->assertJsonPath('data.professional.type.id', $type->id);

        $service = Service::with('media')->findOrFail($createResponse->json('data.id'));
        $mainMediaId = $service->getFirstMedia(Service::PRIMARY_MEDIA)?->id;
        $galleryMediaIds = $service->getMedia(Service::GALLERY_MEDIA)->pluck('id')->all();

        $this->assertNotNull($mainMediaId);
        $this->assertCount(2, $galleryMediaIds);
        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'type_id' => $type->id,
            'location_id' => $location->id,
            'sale_price' => 900,
            'operating_hours' => '09:00 AM - 06:00 PM',
            'operating_days_label' => 'Monday - Friday',
            'licenses_certs' => 'https://portfolio.example.com',
            'expertise_level' => 4,
            'availability_schedule' => 2,
            'service_radius' => 35,
            'min_contract_months' => 6,
            'max_client_slots' => 12,
            'address' => '500 Studio Avenue',
            'city' => 'Seattle',
            'state' => 'WA',
            'country' => 'USA',
            'zip_code' => '98101',
            'is_featured' => true,
            'is_subscription' => true,
            'is_project_based' => true,
        ]);

        $promotedGalleryId = $galleryMediaIds[0];

        $updateResponse = $this->actingAs($partner, 'sanctum')
            ->post("/api/dashboard/partner/services/{$service->id}", [
                '_method' => 'PATCH',
                'title' => 'Architectural Photography Package Updated',
                'description' => 'Updated service package with revised availability.',
                'category_id' => $category->id,
                'type_id' => '',
                'location_id' => '',
                'base_price' => '1100',
                'sale_price' => '',
                'operating_hours' => '',
                'operating_days_label' => '',
                'licenses_certs' => '',
                'expertise_level' => '3',
                'availability_schedule' => '1',
                'service_radius' => '',
                'min_contract_months' => '',
                'max_client_slots' => '',
                'address' => '',
                'city' => 'Remote',
                'state' => '',
                'country' => 'Global',
                'zip_code' => '',
                'is_published' => '0',
                'is_featured' => '0',
                'is_subscription' => '0',
                'is_project_based' => '1',
                'sync_existing_media' => '1',
                'existing_main_media_id' => (string) $promotedGalleryId,
            ], ['Accept' => 'application/json']);

        $updateResponse->assertOk()
            ->assertJsonPath('data.media.main_photo_id', $promotedGalleryId)
            ->assertJsonPath('data.type_id', null)
            ->assertJsonPath('data.operations.radius', null)
            ->assertJsonPath('data.pricing.min_contract_months', null)
            ->assertJsonPath('data.status.is_published', false)
            ->assertJsonPath('data.status.is_featured', false)
            ->assertJsonPath('data.pricing.billing_type.is_subscription', false)
            ->assertJsonCount(0, 'data.media.gallery');

        $service->refresh()->load('media');

        $this->assertSame($promotedGalleryId, $service->getFirstMedia(Service::PRIMARY_MEDIA)?->id);
        $this->assertCount(0, $service->getMedia(Service::GALLERY_MEDIA));
        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'type_id' => null,
            'location_id' => null,
            'sale_price' => null,
            'operating_hours' => null,
            'operating_days_label' => null,
            'licenses_certs' => null,
            'service_radius' => null,
            'min_contract_months' => null,
            'max_client_slots' => null,
            'address' => null,
            'state' => null,
            'zip_code' => null,
            'is_published' => false,
            'is_featured' => false,
            'is_subscription' => false,
            'is_project_based' => true,
        ]);
    }
}
