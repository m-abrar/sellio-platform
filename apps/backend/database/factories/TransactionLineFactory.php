<?php

// database/factories/TransactionLineFactory.php

namespace Database\Factories;

use App\Models\TransactionLine;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionLineFactory extends Factory
{
    protected $model = TransactionLine::class;

    public function definition(): array
    {
        // Define common expense and revenue descriptions
        $expenseDesc = ['Utility Bill', 'Plumbing Repair', 'Gardening Service', 'Cleaning Fee', 'Maintenance Fee'];
        $revenueDesc = ['Booking Income', 'Refundable Deposit', 'Late Fee', 'Addon Revenue'];
        
        // Randomly determine the type
        $type = $this->faker->randomElement(['revenue', 'expense']);
        
        return [
            // property_id will be set in the seeder
            'description' => $this->faker->randomElement($type === 'revenue' ? $revenueDesc : $expenseDesc),
            'amount' => $this->faker->randomFloat(2, $type === 'revenue' ? 100 : 10, $type === 'revenue' ? 3000 : 500),
            'type' => $type,
            'status' => 'active',
            'admin_note' => 'System generated financial record.',
            'transaction_date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
        ];
    }
}