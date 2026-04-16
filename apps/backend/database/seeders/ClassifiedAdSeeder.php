<?php

// File: database/seeders/ClassifiedAdSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Classified; 
use App\Models\User;
use App\Models\Review;
use App\Models\ClassifiedInquiry;
use Carbon\Carbon; // Added Carbon use statement

/**
 * Class ClassifiedAdSeeder
 *
 * Seeds comprehensive dummy data for Classified listings, ensuring realistic
 * sale price logic, polymorphic reviews, and inquiries.
 */
class ClassifiedAdSeeder extends Seeder
{
    /**
     * Run the database seeds for the Classified Ad module.
     *
     * @return void
     */
    public function run(): void
    {
        // 🛍️ Header Line with Emoji (Yellow Text)
        $this->command->line('🛍️ Seeding Classified Ad Module (Listings, Reviews, Inquiries)...');
        $faker = Faker::create();

        // --- 1. Fetch Foreign Keys ---
        $userIds = User::where('is_partner', true)->pluck('id')->toArray();
        $locationIds = DB::table('locations')->where('is_classified', true)->pluck('id')->toArray();
        $categoryIds = DB::table('categories')->where('is_classified', true)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_classified', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_classified', true)->pluck('id')->toArray();
        
        $maxUsers = count($userIds);

        // --- 2. Safety Check ---
        if (empty($userIds) || empty($locationIds) || empty($categoryIds) || $maxUsers < 2) {
            $this->command->line('⚠️ Skipping ClassifiedAdSeeder: Missing base data or not enough users.');
            // Display counts for debugging/info purposes
            $this->command->info( '   > Locations: '. count($locationIds) .', Categories: '. count($categoryIds) .', Users: '. count($userIds) );
            // 🎉 Success Footer (Still print a footer even on skip)
            $this->command->line('✅ Classified Ad Seeding finished (Skipped).');
            return;
        }

        // Initialize counters for the final summary
        $initialClassifiedCount = Classified::count();
        $initialReviewCount = Review::where('reviewable_type', Classified::class)->count();
        $initialInquiryCount = ClassifiedInquiry::count();
        
        $classifieds = [];
        $reviewsToInsert = [];
        $inquiriesToInsert = [];

