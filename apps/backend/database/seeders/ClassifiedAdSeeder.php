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

/**
 * Class ClassifiedAdSeeder
 *
 * Seeds comprehensive dummy data for Classified listings, ensuring realistic
 * sale price logic, polymorphic reviews, and inquiries.
 */
class ClassifiedAdSeeder extends Seeder
{
    /** Geographic center [lat, lng] for each US state / territory abbreviation. */
    private const STATE_COORDINATES = [
        'AL' => [32.806671, -86.791130], 'AK' => [61.370716, -152.404419], 'AZ' => [33.729759, -111.431221],
        'AR' => [34.969704, -92.373123], 'CA' => [36.116203, -119.681564], 'CO' => [39.059811, -105.311104],
        'CT' => [41.597782, -72.755371], 'DE' => [39.318523, -75.507141], 'FL' => [27.766279, -81.686783],
        'GA' => [33.040619, -83.643074], 'HI' => [21.094318, -157.498337], 'ID' => [44.240459, -114.478828],
        'IL' => [40.349457, -88.986137], 'IN' => [39.849426, -86.258278], 'IA' => [42.011539, -93.210526],
        'KS' => [38.526600, -96.726486], 'KY' => [37.668140, -84.670067], 'LA' => [31.169546, -91.867805],
        'ME' => [44.693947, -69.381927], 'MD' => [39.063946, -76.802101], 'MA' => [42.230171, -71.530106],
        'MI' => [43.326618, -84.536095], 'MN' => [45.694454, -93.900192], 'MS' => [32.741646, -89.678696],
        'MO' => [38.456085, -92.288368], 'MT' => [46.921925, -110.454353], 'NE' => [41.125370, -98.268082],
        'NV' => [38.313515, -117.055374], 'NH' => [43.452492, -71.563896], 'NJ' => [40.298904, -74.521011],
        'NM' => [34.840515, -106.248482], 'NY' => [42.165726, -74.948051], 'NC' => [35.630066, -79.806419],
        'ND' => [47.528912, -99.784012], 'OH' => [40.388783, -82.764915], 'OK' => [35.565342, -96.928917],
        'OR' => [44.572021, -122.070938], 'PA' => [40.590752, -77.209755], 'RI' => [41.680893, -71.511780],
        'SC' => [33.856892, -80.945007], 'SD' => [44.299782, -99.438828], 'TN' => [35.747845, -86.692345],
        'TX' => [31.054487, -97.563461], 'UT' => [40.150032, -111.862434], 'VT' => [44.045876, -72.710686],
        'VA' => [37.769337, -78.169968], 'WA' => [47.400902, -121.490494], 'WV' => [38.491226, -80.954456],
        'WI' => [44.268543, -89.616508], 'WY' => [42.755966, -107.302490], 'DC' => [38.897438, -77.026817],
    ];

    /** Return a lat/lng pair near the real center of the given state, with ±0.5° jitter. */
    private function coordinatesForState(\Faker\Generator $faker, string $stateAbbr): array
    {
        [$lat, $lng] = self::STATE_COORDINATES[$stateAbbr] ?? [39.8283, -98.5795];
        return [
            $faker->randomFloat(6, $lat - 0.5, $lat + 0.5),
            $faker->randomFloat(6, $lng - 0.5, $lng + 0.5),
        ];
    }

    /**
     * Run the database seeds for the Classified Ad module.
     *
     * @return void
     */
    public function run(): void
    {
        // 🛍️ Header Line with Emoji (Yellow Text)
        $this->command->line('🛍️ Seeding Classified Ad Module (Listings, Reviews, Inquiries)...');

        // Truncate existing classified data so re-runs replace stale records cleanly
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('classified_inquiries')->truncate();
        DB::table('reviews')->where('reviewable_type', Classified::class)->delete();
        DB::table('classified_ads')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

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

        $batchClassifieds = [];
        foreach (range(1, 50) as $index) {
            $baseTitle = $faker->randomElement($itemTitles);
            $title = $faker->randomElement(['Excellent', 'Pristine', 'Authentic', 'Rare']) . ' ' . $baseTitle;
            
            $basePrice = $faker->randomFloat(2, 50, 2500);
            $createdAt = now()->subDays($faker->numberBetween(1, 90));
            $sellerId = $faker->randomElement($userIds);

            $hasSalePrice = $faker->boolean(30);
            $salePrice = $hasSalePrice ? $basePrice * 0.85 : null;

            $state = $faker->stateAbbr;
            [$lat, $lng] = $this->coordinatesForState($faker, $state);

            $batchClassifieds[] = [
                'user_id' => $sellerId,
                'category_id' => $faker->randomElement($categoryIds),
                'type_id' => $faker->randomElement($typeIds),
                'brand_id' => $faker->randomElement($brandIds),
                'location_id' => $faker->randomElement($locationIds),
                'title' => Str::title($title),
                'slug' => Str::slug($title . '-ad-' . $index) . '-' . Str::random(5),
                'description' => $faker->realText(500),
                'base_price' => $basePrice,
                'sale_price' => $salePrice,
                'sale_starts_at' => $hasSalePrice ? now() : null,
                'sale_ends_at' => $hasSalePrice ? now()->addDays(14) : null,
                'item_condition' => $faker->numberBetween(7, 10),
                'item_year_age' => $faker->numberBetween(1, 5),
                'item_quantity' => 1,
                'item_dimensions' => $faker->randomFloat(2, 10, 100), 
                'warranty_months' => $faker->boolean(20) ? 6 : null,
                'min_ad_duration' => 14,
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $state,
                'country' => 'USA',
                'zip_code' => $faker->postcode,
                'latitude' => $lat,
                'longitude' => $lng,
                'status'                => 'approved',
                'admin_note'            => 'Verified community listing.',
                'is_verified'           => true,
                'is_published' => true,
                'is_featured' => $faker->boolean(10),
                'is_for_rent' => false,
                'is_shipping' => $faker->boolean(70),
                'is_for_sale' => true,
                'approved_at'       => now(),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ];
        }

        foreach (array_chunk($batchClassifieds, 10) as $chunk) {
            foreach ($chunk as $data) {
                $classifieds[] = Classified::create($data); // Using create to get IDs for polymorphic relations
            }
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