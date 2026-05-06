<?php

// File: database/seeders/AutoSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Auto;
use App\Models\Feature; 
use App\Models\Review;
use App\Models\AutoInquiry;

/**
 * Class AutoSeeder
 *
 * Seeds comprehensive dummy data for Auto listings, including specifications,
 * features, inquiries, and customer reviews.
 */
class AutoSeeder extends Seeder
{
    /**
     * Run the database seeds for the Auto module.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();

        // --- 1. Fetch Foreign Keys ---
        $userIds = DB::table('users')->where('is_partner', true)->pluck('id')->toArray();
        // Pick only Level 2 locations (Cities) to ensure listing specificity
        $locationIds = DB::table('locations')->where('level', 2)->pluck('id')->toArray();
        
        $categoryIds = DB::table('categories')->where('is_auto', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_auto', true)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_auto', true)->pluck('id')->toArray();

        // Filter Features to only include those flagged for the 'Auto' module.
        $featureIds = Feature::where('is_auto', true)->pluck('id')->toArray();
        
        // Determine max available items for safe random selection.
        $maxUsers = count($userIds);
        $maxFeatures = count($featureIds); 

        // --- 2. Safety Check ---
        if ($maxUsers === 0 || empty($locationIds) || empty($categoryIds) || $maxFeatures === 0) {
            $this->command->line('⚠️ Skipping AutoSeeder: Missing base data (Users: ' . $maxUsers . ', Features: ' . $maxFeatures . ').');
            $this->command->line('✅ Auto module seeding finished (Skipped).');
            return;
        }

        // 🚗 Header Line with Emoji (Yellow Text)
        $this->command->line('🚗 Seeding Auto Module (Listings, Features, Inquiries, Reviews)...');

        // 3. Initialize Counters
        $initialAutoCount = Auto::count();
        $initialReviewCount = Review::where('reviewable_type', Auto::class)->count();
        $initialInquiryCount = AutoInquiry::count();

        // Initialize aggregated counters for the loop
        $totalFeaturesAttached = 0;
        $totalInquiriesCreated = 0;
        $totalReviewsCreated = 0;

        // Loop to create 30 distinct Auto listings.
        $numberOfListings = 30;
        $autoModels = [
            'Tesla' => ['Model S Plaid', 'Model X', 'Model 3 Performance', 'Model Y Long Range'],
            'BMW' => ['M4 Competition', 'X5 M60i', 'i7 xDrive60', 'M8 Gran Coupe'],
            'Mercedes-Benz' => ['G 63 AMG', 'S 580 4MATIC', 'EQS 580', 'AMG GT 63'],
            'Audi' => ['RS 6 Avant', 'Q8 e-tron', 'R8 V10 performance', 'A8 L'],
            'Porsche' => ['911 Turbo S', 'Taycan Turbo S', 'Cayenne Turbo GT', 'Panamera Turbo S'],
            'Land Rover' => ['Range Rover Autobiography', 'Defender 110 V8', 'Range Rover Sport'],
            'Lexus' => ['LC 500 Inspiration', 'LX 600 Ultra Luxury', 'RX 500h F SPORT'],
            'Ford' => ['Mustang Mach-E GT', 'F-150 Lightning Platinum', 'Bronco Raptor'],
            'Chevrolet' => ['Corvette Z06', 'Silverado EV RST', 'Tahoe High Country'],
            'Toyota' => ['Land Cruiser 300', 'GR Supra', 'Sequoia Capstone'],
        ];

        foreach (range(1, $numberOfListings) as $index) {
            $make = $faker->randomElement(array_keys($autoModels));
            $model = $faker->randomElement($autoModels[$make]);
            $year = $faker->numberBetween(2021, 2024);
            $title = "$year $make $model";

            // --- 4. CREATE AUTO LISTING (Parent Record) ---
            $auto = Auto::create([
                // Foreign Keys
                'user_id' => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'brand_id' => $faker->randomElement($brandIds),
                'location_id' => $faker->randomElement($locationIds),
                'type_id' => $faker->randomElement($typeIds),
                
                // Core Data
                'title' => $title,
                'slug' => Str::slug($title . '-' . $index) . '-' . Str::random(5),
                'description' => $faker->realText(600), // Professional automotive description
                'base_price' => $faker->randomFloat(2, 45000, 185000),
                'sale_price' => $faker->boolean(25) ? $faker->randomFloat(2, 40000, 170000) : null,
                
                // Specifics (Auto-related attributes)
                'year' => $year,
                'make' => $make,
                'model' => $model,
                'mileage_value' => $faker->numberBetween(5, 15000), // Low mileage for premium look
                'mileage_units' => 'mi',
                'engine_type' => $faker->randomElement(['V8 Biturbo', 'Electric Drive', 'Inline-6 Hybrid', 'V6 Twin-Turbo']),
                'transmission' => $faker->randomElement(['9-Speed Automatic', '8-Speed Dual-Clutch', 'Single-Speed Direct']),
                'fuel_economy' => $faker->randomFloat(1, 12, 110), // Mix of high-perf and EV
                'drivetrain' => $faker->randomElement(['AWD', 'RWD', '4WD']),
                'exterior_color' => $faker->randomElement(['Obsidian Black', 'Mineral White', 'Selenite Grey', 'Tanzanite Blue', 'San Marino Blue', 'Chalk']),
                
                // Inventory and Condition
                'condition_rating' => $faker->numberBetween(8, 10),
                'vin_number' => Str::upper(Str::random(17)),
                'warranty_months' => $faker->randomElement([36, 48, 60, 72]),
                'stock_quantity' => $faker->numberBetween(1, 2),

                // Location/Address data
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $faker->stateAbbr,
                'country' => 'USA',
                'zip_code' => $faker->postcode,
                'latitude' => $faker->latitude(34, 42),
                'longitude' => $faker->longitude(-118, -74),

                // Hardened Moderation & Certification
                'status'        => 'approved',
                'admin_note'    => 'Automatically approved vehicle listing.',
                'is_certified'  => $faker->boolean(40),

                // Status/Type Flags
                'is_published' => true,
                'is_featured' => $faker->boolean(10),
                'is_lease' => $faker->boolean(15),
                'is_selling' => true,
                'approved_at'       => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);


            // --- 5. INTEGRATE FEATURES (Pivot Table: auto_feature) ---
            $numFeaturesToAttach = $faker->numberBetween(1, min(7, $maxFeatures));
            $featureElements = $faker->randomElements($featureIds, $numFeaturesToAttach);
            
            $auto->features()->attach($featureElements);
            $totalFeaturesAttached += count($featureElements);


            // --- 6. CREATE AUTO INQUIRIES (HasMany Relationship) ---
            // Ensure the minimum number of inquiries doesn't exceed the available user count.
            $minInquiries = min(2, $maxUsers);
            if ($minInquiries > 0) {
                $numberOfInquiries = $faker->numberBetween($minInquiries, min(8, $maxUsers)); 
                $inquiryUserIds = $faker->randomElements($userIds, $numberOfInquiries);

                $auto->inquiries()->createMany(
                    AutoInquiry::factory()
                        ->count(count($inquiryUserIds)) 
                        ->make()
                        // Map over the generated models to inject the required user_id
                        ->map(function ($inquiry, $index) use ($inquiryUserIds) {
                            $inquiry->user_id = $inquiryUserIds[$index];
                            return $inquiry->toArray();
                        })
                        ->toArray()
                );
                $totalInquiriesCreated += $numberOfInquiries;
            }

            // --- 7. CREATE REVIEWS (HasMany Relationship) ---
            // Ensure the minimum number of reviews doesn't exceed the available user count.
            $minReviews = min(3, $maxUsers);
            if ($minReviews > 0) {
                $numberOfReviews = $faker->numberBetween($minReviews, min(8, $maxUsers));
                $reviewerIds = $faker->randomElements($userIds, $numberOfReviews);

                $auto->reviews()->createMany(
                    Review::factory()
                        ->count(count($reviewerIds)) 
                        ->make()
                        // Map over the generated models to inject the required user_id and polymorphic data
                        ->map(function ($review, $index) use ($reviewerIds, $auto) { // <--- FIXED: Added $auto to the use statement
                            $review->user_id = $reviewerIds[$index]; 
                            // Add polymorphic relation fields (since we are using createMany on the relation)
                            $review->reviewable_type = Auto::class;
                            $review->reviewable_id = $auto->id;
                            return $review->toArray();
                        })
                        ->toArray()
                );
                $totalReviewsCreated += $numberOfReviews;
            }
        }

        // --- Summary and Footer ---

        $finalAutoCount = Auto::count();
        $finalReviewCount = Review::where('reviewable_type', Auto::class)->count();
        $finalInquiryCount = AutoInquiry::count();

        $autosCreated = $finalAutoCount - $initialAutoCount;
        $reviewsCreated = $finalReviewCount - $initialReviewCount;
        $inquiriesCreated = $finalInquiryCount - $initialInquiryCount;
        
        $this->command->newLine();
        $this->command->info('--- Auto Module Seeding Summary ---');
        
        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$autosCreated** new Auto Listings created (Target: $numberOfListings).");
        $this->command->info("   > **$inquiriesCreated** Auto Inquiries created.");
        $this->command->info("   > **$reviewsCreated** Polymorphic Reviews created.");
        
        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Auto module seeding finished.');
    }
}