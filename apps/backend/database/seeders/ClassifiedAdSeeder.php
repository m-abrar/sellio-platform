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
        // Pick only Level 2 locations (Cities) to ensure listing specificity
        $locationIds = DB::table('locations')->where('level', 2)->pluck('id')->toArray();
        $categoryIds = DB::table('categories')->where('is_classified', true)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_classified', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_classified', true)->pluck('id')->toArray();
        
        $maxUsers = count($userIds);

        // --- 2. Safety Check ---
        if (empty($userIds) || empty($locationIds) || empty($categoryIds) || $maxUsers < 2) {
            $this->command->line('⚠️ Skipping ClassifiedAdSeeder: Missing base data or not enough users.');
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
        $itemTitles = [
            'Vintage 1970s Film Camera', 'Professional Grade Mountain Bike', 'Limited Edition Vinyl Record Collection',
            'Mid-Century Modern Lounge Chair', 'Authentic Hand-Woven Persian Rug', 'Rare First Edition Hardcover Book',
            'Studio-Quality Electric Guitar', 'Antique Brass Telescope', 'Designer Leather Handbag',
            'High-Performance Drone with 4K Camera', 'Handcrafted Walnut Dining Table', 'Retro Arcade Gaming Machine',
            'Professional Artist Easel & Set', 'Luxury Watch Travel Case', 'Custom Built Gaming PC (RGB)',
            'Vintage Typewriter in Working Order', 'Solid Oak Writing Desk', 'High-End Espresso Machine',
            'Premium Portable Charcoal Grill', 'Nordic Style Ceramic Dinnerware'
        ];

        foreach (range(1, 50) as $index) {
            $baseTitle = $faker->randomElement($itemTitles);
            $title = $faker->randomElement(['Excellent', 'Pristine', 'Authentic', 'Rare']) . ' ' . $baseTitle;
            
            $basePrice = $faker->randomFloat(2, 50, 2500);
            $createdAt = now()->subDays($faker->numberBetween(1, 90));
            $sellerId = $faker->randomElement($userIds);
            
            $hasSalePrice = $faker->boolean(30);
            $salePrice = $hasSalePrice ? $basePrice * 0.85 : null;

            $classified = Classified::create([
                // Foreign Keys
                'user_id' => $sellerId,
                'category_id' => $faker->randomElement($categoryIds),
                'type_id' => $faker->randomElement($typeIds),
                'brand_id' => $faker->randomElement($brandIds),
                'location_id' => $faker->randomElement($locationIds),
                
                // Core Data & Pricing
                'title' => Str::title($title),
                'slug' => Str::slug($title . '-ad-' . $index) . '-' . Str::random(5),
                'description' => $faker->realText(500),
                'base_price' => $basePrice,
                'sale_price' => $salePrice,
                
                // Sale Timestamps
                'sale_starts_at' => $hasSalePrice ? now() : null,
                'sale_ends_at' => $hasSalePrice ? now()->addDays(14) : null,
                
                // Specifics
                'item_condition' => $faker->numberBetween(7, 10),
                'item_year_age' => $faker->numberBetween(1, 5),
                'item_quantity' => 1,
                'item_dimensions' => $faker->randomFloat(2, 10, 100), 
                'warranty_months' => $faker->boolean(20) ? 6 : null,
                'min_ad_duration' => 14,

                // Location/Address
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $faker->stateAbbr,
                'country' => 'USA',
                'zip_code' => $faker->postcode,
                'latitude' => $faker->latitude(34, 42),
                'longitude' => $faker->longitude(-118, -74),

                // Hardened Moderation & Status
                'status'                => 'approved',
                'admin_note'            => 'Verified community listing.',
                'is_verified'           => true,

                // Status/Type Flags
                'is_published' => true,
                'is_featured' => $faker->boolean(10),
                'is_for_rent' => false,
                'is_shipping' => $faker->boolean(70),
                'is_for_sale' => true,

                // Dates
                'approved_at'       => now(),
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
                $isGuest = $faker->boolean(40);
                // Collect inquiry data for bulk insertion later
                $inquiriesToInsert[] = [
                    'classified_id' => $classified->id,
                    'user_id'       => $isGuest ? null : $inquirerId,
                    'name'          => $isGuest ? $faker->name : null,
                    'email'         => $isGuest ? $faker->email : null,
                    'phone'         => $isGuest ? $faker->phoneNumber : null,
                    'status'        => $faker->randomElement($inquiryStatuses),
                    'message'       => $faker->paragraphs(1, true),
                    'admin_note'    => $faker->boolean(30) ? 'High interest buyer.' : null,
                    'created_at'    => $faker->dateTimeBetween($classified->created_at, 'now'),
                    'updated_at'    => now(), 
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