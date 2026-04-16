<?php

// File: database/seeders/AmenitySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class AmenitySeeder
 *
 * Populates the 'amenities' lookup table with common property-related features
 * for use in listing creation and filtering.
 */
class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Inserts a predefined list of amenities into the database. By default, these
     * are marked as available for the 'is_property' module.
     *
     * @return void
     */
    public function run(): void
    {
        // Array of amenities with corresponding Font Awesome 5 Free icons
        $baseAmenities = [
            [
                'title' => 'Swimming Pool',
                'icon' => 'fas fa-swimming-pool',
            ],
            [
                'title' => 'Gym/Fitness Center',
                'icon' => 'fas fa-dumbbell',
            ],
            [
                'title' => 'WiFi',
                'icon' => 'fas fa-wifi',
            ],
            [
                'title' => 'Free Parking',
                'icon' => 'fas fa-parking',
            ],
            [
                'title' => 'Pet Friendly',
                'icon' => 'fas fa-paw',
            ],
            [
                'title' => 'Air Conditioning',
                'icon' => 'fas fa-fan',
            ],
            [
                'title' => 'Heated Floors',
                'icon' => 'fas fa-fire',
            ],
            [
                'title' => 'In-unit Washer/Dryer',
                'icon' => 'fas fa-tshirt',
            ],
            [
                'title' => 'Balcony/Patio',
                'icon' => 'fas fa-chair',
            ],
            [
                'title' => '24/7 Security',
                'icon' => 'fas fa-shield-alt',
            ],
        ];

        $totalAmenitiesToInsert = count($baseAmenities);
        
        // 🏡 Header Line with Emoji (Yellow Text)
        $this->command->line("🏡 Seeding Amenities (**$totalAmenitiesToInsert** total, primarily for Property)...");

        // 1. Get the initial count
        $initialCount = DB::table('amenities')->count();

        $amenitiesToInsert = [];
        $now = now();

        // Process amenities for bulk insertion
        foreach ($baseAmenities as $amenity) {
            $amenitiesToInsert[] = [
                'title' => $amenity['title'],
                'slug' => Str::slug($amenity['title']),
                'icon' => $amenity['icon'],
                'description' => null,
                'is_published' => true,
                
                // --- Module Flags ---
                'is_property' => true, 
                'is_event' => false,
                'is_job' => false,
                'is_auto' => false,
                'is_service' => false,
                'is_classified' => false,

                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // 2. Perform the single batch insert
        DB::table('amenities')->insert($amenitiesToInsert);

        // 3. Get the final count and calculate the difference
        $finalCount = DB::table('amenities')->count();
        $recordsCreated = $finalCount - $initialCount;

        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$recordsCreated** new amenities created.");
        
        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Amenity Seeding finished.');
    }
}