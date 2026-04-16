<?php

// database/factories/PropertyFeeFactory.php

namespace Database\Factories;

use App\Models\PropertyFee;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFeeFactory extends Factory
{
    protected $model = PropertyFee::class;

    public function definition(): array
    {
        // 🚨 FIX: Remove all random/unique logic. 
        // The values will be explicitly set by the Seeder's state() method.
        
        return [
            // Use a placeholder that will be overwritten
            'title' => 'Placeholder Fee', 
            
            // Generate random values for amount and type, which will be overwritten,
            // but this keeps the definition method structurally complete.
            'amount' => $this->faker->randomFloat(2, 10, 500), 
            'type' => $this->faker->randomElement(['refundable', 'non_refundable']),
            
            // property_id will be set in the seeder
        ];
    }
}