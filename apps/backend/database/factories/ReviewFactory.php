<?php
// database/factories/ReviewFactory.php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
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
            'user_id'         => User::query()->inRandomOrder()->value('id'),
            'reviewable_id'   => null,
            'reviewable_type' => null,
            'rating'          => $this->faker->numberBetween(1, 5),
            'comment'         => $this->faker->sentence(10),
            'status'          => 'approved',
        ];
    }
}
