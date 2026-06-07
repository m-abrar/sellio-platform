<?php

// database/factories/PropertyAddonFactory.php

namespace Database\Factories;

use App\Models\PropertyAddon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Property Add-ons
 *
 * This factory generates optional services for property bookings,
 * such as breakfast, equipment rentals, or insurance, with flexible
 * pricing models (per_night, per_stay) for the real estate vertical.
 */
class PropertyAddonFactory extends Factory
{
    protected $model = PropertyAddon::class;

    public function definition(): array
    {
        return [
            'property_id' => null,
            'title'       => $this->faker->words(2, true),
            'description' => $this->faker->sentence(10),
            'price'       => $this->faker->randomFloat(2, 15, 150),
            'type'        => $this->faker->randomElement(['per_night', 'per_stay']),
            'max_qty'     => $this->faker->numberBetween(1, 5),
            'is_popular'  => $this->faker->boolean(25), // 25% chance to be trending
            'icon'        => $this->faker->randomElement(['bi-cup-hot', 'bi-bicycle', 'bi-shield-check', 'bi-potted-plant']),
        ];
    }
}