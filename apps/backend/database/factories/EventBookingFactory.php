<?php
// database/factories/EventBookingFactory.php

namespace Database\Factories;

use App\Models\EventBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Event Bookings
 *
 * This factory generates test data for the event marketplace vertical.
 * It simulates ticket purchase transactions with quantity logic and multi-state
 * payment/booking status tracking.
 */
class EventBookingFactory extends Factory
{
    protected $model = EventBooking::class;

    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 5);
        
        // This is a temporary placeholder rate.
        // The EventSeeder will OVERRIDE the total_price calculation 
        // to correctly use the price of the specific ticket type selected.
        $tempTicketPrice = $this->faker->randomFloat(2, 20, 300); 


        return [
            'user_id'                 => \App\Models\User::inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'event_occurrence_id'    => \App\Models\EventOccurrence::inRandomOrder()->first()?->id ?? \App\Models\EventOccurrence::factory()->state(['event_id' => \App\Models\Event::factory()]),
            'event_ticket_type_id'   => \App\Models\EventTicketType::inRandomOrder()->first()?->id ?? \App\Models\EventTicketType::factory(),
            'quantity'               => $quantity,
            'total_price'            => $quantity * $tempTicketPrice, 
            'status'                 => $this->faker->randomElement(['confirmed', 'pending', 'cancelled', 'refunded']),
        ];
    }
}