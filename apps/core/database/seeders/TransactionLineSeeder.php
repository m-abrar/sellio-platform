<?php

// database/seeders/TransactionLineSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TransactionLine;
use Illuminate\Support\Facades\DB;
use App\Models\Property;
use App\Models\PropertyBooking; // ASSUMED: PropertyBooking Model exists and is already seeded

/**
 * Seeds the 'transaction_lines' table.
 *
 * It creates multiple transaction line items for every property, simulating sales
 * and linking approximately 70% of those lines to existing property bookings.
 */
class TransactionLineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('💵 Starting Transaction Line Seeder...');
            // Clear existing data before seeding
            DB::table('transaction_lines')->delete();
            $this->command->line('  🗑️ Cleared existing transaction lines.');
        }

        // Fetch all Property and PropertyBooking records from the database.
        // This is done once to optimize the loop below.
        $properties = Property::all();
        $bookings = PropertyBooking::all(); 
        
        // Check if there are properties to seed transactions for
        if ($properties->isEmpty()) {
            if ($this->command) $this->command->error('  ❌ No properties found to generate transaction lines.');
            return;
        }

        // Iterate through each property to create associated transaction data.
        $properties->each(function ($property) use ($bookings) {
            
            // Filter the bookings collection to only include bookings relevant to the current property.
            // This optimized collection will be used inside the loop.
            $propertyBookings = $bookings->where('property_id', $property->id);
            
            // Create a random number of transaction line items (between 5 and 15) for each property.
            for ($i = 0; $i < mt_rand(5, 15); $i++) {
                
                $bookingId = null;
                
                // Logic to simulate linking:
                // If the property has bookings and a random number (70% chance) hits,
                // link the transaction line item to a random existing booking ID.
                if ($propertyBookings->isNotEmpty() && mt_rand(1, 10) <= 7) {
                    // Get a random booking ID from the property's bookings
                    $bookingId = $propertyBookings->random()->id;
                }
                
                // Use the factory to create the TransactionLine model instance.
                TransactionLine::factory()
                    ->create([
                        // Always link to the current property
                        'property_id' => $property->id,
                        // Conditionally link to a booking (will be null if not linked)
                        'property_booking_id' => $bookingId,
                    ]);
            }
        });

        if ($this->command) {
            $count = TransactionLine::count();
            $this->command->info("  Created {$count} transaction line items across {$properties->count()} properties.");
            $this->command->info('--- 🏁 Transaction Line Seeding Complete ---');
        }
    }
}