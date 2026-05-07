<?php

namespace Database\Factories;

use App\Models\PropertyVisit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Property Visits
 *
 * This factory generates scheduling data for property viewings, capturing
 * visitor contact details, appointment timestamps, and multi-state visit
 * lifecycle tracking for the real estate vertical.
 */
class PropertyVisitFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PropertyVisit::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $scheduledAt = $this->faker->dateTimeBetween('now', '+3 weeks');

        return [
            // Contact Information (Required for guests and registered users)
            'full_name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            // 80% chance of providing a phone number, which is nullable in the DB
            'phone' => $this->faker->boolean(80) ? $this->faker->phoneNumber() : null, 

            // Visit Details
            'scheduled_at' => $scheduledAt,
            // Status distribution: favor pending/confirmed for recent data
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'confirmed', 'cancelled', 'completed']), 
            'notes' => $this->faker->boolean(20) ? $this->faker->sentence(5) : null,
            
            // user_id and property_id will be set by the PropertyModuleSeeder
        ];
    }
}