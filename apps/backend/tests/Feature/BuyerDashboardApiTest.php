<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BuyerDashboardApiTest extends TestCase
{
    use RefreshDatabase;

    protected function createBuyer(): User
    {
        return User::factory()->create([
            'email' => 'buyer-dashboard@test.test',
        ]);
    }

    public function test_buyer_can_update_profile_location_and_preferences(): void
    {
        $buyer = $this->createBuyer();

        $response = $this->actingAs($buyer, 'sanctum')
            ->putJson('/api/dashboard/user/profile', [
                'name' => 'Updated Buyer',
                'email' => $buyer->email,
                'phone' => '+1 555 0100',
                'location' => 'Austin, TX',
                'settings' => [
                    'email_notifications' => true,
                    'two_factor_enabled' => false,
                ],
            ]);

        $response->assertOk()
            ->assertJsonPath('data.location', 'Austin, TX')
            ->assertJsonPath('data.settings.email_notifications', true);

        $this->assertDatabaseHas('users', [
            'id' => $buyer->id,
            'location' => 'Austin, TX',
        ]);

        $buyer->refresh();
        $this->assertTrue($buyer->preferences['email_notifications']);
    }

    public function test_buyer_can_cancel_property_booking(): void
    {
        $buyer = $this->createBuyer();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
        ]);

        $booking = PropertyBooking::factory()
            ->forDateRange(now()->addDays(5), now()->addDays(8), 150)
            ->pending()
            ->create([
                'user_id' => $buyer->id,
                'property_id' => $property->id,
            ]);

        $this->actingAs($buyer, 'sanctum')
            ->deleteJson("/api/dashboard/user/bookings/{$booking->id}")
            ->assertOk();

        $this->assertDatabaseHas('property_bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_buyer_can_create_review_for_property_booking(): void
    {
        $buyer = $this->createBuyer();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/dashboard/user/reviews', [
                'rating' => 5,
                'comment' => 'Great stay and smooth booking.',
                'reviewable_id' => $property->id,
                'reviewable_type' => 'properties',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.rating', 5);

        $this->assertDatabaseHas('reviews', [
            'user_id' => $buyer->id,
            'reviewable_id' => $property->id,
            'reviewable_type' => Property::class,
            'comment' => 'Great stay and smooth booking.',
        ]);
    }

    public function test_buyer_can_upload_profile_avatar(): void
    {
        Storage::fake('public');
        $buyer = $this->createBuyer();

        $response = $this->actingAs($buyer, 'sanctum')
            ->post('/api/dashboard/user/upload-image', [
                'image' => UploadedFile::fake()->image('avatar.jpg'),
                'model' => 'user',
                'id' => $buyer->id,
                'name' => 'avatar',
            ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['url']);

        $buyer->refresh();
        $this->assertNotEmpty($buyer->getFirstMediaUrl('avatar'));
    }

    public function test_buyer_bookings_index_returns_upcoming_property_booking(): void
    {
        $buyer = $this->createBuyer();
        $property = Property::factory()->create([
            'title' => 'Buyer Dashboard Rental',
            'is_sale' => false,
            'is_rental' => true,
        ]);

        PropertyBooking::factory()
            ->forDateRange(now()->addDays(7), now()->addDays(10), 200)
            ->confirmed()
            ->create([
                'user_id' => $buyer->id,
                'property_id' => $property->id,
            ]);

        $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/dashboard/user/bookings')
            ->assertOk()
            ->assertJsonPath('data.upcomingBookings.0.property.title', 'Buyer Dashboard Rental');
    }

    public function test_buyer_welcome_returns_activity_stats_and_total_items_count(): void
    {
        $buyer = $this->createBuyer();
        $property = Property::factory()->create([
            'is_sale' => false,
            'is_rental' => true,
        ]);

        PropertyBooking::factory()
            ->forDateRange(now()->addDays(3), now()->addDays(6), 180)
            ->confirmed()
            ->create([
                'user_id' => $buyer->id,
                'property_id' => $property->id,
            ]);

        Review::factory()->create([
            'user_id' => $buyer->id,
            'reviewable_id' => $property->id,
            'reviewable_type' => Property::class,
            'rating' => 5,
            'comment' => 'Excellent rental experience.',
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/dashboard/user/welcome');

        $response->assertOk()
            ->assertJsonPath('data.stats.bookingsCount', 1)
            ->assertJsonPath('data.stats.reviewsCount', 1)
            ->assertJsonPath('data.stats.totalItemsCount', 2);

        $this->assertGreaterThanOrEqual(
            2,
            $response->json('data.stats.totalItemsCount'),
        );
    }
}
