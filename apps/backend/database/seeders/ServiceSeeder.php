<?php

// database/seeders/ServiceSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Service;
use App\Models\User;
use App\Models\Feature;

/**
 * Class ServiceSeeder
 *
 * Seeds the database with sample Service listings, including necessary related
 * data such as polymorphic features, customer quote requests, and reviews.
 * This seeder ensures a fully populated environment for testing and demonstration
 * of the Service module functionality.
 */
class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * 1. Fetches required IDs (Users, Locations, Categories, Features, etc.).
     * 2. Creates 24 unique Service listings with dynamic data.
     * 3. Attaches polymorphic Features to each Service.
     * 4. Creates Service Quote requests linked to the Services.
     * 5. Attaches polymorphic Reviews to the Services.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();

        // 1. Get IDs from base tables
        // Retrieve IDs for necessary foreign keys and relationship targets.
        $userIds = User::where('is_partner', true)->pluck('id')->toArray();
        // Pick only Level 2 locations (Cities) to ensure listing specificity
        $locationIds = DB::table('locations')->where('level', 2)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_service', true)->pluck('id')->toArray();

        $categoryIds = DB::table('categories')->where('is_service', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_service', true)->pluck('id')->toArray();
        $featureIds = Feature::where('is_service', true)->pluck('id')->toArray();

        $maxUsers = count($userIds);
        $maxFeatures = count($featureIds);

        // Conditional check to ensure required foreign keys exist before proceeding.
        if (empty($userIds) || empty($locationIds) || empty($categoryIds)) {
            $this->command->line('⚠️ Skipping ServiceSeeder: Missing base data (Users, Locations, or Categories).');
            return;
        }

        $this->command->info('Seeding Service Listings, Features, Quotes, and Reviews...');

        // Define simple Enum IDs for service-specific fields
        $expertiseLevels = [1, 2, 3];
        $availabilitySchedules = [1, 2, 3];

        $services = [];

        // 2. CREATE SERVICE LISTINGS & ATTACH FEATURES
        foreach (range(1, 24) as $index) {
            $title = $faker->randomElement(['Professional', 'Reliable', 'Top-rated']) . ' ' . $faker->randomElement(['Plumbing', 'Design', 'Tutoring']) . ' Service';
            // Scale prices to realistic values for service/project costs (e.g., $300 - $1500)
            $basePrice = $faker->numberBetween(30, 150) * 10;
            // Sale price represents a minimum fee or required deposit (e.g., $100 - $500)
            $salePrice = $faker->numberBetween(10, 50) * 10;
            $createdAt = now()->subDays($faker->numberBetween(1, 60));

            $serviceProviderId = $faker->randomElement($userIds);

            $service = Service::create([
                // Foreign Keys
                'user_id' => $serviceProviderId,
                'category_id' => $faker->randomElement($categoryIds),
                'brand_id' => $faker->randomElement($brandIds),
                'location_id' => $faker->randomElement($locationIds),
                'type_id' => $faker->randomElement($typeIds),

                // Core Data
                'title' => $title,
                'slug' => Str::slug($title . '-' . $index) . '-' . Str::random(5),
                'description' => $faker->text(800),
                'base_price' => $basePrice,
                'sale_price' => $salePrice,

                // Hardened Moderation & Status
                'status'                => 'approved',
                'admin_note'            => 'Automatically approved service listing.',
                'is_verified_provider'  => $faker->boolean(50),

                // Service Specifics (Using defined Enum IDs)
                'expertise_level' => $faker->randomElement($expertiseLevels),
                'availability_schedule' => $faker->randomElement($availabilitySchedules),
                // Service radius is often nullable; set it 70% of the time
                'service_radius' => $faker->boolean(70) ? $faker->numberBetween(5, 50) : null,
                'licenses_certs' => $faker->randomElement(['Certified Pro', 'Insured/Bonded', null]),
                'min_contract_months' => $faker->boolean(40) ? $faker->numberBetween(1, 12) : null,
                'max_client_slots' => $faker->boolean(50) ? $faker->numberBetween(1, 10) : null,

                // Location/Address (used for geo-search)
                'address' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $faker->stateAbbr,
                'country' => 'USA',
                'zip_code' => $faker->postcode,
                'latitude' => $faker->latitude(30, 50),
                'longitude' => $faker->longitude(-120, -70),

                // Status/Type Flags (Business Logic)
                'is_published' => true,
                'is_featured' => $faker->boolean(10), // Only 10% are featured
                'is_subscription' => $faker->boolean(30),
                'is_project_based' => $faker->boolean(50),
                'approved_at'       => now(),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $services[] = $service;

            // 3. Attach Polymorphic Features (Many-to-Many relationship with pivot data)
            if ($maxFeatures > 0) {
                $numFeatures = $faker->numberBetween(2, min(5, $maxFeatures));
                $featuresToAttach = $faker->randomElements($featureIds, $numFeatures);

                $syncData = [];
                // Prepare the data array for the sync method, including the pivot column 'value'
                foreach ($featuresToAttach as $featureId) {
                    $syncData[$featureId] = ['value' => $faker->randomElement(['Yes', 'No', 'Included', 'Extra Fee'])];
                }

                // Use sync to attach all selected features and their pivot data in one query
                $service->features()->sync($syncData);
            }
        }


        // 4. CREATE SERVICE QUOTES (One-to-Many relationship)
        if (empty($services) || $maxUsers < 2) {
            $this->command->line('⚠️ Skipping ServiceQuote seeding: Not enough services or users.');
            // Use goto to cleanly jump over the Quotes and Reviews sections if prerequisites are not met
            goto skip_quotes_and_reviews;
        }

        $quoteStatuses = ['pending', 'quoted', 'accepted', 'rejected'];

        foreach ($services as $service) {

            // Exclude the service provider (seller) from the customer pool to simulate real requests
            $availableCustomers = array_diff($userIds, [$service->user_id]);

            $maxPossibleQuotes = count($availableCustomers);
            if ($maxPossibleQuotes === 0) continue;

            $numQuotes = $faker->numberBetween(1, min(4, $maxPossibleQuotes));

            // Select unique customers for quotes
            $randomKeys = (array) array_rand($availableCustomers, $numQuotes);
            $customerIds = array_map(fn($key) => $availableCustomers[$key], $randomKeys);

            // Create the quotes
            foreach ($customerIds as $customerId) {
                $status = $faker->randomElement($quoteStatuses);
                $isGuest = $faker->boolean(40);

                $service->quotes()->create([
                    'user_id'       => $isGuest ? null : $customerId,
                    'guest_name'    => $isGuest ? $faker->name : null,
                    'guest_email'   => $isGuest ? $faker->email : null,
                    'guest_phone'   => $isGuest ? $faker->phoneNumber : null,
                    'details'       => $faker->text(200),
                    'requested_date' => $faker->dateTimeBetween('now', '+2 months'),
                    'status'        => $status,
                    'admin_note'    => $faker->boolean(30) ? 'Customer is looking for urgent assistance.' : null,
                    // Only assign a quoted price if the status is 'quoted' or 'accepted'
                    'quoted_price' => ($status === 'quoted' || $status === 'accepted')
                                            ? $faker->numberBetween(500, 5000)
                                            : null,
                    'created_at' => $faker->dateTimeBetween($service->created_at, 'now'),
                ]);
            }
        }


        // 5. ATTACH POLYMORPHIC REVIEWS (One-to-Many relationship on the Reviewable trait)
        $reviewStatuses = ['approved', 'pending'];

        foreach ($services as $service) {

            // Exclude the seller from leaving a review on their own listing
            $availableReviewers = array_diff($userIds, [$service->user_id]);

            $maxPossibleReviews = count($availableReviewers);
            // We need at least one reviewer other than the seller
            if ($maxPossibleReviews < 1) continue;

            // Determine number of reviews (0 to 4)
            $numReviews = $faker->numberBetween(0, min(4, $maxPossibleReviews));

            if ($numReviews === 0) continue;

            // Select unique reviewer IDs
            $randomKeys = (array) array_rand($availableReviewers, $numReviews);
            $reviewerIds = array_map(fn($key) => $availableReviewers[$key], $randomKeys);

            foreach ($reviewerIds as $reviewerId) {

                // Attach the review using the polymorphic relationship (e.g., $service->reviews())
                $service->reviews()->create([
                    'user_id' => $reviewerId,
                    'rating' => $faker->numberBetween(3, 5), // Reviews usually lean positive
                    'comment' => $faker->paragraphs(1, true),
                    'status' => $faker->randomElement($reviewStatuses), // Mix of approved and pending
                    'created_at' => $faker->dateTimeBetween($service->created_at, 'now'),
                ]);
            }
        }

        // Label for the goto jump point
        skip_quotes_and_reviews:
        $this->command->info('✅ Service module (Listings, Features, Quotes, and Reviews) seeded successfully.');
    }
}