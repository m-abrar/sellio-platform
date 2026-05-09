<?php

namespace Database\Factories;

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
            'user_id'   => \App\Models\User::factory(),
            'plan_id'   => \App\Models\Plan::factory(),
            'title'     => $this->faker->randomElement(['Pro Monthly', 'Elite Annual', 'Starter Plan']),
            'status'    => 'active',
            'starts_at' => $startsAt,
            'ends_at'   => $endsAt,
        ];
    }
}