        // --- 3. CREATE CLASSIFIED LISTINGS (Parent Records) ---
        foreach (range(1, 50) as $index) {
            $title = $faker->randomElement([
                'Used', 'Vintage', 'New', 'Rare', 'Exclusive', 
                'Premium', 'Custom', 'Tested', 'Quick Sale', 'Limited Edition', 
            ]) . ' ' . $faker->words(2, true);
            
            $basePrice = $faker->randomFloat(2, 5, 5000);
            $createdAt = now()->subDays($faker->numberBetween(1, 90));
            $sellerId = $faker->randomElement($userIds);
            
            $hasSalePrice = $faker->boolean(40);
            $salePrice = null;
            $saleStartsAt = null;
            $saleEndsAt = null;

            if ($hasSalePrice) {
                // Generate sale price (50% to 95% of base price)
                $salePrice = $faker->randomFloat(2, $basePrice * 0.5, $basePrice * 0.95);

                // Determine a random start date (from creation date up to 30 days in the future)
                $saleStartsAt = $faker->dateTimeBetween($createdAt, now()->addDays(30)); 
                
                // Determine the end date (7 to 60 days after the start date)
                // Use Carbon::instance() to ensure we can manipulate the DateTime object.
                $saleEndsAt = $faker->dateTimeBetween(
                    $saleStartsAt, 
                    Carbon::instance((clone $saleStartsAt))->addDays(60)
                );
                
                // Final check to ensure sale price is strictly less than base price
                if ($salePrice >= $basePrice) {
                    $salePrice = $basePrice * $faker->randomFloat(2, 0.5, 0.95); 
                }
            }

            $classified = Classified::create([
                // Foreign Keys
                'user_id' => $sellerId,
                'category_id' => $faker->randomElement($categoryIds),
                'type_id' => $faker->randomElement($typeIds),
                'brand_id' => $faker->randomElement($brandIds),
                'location_id' => $faker->randomElement($locationIds),
                
                // Core Data & Pricing
                'title' => Str::title($title),
                'slug' => Str::slug($title . '-ad-' . $index),
                'description' => $faker->text(300),
                'base_price' => $basePrice,
                'sale_price' => $salePrice,
                
                // Sale Timestamps
                'sale_starts_at' => $saleStartsAt,
                'sale_ends_at' => $saleEndsAt,
                
                // Specifics (Classified Ad attributes)
                'item_condition' => $faker->numberBetween(3, 10),
                'item_year_age' => $faker->numberBetween(1, 10),
                'item_quantity' => $faker->numberBetween(1, 5),
                'item_dimensions' => $faker->randomFloat(2, 0.5, 50), 
                'warranty_months' => $faker->boolean(10) ? $faker->numberBetween(1, 6) : null,
                'min_ad_duration' => $faker->numberBetween(7, 30),

                // Location/Address
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $faker->stateAbbr,
                'country' => 'USA',
                'zip_code' => $faker->postcode,
                'latitude' => $faker->latitude(30, 50),
                'longitude' => $faker->longitude(-120, -70),

                // Status/Type Flags
                'is_published' => true,
                'is_featured' => $faker->boolean(5),
                'is_for_rent' => $faker->boolean(20),
                'is_shipping' => $faker->boolean(50),
                'is_for_sale' => true,

                // Dates
                'approved_at'       => $faker->boolean(80) ? now() : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);
            
            $classifieds[] = $classified;
        }

        
        // --- 4. ATTACH POLYMORPHIC REVIEWS (reviewable) ---
        $reviewStatuses = ['approved', 'pending'];
        
        foreach ($classifieds as $classified) {
            
            // Exclude the seller (listing owner) from leaving a review on their own ad.
            $availableReviewers = array_diff($userIds, [$classified->user_id]);
            
            $maxPossibleReviews = count($availableReviewers);
            
            if ($maxPossibleReviews < 1) continue; 

            // Determine number of reviews (0 to 4)
            $numReviews = $faker->numberBetween(0, min(4, $maxPossibleReviews));
            
            if ($numReviews === 0) continue; 

            // Select unique reviewer IDs
            $randomKeys = (array) array_rand($availableReviewers, $numReviews);
            $reviewerIds = array_map(fn($key) => $availableReviewers[$key], $randomKeys);
            
            foreach ($reviewerIds as $reviewerId) {
                // Collect review data for bulk insertion later
                $reviewsToInsert[] = [
                    'user_id' => $reviewerId,
                    'rating' => $faker->numberBetween(3, 5),
                    'comment' => $faker->paragraphs(1, true),
                    'status' => $faker->randomElement($reviewStatuses),
                    'reviewable_id' => $classified->id,
                    'reviewable_type' => Classified::class,
                    'created_at' => $faker->dateTimeBetween($classified->created_at, 'now'),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Bulk insert reviews
        if (!empty($reviewsToInsert)) {
            DB::table('reviews')->insert($reviewsToInsert);
        }

        // --- 5. CREATE CLASSIFIED INQUIRIES (Pivot Table: classified_inquiries) ---
        
        $inquiryStatuses = ['pending', 'contacted', 'resolved', 'closed_sale'];
        
        foreach ($classifieds as $classified) {
            
            // Exclude the seller from making inquiries on their own ad
            $availableInquirers = array_diff($userIds, [$classified->user_id]);
            
            $maxInquirers = count($availableInquirers);
            if ($maxInquirers === 0) continue; 

            // Determine number of inquiries (0 to 5)
            $numInquiries = $faker->numberBetween(0, min(5, $maxInquirers));
            
            if ($numInquiries === 0) continue; 

            // Select unique inquirer IDs
            $randomKeys = (array) array_rand($availableInquirers, $numInquiries);
            $inquirerIds = array_map(fn($key) => $availableInquirers[$key], $randomKeys);
            
            foreach ($inquirerIds as $inquirerId) {
                // Collect inquiry data for bulk insertion later
                $inquiriesToInsert[] = [
                    'classified_id' => $classified->id,
                    'user_id' => $inquirerId,
                    'status' => $faker->randomElement($inquiryStatuses),
                    'message' => $faker->paragraphs(1, true),
                    'created_at' => $faker->dateTimeBetween($classified->created_at, 'now'),
                    'updated_at' => now(), 
                ];
            }
        }
        
        // Bulk insert inquiries
        if (!empty($inquiriesToInsert)) {
            // Note: Use DB::table for direct pivot table insertion
            DB::table('classified_inquiries')->insert($inquiriesToInsert);
        }

        // --- Summary and Footer ---

        $finalClassifiedCount = Classified::count();
        $finalReviewCount = Review::where('reviewable_type', Classified::class)->count();
        $finalInquiryCount = ClassifiedInquiry::count();

        $classifiedsCreated = $finalClassifiedCount - $initialClassifiedCount;
        $reviewsCreated = $finalReviewCount - $initialReviewCount;
        $inquiriesCreated = $finalInquiryCount - $initialInquiryCount;
        
        $this->command->newLine();
        $this->command->info('--- Classified Ad Module Seeding Summary ---');
        
        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$classifiedsCreated** new Classified Listings created.");
        $this->command->info("   > **$reviewsCreated** Classified Reviews attached.");
        $this->command->info("   > **$inquiriesCreated** Classified Inquiries created.");
        
        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Classified Ad Seeding finished.');
    }
}