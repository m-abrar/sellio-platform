<?php
// database/factories/ReviewFactory.php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Customer Reviews
 *
 * This factory generates social proof data across the platform, including
 * quantitative ratings and qualitative feedback, with moderation status support.
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;
    
    public function definition(): array
    {
        return [
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(10),
            'status' => $this->faker->randomElement(['pending', 'approved']),
        ];
    }
}
