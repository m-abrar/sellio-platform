<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Property;

/**
 * Class PropertySeeder
 *
 * Seeds the database with sample Property listings, including complex data points
 * like conditional pricing (sale vs. rental), multimedia links, and location data.
 * It also attaches records to the `amenities` and `features` pivot tables for a
 * fully functional demonstration.
 */
class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds to create Property records and their pivots.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        $totalPropertiesToCreate = 30;

        // Counters for tracking seeding results
        $totalPropertiesCreated = 0;
        $totalAmenitiesAttached = 0;
        $totalFeaturesAttached = 0;

        // 🎯 Header Line with Emoji (Yellow Text)
        $this->command->line("🏠 Seeding Property listings and pivot data (**$totalPropertiesToCreate** total)...");

        // 1. Fetch Necessary IDs from Related Tables
        $userIds = DB::table('users')->where('is_partner', true)->pluck('id')->toArray();
        // Pick only Level 2 locations (Cities) to ensure listing specificity
        $locationIds = DB::table('locations')->where('level', 2)->pluck('id')->toArray();
        $categoryIds = DB::table('categories')->where('is_property', true)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_property', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_property', true)->pluck('id')->toArray();
        
        $amenityIds = DB::table('amenities')->pluck('id')->toArray();
        $propertyFeatureIds = DB::table('features')->where('is_property', true)->pluck('id')->toArray();

        $maxUsers = count($userIds);
        $maxAmenities = count($amenityIds);
        $maxFeatures = count($propertyFeatureIds);

        // Fail-safe check: Ensure all dependencies are present before seeding properties
        if ($maxUsers === 0 || empty($locationIds) || empty($categoryIds) || $maxAmenities === 0 || $maxFeatures === 0) {
            $this->command->error('❌ Skipping PropertySeeder: Missing dependencies (Users, Locations, Categories, Amenities, or Features).');
            return;
        }

        // 2. Create sample properties
        foreach (range(1, $totalPropertiesToCreate) as $index) {
            $title = $faker->company . ' Residence ' . $index;

            // --- Determine Rental or Sale Status (Mutually Exclusive) ---
            $isRental = $faker->boolean(50); // 50% chance of being a rental
            $isSale   = !$isRental;         // If not rental, it's for sale

            // --- Assign Conditional Pricing ---
            $basePrice      = $faker->randomFloat(2, 50000, 5000000);
            $pricePerNight  = $isRental ? $faker->randomFloat(2, 100, 1000) : null;
            $salePrice      = $isSale ? $faker->randomFloat(2, 45000, 4500000) : null;
            
            // --- Random dates for created_at/updated_at ---
            $createdAt = $faker->dateTimeThisYear();

            // Generate sample embedding code or link for videos (60% chance)
            $videoData = $faker->boolean(60) ? $faker->randomElement([
                // Example of a fake YouTube embed iframe
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/'. $faker->bothify('???????????') .'" frameborder="0" allowfullscreen></iframe>',
                // Example of a raw YouTube link
                'https://www.youtube.com/watch?v=' . $faker->bothify('???????????'),
            ]) : null;

            // Generate sample embedding code or link for virtual tours (40% chance)
            $virtualTourData = $faker->boolean(40) ? $faker->randomElement([
                // Example of a fake virtual tour iframe
                '<iframe width="100%" height="480" src="'. $faker->url .'/?tour='. $faker->uuid .'" frameborder="0" allowfullscreen></iframe>',
                // Example of a raw virtual tour link
                $faker->url . '/virtual-tour/' . $faker->slug(2),
            ]) : null;

            // --- Create Property record ---
            $property = Property::create([
                // Foreign Keys
                'user_id'     => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'type_id'     => $faker->randomElement($typeIds),
                // brand_id is optional and randomly included if $brandIds is not empty
                'brand_id'    => !empty($brandIds) ? $faker->randomElement($brandIds) : null,
                'location_id' => $faker->randomElement($locationIds),

                // Core Data
                'title'        => $title,
                'slug'        => Str::slug($title) . '-' . Str::random(5),
                'description' => $faker->paragraphs(3, true),

                // Conditional Pricing
                'base_price'      => $basePrice,
                'price_per_night' => $pricePerNight,
                'sale_price'      => $salePrice,

                // Property Details
                'number_of_bedrooms'      => $faker->numberBetween(1, 5),
                'number_of_bathrooms'     => $faker->numberBetween(1, 4),
                'maximum_guests'          => $faker->numberBetween(2, 10),
                'minimum_rental_days'     => $faker->numberBetween(1, 5),
                'maximum_rental_days'     => $faker->randomElement([7, 30, 90, 180]),
                'area_sq_ft'              => $faker->randomFloat(2, 500, 5000),
                'area_sq_m'               => $faker->randomFloat(2, 500, 5000),
                'number_of_parking_spots' => $faker->numberBetween(1, 3),

                // Other Meta Information
                'hoa'           => $faker->randomFloat(2, 50, 500),
                'rules'         => $faker->boolean(80) ? $faker->text(250) : null,
                'policies'      => $faker->boolean(80) ? $faker->text(350) : null,
                'year_built'    => $faker->year('now'),
                'video'         => $videoData,
                'virtual_tour'  => $virtualTourData,

                // Address & Geo-Location Data
                'address'   => $faker->streetAddress,
                'city'      => $faker->city,
                'state'     => $faker->stateAbbr,
                'country'   => $faker->countryCode,
                'zip_code'  => $faker->postcode,
                'latitude'  => $faker->latitude(30, 50),
                'longitude' => $faker->longitude(-120, -70),

                // Status & Moderation (Hardened Schema)
                'status'        => 'approved',
                'admin_note'    => 'Automatically approved for initial marketplace seeding.',

                // Status Flags
                'is_published'  => true,
                'is_featured'   => $faker->boolean(15),
                'is_rental'     => $isRental,
                'is_sale'       => $isSale,

                // Timestamp Consistency
                'approved_at' => now(),
                'created_at' => $createdAt,
                'updated_at' => $createdAt, 
            ]);

            $totalPropertiesCreated++;

            // 3. Attach amenities (pivot: property_amenity)
            // Attaches a random number of amenities (3 to 7) to the newly created property.
            $amenityCount = $faker->numberBetween(3, min(7, $maxAmenities));
            $randomAmenityIds = $faker->randomElements($amenityIds, $amenityCount);
            $property->amenities()->attach($randomAmenityIds);
            $totalAmenitiesAttached += count($randomAmenityIds);


            // 4. Attach features (pivot: property_feature)
            // Attaches a random number of features (2 to 5) with sample pivot data ('value').
            $featuresToAttach = [];
            $numFeatures = $faker->numberBetween(2, min(5, $maxFeatures));
            $randomFeatureIds = $faker->randomElements($propertyFeatureIds, $numFeatures);

            foreach ($randomFeatureIds as $featureId) {
                $featuresToAttach[$featureId] = [
                    'value' => $faker->randomElement([
                        'Excellent Condition',
                        'High Priority',
                        'Rating: 5/5',
                        'Standard',
                        'Newly Renovated',
                    ]),
                ];
            }

            $property->features()->attach($featuresToAttach);
            $totalFeaturesAttached += count($featuresToAttach);
        }
        
        // 5. Seeding Summary
        $this->command->newLine();
        $this->command->info('--- Property Seeding Summary ---');
        
        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$totalPropertiesCreated** Property records created.");
        $this->command->info("   > **$totalAmenitiesAttached** Amenities attached via pivot table.");
        $this->command->info("   > **$totalFeaturesAttached** Features attached via pivot table.");

        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Property Seeder finished.');
    }
}