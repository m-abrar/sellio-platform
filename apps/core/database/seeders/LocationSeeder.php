<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

/**
 * Class LocationSeeder
 *
 * Seeds geographical data including the new Blog module relevance flag.
 */
class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        $initialCount = Location::count();

        $this->command->info('🗺️✨ Starting **Location Seeder**...');
        $this->command->line("Existing locations: {$initialCount}");
        $this->command->newLine();
        
        $fixedLocationsCount = 0;
        $randomLocationsCount = 0;

        // 1. Seed the predefined common regions/cities
        $this->command->line('Seeding 5 core predefined global cities...');
        $predefinedLocations = [
            ['New York', 'NY', 'USA', '10001', 40.7128, -74.0060],
            ['Los Angeles', 'CA', 'USA', '90001', 34.0522, -118.2437],
            ['London', 'England', 'UK', 'SW1A 0AA', 51.5074, 0.1278],
            ['Paris', 'Ile-de-France', 'France', '75001', 48.8566, 2.3522],
            ['Tokyo', 'Tokyo', 'Japan', '100-0001', 35.6895, 139.6917],
        ];

        foreach ($predefinedLocations as $data) {
            Location::create([
                'title'            => $data[0],
                'state'           => $data[1], 
                'country'          => $data[2],
                'zip_code'          => $data[3], 
                'latitude'          => $data[4],
                'longitude'         => $data[5],
                
                'meta_title'       => 'SEO Title for ' . $data[0] . ' Location Listings',
                'meta_description'  => $faker->sentence(20),

                // Predefined cities are relevant to almost everything, including Blogs
                'is_property'     => $faker->boolean(60),
                'is_event'        => true,
                'is_job'          => true,
                'is_auto'         => $faker->boolean(30),
                'is_service'      => true,
                'is_classified'   => true,
                'is_product'      => true,
                'is_blog'         => true,
                
                'is_featured'     => true,
                'is_published'    => true,
            ]);
            $fixedLocationsCount++;
        }
        $this->command->info("   - **{$fixedLocationsCount}** fixed global locations seeded.");
        $this->command->newLine();
        
        // 2. Seed 15 additional randomized locations
        $this->command->line('Seeding 15 additional randomized locations...');
        foreach (range(1, 15) as $index) {
            Location::create([
                'title'            => $faker->city,
                'description'       => $faker->sentence(10),
                'state'           => $faker->state, 
                'country'          => $faker->country,
                'zip_code'          => $faker->postcode, 

                'latitude'          => $faker->latitude,
                'longitude'         => $faker->longitude,
                
                'meta_title'       => 'SEO Title for ' . $faker->city . ' Listings',
                'meta_description'  => $faker->sentence(20),

                // Randomly assign module relevance
                'is_property'     => $faker->boolean(30),
                'is_event'        => $faker->boolean(50),
                'is_job'          => $faker->boolean(20),
                'is_auto'         => $faker->boolean(10),
                'is_service'      => $faker->boolean(40),
                'is_classified'   => $faker->boolean(60),
                'is_product'      => $faker->boolean(60),
                'is_blog'         => $faker->boolean(20),
                
                'is_published'    => true,
            ]);
            $randomLocationsCount++;
        }

        $totalCreated = $fixedLocationsCount + $randomLocationsCount;
        $this->command->info("📊 **Summary of Created Records**:");
        $this->command->info(" - Total Locations Created: **{$totalCreated}**");
        $this->command->newLine();
        $this->command->info("✅ Location Seeder finished successfully!");
    }
}