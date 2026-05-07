<?php

// database/factories/AutoInquiryFactory.php

namespace Database\Factories;

use App\Models\AutoInquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Auto Inquiries
 *
 * This factory generates high-fidelity test data for the automotive marketplace vertical,
 * simulating realistic customer inquiries with contact details, preferred scheduling,
 * and multi-state status tracking.
 */
class AutoInquiryFactory extends Factory
{
    protected $model = AutoInquiry::class;

    public function definition(): array
    {
        return [
            // user_id and auto_id will be set by the seeder

            // Contact Details
            'full_name' => $this->faker->title() .' '. $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->boolean(80) ? $this->faker->phoneNumber() : null,

            // Inquiry Details
            'preferred_date' => $this->faker->dateTimeBetween('+1 day', '+2 weeks')->format('Y-m-d'),
            'preferred_time' => $this->faker->randomElement(['AM', 'PM', 'Anytime']),

            'message' => $this->faker->boolean(50) ? $this->faker->sentence(15) : null,
            'status' => $this->faker->randomElement(['pending', 'contacted', 'resolved']),
        ];
    }
}