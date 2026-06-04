<?php

// database/factories/PropertyBookingFactory.php

namespace Database\Factories;

use App\Models\PropertyBooking;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Property Bookings
 *
 * This factory generates transactional data for the real estate vertical,
 * simulating stays with check-in/out date logic, night count calculations,
 * and multi-state lifecycle management.
 */
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
            'guests' => $this->faker->numberBetween(1, 4),
            'full_name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'message' => $this->faker->optional()->sentence(),
            'check_in_date' => $checkInDate,
            'check_out_date' => $checkOutDate,
            'total_price' => $totalPrice, 
            'status' => $this->faker->randomElement(['confirmed', 'pending', 'cancelled', 'completed']),
        ];
    }

    public function forDateRange(string|Carbon $checkIn, string|Carbon $checkOut, float $nightlyRate = 180.00): static
    {
        $checkInDate = Carbon::parse($checkIn)->startOfDay();
        $checkOutDate = Carbon::parse($checkOut)->startOfDay();
        $nights = max(1, $checkInDate->diffInDays($checkOutDate));

        return $this->state(fn () => [
            'check_in_date' => $checkInDate->toDateString(),
            'check_out_date' => $checkOutDate->toDateString(),
            'total_price' => $nights * $nightlyRate,
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => PropertyBooking::STATUS_PENDING,
        ]);
    }

    public function confirmed(): static
    {
        return $this->state(fn () => [
            'status' => PropertyBooking::STATUS_CONFIRMED,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => PropertyBooking::STATUS_COMPLETED,
        ]);
    }
}
