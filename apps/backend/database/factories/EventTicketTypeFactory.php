<?php

// database/factories/EventTicketFactory.php

namespace Database\Factories;

use App\Models\EventTicketType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Event Ticket Types
 *
 * This factory defines the blueprint for various event admission tiers,
 * supporting dynamic pricing states (Cheap, VIP) and hierarchical ticket taxonomy.
 */
class EventTicketTypeFactory extends Factory
{
    protected $model = EventTicketType::class;

    public function definition(): array
    {
        return [
            // event_id will be provided when creating via relationship
            'title' => $this->faker->randomElement(['General Admission', 'VIP Pass', 'Early Bird', 'Student Ticket']),
            'base_price' => $this->faker->randomFloat(2, 10, 500),
            // 'available_quantity' REMOVED: This column now belongs to the event_occurrence_ticket pivot table.
        ];
    }
    
    // State for a cheaper ticket
    public function cheap(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'Early Bird',
            'base_price' => $this->faker->randomFloat(2, 5, 50),
        ]);
    }
    
    // State for an expensive ticket
    public function vip(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'title' => 'VIP Access',
            'base_price' => $this->faker->randomFloat(2, 200, 1000),
        ]);
    }
}