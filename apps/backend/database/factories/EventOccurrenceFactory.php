<?php

// database/factories/EventOccurrenceFactory.php

namespace Database\Factories;

use App\Models\EventOccurrence;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Event Occurrences
 *
 * This factory generates scheduling data for events, including start/end timestamps,
 * duration logic, and attendance capacity management for the event marketplace.
 */
class EventOccurrenceFactory extends Factory
{
    protected $model = EventOccurrence::class;

    public function definition(): array
    {
        // Define an occurrence starting soon
        $startTime = $this->faker->dateTimeBetween('+1 week', '+6 months');
        $durationHours = $this->faker->randomFloat(1, 1, 8);
        $endTime = clone $startTime;
        $endTime->modify("+$durationHours hours");

        return [
            // event_id will be provided when created via relationship
            'start_date_time' => $startTime,
            'end_date_time' => $endTime,
            'venue_details' => $this->faker->boolean(20) ? $this->faker->streetAddress : null,
            'max_attendees' => $this->faker->numberBetween(50, 5000),
        ];
    }
}