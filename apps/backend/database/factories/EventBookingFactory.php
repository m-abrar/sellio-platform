<?php

namespace Database\Factories;

use App\Models\EventBooking;
use App\Models\User;
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
            'user_id'                 => User::query()->inRandomOrder()->value('id'),
            'event_occurrence_id'    => null,
            'event_ticket_type_id'   => null,
            'quantity'               => $quantity,
            'total_price'            => $quantity * $tempTicketPrice, 
            'status'                 => $this->faker->randomElement(['confirmed', 'pending', 'cancelled', 'refunded']),
        ];
    }
}