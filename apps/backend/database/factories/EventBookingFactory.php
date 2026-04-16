<?php
// database/factories/EventBookingFactory.php

namespace Database\Factories;

use App\Models\EventBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            // user_id, event_occurrence_id, and event_ticket_type_id will be set by the EventSeeder
            'quantity' => $quantity,
            'total_price' => $quantity * $tempTicketPrice, 
            'status' => $this->faker->randomElement(['confirmed', 'pending', 'cancelled', 'refunded']),

        ];
    }
}