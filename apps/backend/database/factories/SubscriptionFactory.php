<?php

namespace Database\Factories;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Subscriptions
 *
 * This factory generates monetization state data, managing trial periods,
 * active service tiers, and expiration timelines for the SaaS platform engine.
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = $this->faker->dateTimeBetween('-1 year', 'now');
        $endsAt = (clone $startsAt)->modify('+1 year');

        return [
            'user_id'   => User::factory(),
            'plan_id'   => Plan::factory(),
            'title'     => $this->faker->randomElement(['Pro Monthly', 'Elite Annual', 'Starter Plan']),
            'status'    => 'active',
            'starts_at' => $startsAt,
            'ends_at'   => $endsAt,
        ];
    }

    /**
     * Indicate that the subscription is monthly.
     */
    public function monthly(): static
    {
        return $this->state(fn (array $attributes) => [
            'ends_at' => (clone $attributes['starts_at'])->modify('+1 month'),
        ]);
    }

    /**
     * Indicate that the subscription is annual.
     */
    public function annual(): static
    {
        return $this->state(fn (array $attributes) => [
            'ends_at' => (clone $attributes['starts_at'])->modify('+1 year'),
        ]);
    }

    /**
     * Indicate that the subscription is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'ends_at' => now()->subDay(),
        ]);
    }
}
