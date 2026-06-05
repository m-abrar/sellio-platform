<?php

namespace Tests\Unit;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyGuestCapacityTest extends TestCase
{
    use RefreshDatabase;

    public function test_rental_capacity_falls_back_to_two_guests_per_bedroom_when_default_is_one(): void
    {
        $property = Property::factory()->create([
            'is_rental' => true,
            'is_sale' => false,
            'number_of_bedrooms' => 3,
            'maximum_guests' => 1,
        ]);

        $this->assertSame(6, $property->booking_guest_capacity);
    }

    public function test_explicit_rental_guest_capacity_is_preserved(): void
    {
        $property = Property::factory()->create([
            'is_rental' => true,
            'is_sale' => false,
            'number_of_bedrooms' => 3,
            'maximum_guests' => 5,
        ]);

        $this->assertSame(5, $property->booking_guest_capacity);
    }

    public function test_sale_listing_keeps_stored_guest_capacity(): void
    {
        $property = Property::factory()->create([
            'is_rental' => false,
            'is_sale' => true,
            'number_of_bedrooms' => 3,
            'maximum_guests' => 1,
        ]);

        $this->assertSame(1, $property->booking_guest_capacity);
    }
}
