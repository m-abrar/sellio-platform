<?php

// database/seeders/SeasonalPriceSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SeasonalPrice;
use App\Models\Property;
use Illuminate\Support\Carbon; // Use Carbon for reliable date manipulation

/**
 * Class SeasonalPriceSeeder
 *
 * Seeds the database with sample seasonal price records for properties.
 * This is essential for demonstrating the dynamic pricing feature based on
 * predefined seasonal date ranges (e.g., low, shoulder, peak seasons).
 */
class SeasonalPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Fetches all existing Property records and attaches a set of standard
     * seasonal pricing rules (Winter, Spring, Summer, Autumn) for the current year.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('✨ Starting SeasonalPrice Seeder...'); // Header
        
        $properties = Property::all();
        $initialCount = SeasonalPrice::count();
        $createdCount = 0; // Initialize counter for new/updated records

        // Guard clause to prevent unnecessary execution if no properties exist.
        if ($properties->isEmpty()) {
            $this->command->line('⚠️ Skipping SeasonalPriceSeeder: No Property records found.');
            return;
        }

        $this->command->info('Seeding seasonal pricing for ' . $properties->count() . ' properties...');

        // 2. Define a set of standard, non-overlapping seasons and their corresponding data.
        $seasonalData = [
            ['title' => 'Winter Low', 'price' => 100.00, 'months' => ['Jan', 'Feb', 'Dec']],
            ['title' => 'Spring Shoulder', 'price' => 150.00, 'months' => ['Mar', 'Apr', 'Nov']],
            ['title' => 'Summer Peak', 'price' => 250.00, 'months' => ['May', 'Jun', 'Jul', 'Aug']],
            ['title' => 'Autumn Shoulder', 'price' => 175.00, 'months' => ['Sep', 'Oct']],
        ];
        
        // Use the current year to anchor the dates, ensuring the seeded data is relevant.
        $baseYear = Carbon::now()->year; 

        // 3. Loop through each property
        $properties->each(function ($property) use ($seasonalData, $baseYear, &$createdCount) {
            
            // Loop through the predictable seasonal data structure
            foreach ($seasonalData as $season) {
                
                // Determine the calendar period based on the defined months array.
                // The season starts on the first day of the first month listed.
                $startMonth = $season['months'][0];
                
                // Calculate the start date (1st day of the start month of the current year).
                $startDate = Carbon::parse("{$baseYear}-{$startMonth}-01");
                
                // Calculate the end date: Add the total number of months in the season, then subtract one day.
                // E.g., ['May', 'Jun', 'Jul', 'Aug'] (4 months): Start May 1st -> Add 4 months (Sep 1st) -> Sub 1 day (Aug 31st).
                $endDate = $startDate->copy()->addMonths(count($season['months']))->subDay();
                
                // 4. Use updateOrCreate to prevent duplicates based on property_id and date range
                // This ensures the seeder is idempotent (can be run multiple times safely).
                SeasonalPrice::updateOrCreate(
                    // Key fields used for matching existing records
                    [
                        'property_id' => $property->id,
                        'start_date' => $startDate->toDateString(),
                        'end_date' => $endDate->toDateString(),
                    ],
                    // Data to fill or update the record
                    [
                        'title' => $season['title'],
                        'price' => $season['price'],
                    ]
                );
                
                $createdCount++;
            }
        });

        $finalCount = SeasonalPrice::count();
        $totalTouched = $finalCount - $initialCount + $createdCount;

        $this->command->info("📈 Total Seasonal Price records created/updated: {$totalTouched}."); // Count
        $this->command->info('✅ Seasonal Price records seeded successfully.'); // Footer
    }
}