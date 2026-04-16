<?php

// database/factories/PropertyAddonFactory.php

namespace Database\Factories;

use App\Models\PropertyAddon;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyAddonFactory extends Factory
{
    protected $model = PropertyAddon::class;

    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(10),
            'price' => $this->faker->randomFloat(2, 15, 150),
            'type' => $this->faker->randomElement(['per_night', 'per_stay']),
            'max_qty' => $this->faker->numberBetween(1, 5),
            'is_popular' => $this->faker->boolean(25), // 25% chance to be trending
            'icon' => $this->faker->randomElement(['bi-cup-hot', 'bi-bicycle', 'bi-shield-check', 'bi-potted-plant']),
        ];
    }
}