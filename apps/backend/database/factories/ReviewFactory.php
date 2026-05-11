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
            'user_id'         => \App\Models\User::inRandomOrder()->first()?->id ?? \App\Models\User::factory(),
            'reviewable_id'   => \App\Models\Product::inRandomOrder()->first()?->id ?? \App\Models\Product::factory(), // Default to product, usually overridden
            'reviewable_type' => 'App\Models\Product',
            'rating'          => $this->faker->numberBetween(1, 5),
            'comment'         => $this->faker->sentence(10),
            'status'          => 'approved',
        ];
    }
}
