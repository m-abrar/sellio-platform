<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\PropertyAddon;
use App\Models\PropertyBooking;
use App\Models\PropertyFee;
use App\Models\User;
use App\Services\PropertyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyBookingLineItemTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_persists_checkout_breakdown_as_booking_line_items(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create([
            'is_rental' => true,
            'is_sale' => false,
            'price_per_night' => 100,
            'maximum_guests' => 4,
        ]);

        PropertyFee::create([
            'property_id' => $property->id,
            'title' => 'Cleaning Fee',
            'amount' => 50,
            'type' => 'non_refundable',
            'charge_type' => 'flat',
        ]);

        PropertyFee::create([
            'property_id' => $property->id,
            'title' => 'Sales Tax',
            'rate' => 0.05,
            'type' => 'non_refundable',
            'charge_type' => 'percentage',
        ]);

        $addon = PropertyAddon::factory()->create([
            'property_id' => $property->id,
            'title' => 'Pet Package',
            'price' => 25,
            'type' => 'per_stay',
        ]);

        $this->actingAs($user);

        $result = app(PropertyService::class)->createOrRetrieveBooking([
            'property_id' => $property->id,
            'check_in' => now()->addMonth()->toDateString(),
            'check_out' => now()->addMonth()->addDays(2)->toDateString(),
            'guests' => 2,
            'full_name' => 'Demo Guest',
            'email' => 'demo-guest@example.test',
            'phone' => '+1 555 1234',
            'message' => null,
            'add_ons' => [
                $addon->id => ['qty' => 2],
            ],
        ]);

        /** @var PropertyBooking $booking */
        $booking = $result['booking']->refresh();

        $this->assertSame(4, $booking->lineItems()->count());
        $this->assertEquals(312.50, (float) $booking->total_price);
        $this->assertEquals(312.50, (float) $booking->lineItems()->sum('price'));

        $this->assertDatabaseHas('booking_line_items', [
            'property_booking_id' => $booking->id,
            'title' => 'Base Rental (2 nights)',
            'price' => '200.00',
        ]);

        $this->assertDatabaseHas('booking_line_items', [
            'property_booking_id' => $booking->id,
            'title' => 'Cleaning Fee',
            'price' => '50.00',
        ]);

        $this->assertDatabaseHas('booking_line_items', [
            'property_booking_id' => $booking->id,
            'title' => 'Add-on: Pet Package (x2)',
            'price' => '50.00',
        ]);
    }
}
