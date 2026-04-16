<?php

// File: database/seeders/AdvertisementSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Advertisement;

/**
 * Class AdvertisementSeeder
 *
 * Populates the 'advertisements' table with sample data to demonstrate different
 * targeting and placement features of the advertisement system.
 */
class AdvertisementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $totalAdsToInsert = 3;
        
        // 🎯 Header Line with Emoji (Yellow Text)
        $this->command->line("🎯 Seeding Advertisements (**$totalAdsToInsert** total)...");

        // 1. Get the initial count
        $initialCount = DB::table('advertisements')->count();
        
        // Optional: Truncate the table before seeding to prevent duplicate entries on multiple runs
        // DB::table('advertisements')->delete();
        DB::table('advertisements')->delete();

        $adsToInsert = [
            // --- Entry 1: Focused on New York City, USA (Active, Header Placement) ---
            [
                'title' => 'Exclusive Luxury Lofts in Manhattan',
                // Mock path for the advertisement banner image
                'image_path' => '/images/ads/manhattan_lofts.png',
                'link' => 'https://example.com/manhattan-lofts',
                'status' => 1, // 1 = Active / Published
                // Ad orientation/placement spots (stored as JSON array)
                'orientations' => json_encode(['header']), 
                // Geographical targeting set via location name, not radius coordinates
                'latitude' => null, 
                'longitude' => null,
                'radius' => null,
                // Targeting specific cities and zip codes
                'cities' => json_encode(['New York']),
                'zipcodes' => json_encode(['10001', '10010']), // Manhattan zip codes
                'regions' => json_encode(['New York', 'New Jersey']),
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(2),
            ],
            // --- Entry 2: Geo-Radius targeting in London, UK (Inactive, Sidebar/Content) ---
            [
                'title' => 'Investment Opportunity: Canary Wharf Development',
                'image_path' => '/images/ads/canary_wharf_invest.webp',
                'link' => 'https://example.co.uk/wharf',
                'status' => 0, // 0 = Inactive / Disabled
                'orientations' => json_encode(['sidebar', 'content']),
                // Geographical targeting set by specific latitude and longitude
                'latitude' => 51.5055, // Example London Lat
                'longitude' => -0.0272, // Example London Long
                'radius' => 20, // 20km radius from the coordinates
                'cities' => json_encode(['London']),
                'zipcodes' => json_encode(['E14']), // Canary Wharf postcode district
                'regions' => json_encode(['Greater London']),
                'created_at' => Carbon::now()->subWeeks(3),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            // --- Entry 3: Global Financial Ad, targeting major cities (Active, Footer Placement) ---
            [
                'title' => 'Global Low-Rate Financing - Apply Now!',
                'image_path' => null, // Represents a text-only ad slot
                'link' => 'https://example.com/financing',
                'status' => 1, // Active
                'orientations' => json_encode(['footer']),
                // No radius or precise geo-targeting specified
                'latitude' => null,
                'longitude' => null,
                'radius' => null,
                // Targeting a broad list of international cities
                'cities' => json_encode(['Paris', 'Berlin', 'Tokyo']),
                'zipcodes' => json_encode([]), 
                'regions' => json_encode([]), // Wide regional reach
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('advertisements')->insert($adsToInsert);
        
        // 2. Get the final count and calculate the difference
        $finalCount = DB::table('advertisements')->count();
        $recordsCreated = $finalCount - $initialCount;

        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$recordsCreated** new advertisements created.");
        
        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Advertisement Seeding finished.');
    }
}