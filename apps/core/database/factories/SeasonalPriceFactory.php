<?php

// database/factories/SeasonalPriceFactory.php

namespace Database\Factories;

use App\Models\SeasonalPrice;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeasonalPriceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SeasonalPrice::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // 1. Define a random starting point within the next year
        $startDate = $this->faker->dateTimeBetween('now', '+1 year');
        
        // 2. Define the end date (1 to 4 months later)
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +4 months');

        // 3. Define the possible season names
        $seasonNames = ['Summer Peak', 'Winter Special', 'Shoulder Season', 'Holiday Rush', 'Off-Season', 'Spring Break'];
        
        return [
            // property_id will be overwritten by the seeder
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'title' => $this->faker->randomElement($seasonNames), // 🆕 GENERATED: Random season name
            'price' => $this->faker->randomFloat(2, 100, 500), // Random price
        ];
    }
}