<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Ticket::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Define the possible statuses based on your migration
        $statuses = ['open', 'in-progress', 'closed', 'reopened'];
        $priorities = ['low', 'medium', 'high', 'urgent'];
        $categories = ['Technical', 'Billing', 'Account', 'Feature Request', 'General Inquiry'];

        return [
            'user_id' => User::factory(), // Automatically creates a User if one doesn't exist
            
            // Generate a random, unique title
            'title' => $this->faker->unique()->sentence(rand(3, 6)),
            
            // Generate a realistic paragraph for the description
            'description' => $this->faker->optional()->paragraph(rand(2, 5)),
            
            'status' => $this->faker->randomElement($statuses),
            'priority' => $this->faker->randomElement($priorities),
            'category' => $this->faker->randomElement($categories),
            'admin_note' => $this->faker->optional()->sentence(),
            
            // Ensure timestamps are realistic
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }

    /**
     * Define a state for 'unresolved' tickets (open or reopened).
     * This is highly useful for testing!
     */
    public function unresolved(): Factory
    {
        return $this->state(function (array $attributes) {
            $unresolvedStatuses = ['open', 'reopened'];
            return [
                'status' => $this->faker->randomElement($unresolvedStatuses),
            ];
        });
    }
}