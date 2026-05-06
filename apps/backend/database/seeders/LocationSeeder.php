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

        // 1. Seed the hierarchical global locations
        $this->command->line('Seeding 3-level hierarchical global locations...');
        
        $geography = [
            'USA' => [
                'New York' => ['Manhattan', 'Brooklyn', 'Queens'],
                'California' => ['Los Angeles', 'San Francisco', 'San Diego'],
                'Florida' => ['Miami', 'Orlando', 'Tampa'],
            ],
            'UK' => [
                'England' => ['London', 'Manchester', 'Birmingham'],
                'Scotland' => ['Edinburgh', 'Glasgow'],
            ],
            'France' => [
                'Ile-de-France' => ['Paris', 'Versailles'],
                'Provence' => ['Marseille', 'Nice'],
            ],
        ];

        $totalLocations = 0;

        foreach ($geography as $countryName => $states) {
            // Level 0: Country
            $country = Location::updateOrCreate(
                ['title' => $countryName, 'level' => 0],
                [
                    'country' => $countryName,
                    'is_published' => true,
                    'is_featured' => true,
                    'is_blog' => true,
                    'status' => 'active',
                    'admin_note' => 'System default country node.',
                    'is_premium' => false,
                ]
            );
            $totalLocations++;

            foreach ($states as $stateName => $cities) {
                // Level 1: State
                $state = Location::updateOrCreate(
                    ['title' => $stateName, 'parent_id' => $country->id],
                    [
                        'country' => $countryName,
                        'state' => $stateName,
                        'level' => 1,
                        'is_published' => true,
                        'is_featured' => false,
                        'status' => 'active',
                        'admin_note' => 'System default state node.',
                        'is_premium' => false,
                    ]
                );
                $totalLocations++;

                foreach ($cities as $cityName) {
                    // Level 2: City
                    Location::updateOrCreate(
                        ['title' => $cityName, 'parent_id' => $state->id],
                        [
                            'country' => $countryName,
                            'state' => $stateName,
                            'level' => 2,
                            'is_published' => true,
                            'is_featured' => true,
                            'is_property' => true,
                            'is_event' => true,
                            'is_job' => true,
                            'is_auto' => true,
                            'is_service' => true,
                            'is_classified' => true,
                            'is_product' => true,
                            'is_blog' => true,
                            'status' => 'active',
                            'admin_note' => 'Marketplace City Level node.',
                            'is_premium' => $faker->boolean(10),
                            'latitude' => $faker->latitude,
                            'longitude' => $faker->longitude,
                        ]
                    );
                    $totalLocations++;
                }
            }
        }

        $this->command->info("📊 **Summary of Created Records**:");
        $this->command->info(" - Total Locations Created/Updated: **{$totalLocations}**");
        $this->command->newLine();
        $this->command->info("✅ Location Seeder finished successfully!");
    }
}