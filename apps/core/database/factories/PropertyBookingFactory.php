<?php

// database/factories/PropertyBookingFactory.php

namespace Database\Factories;

use App\Models\PropertyBooking;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyBookingFactory extends Factory
{
    protected $model = PropertyBooking::class;

    public function definition(): array
    {
        // Define the range for check-in dates: 6 months ago to 6 months from now
        $startDate = '-6 months';
        $endDate = '+6 months';

        // Generate a random check-in date within the full year range
        $checkInDate = $this->faker->dateTimeBetween($startDate, $endDate);
        
        // Generate a check-out date a maximum of 15 days after the check-in date
        // Use the generated $checkInDate as the start of the range
        $checkOutDate = $this->faker->dateTimeBetween($checkInDate, $checkInDate->format('Y-m-d') . ' +15 days');
        
        // Calculate the number of nights (ensure it's at least 1)
        $nights = $checkInDate->diff($checkOutDate)->days ?: 1; 

        // Assume a reasonable daily rental rate for calculating total_price
        $dailyRate = $this->faker->randomFloat(2, 50, 500);
        $totalPrice = $nights * $dailyRate;

        return [
            // user_id and property_id will be set by the PropertySeeder
            'check_in_date' => $checkInDate,
            'check_out_date' => $checkOutDate,
            'total_price' => $totalPrice, 
            'status' => $this->faker->randomElement(['confirmed', 'pending', 'cancelled', 'completed']),
        ];
    }
}