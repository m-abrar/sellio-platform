<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsPropertyAddons;
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
    use SeedsPropertyAddons;

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
        $totalAddonsCreated = 0;

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
        $propertyTitles = [
            'Ultra-Modern Glass Villa', 'Luxury Penthouse with Skyline View', 'Charming Coastal Cottage',
            'Contemporary Downtown Loft', 'Rustic Mountain Retreat', 'Elegant Suburban Manor',
            'Sleek Industrial Studio', 'Secluded Forest Sanctuary', 'Mediterranean Style Estate',
            'Minimalist Zen House', 'Victorian Heritage Home', 'Panoramic Sea View Apartment',
            'Sky Garden Residence', 'Grand Lakeside Mansion', 'Urban Executive Suite',
            'Cozy Scandinavian Flat', 'Majestic Hilltop Chateau', 'Eco-Friendly Smart Home',
            'Bohemian Artist Loft', 'Regal Colonial Villa', 'Futuristic Smart Apartment',
            'Traditional Ranch Estate', 'Sophisticated City Terrace', 'Tranquil Riverside Bungalow',
            'Exquisite Gold Coast Manor', 'Hidden Valley Cabin', 'Metropolitan Grand Suite',
            'Classic Brick Townhouse', 'Opulent Marble Palace', 'Modernist Prairie House'
        ];

        foreach (range(1, $totalPropertiesToCreate) as $index) {
            $baseTitle = $propertyTitles[$index - 1] ?? $faker->company . ' Residence';
            $title = $baseTitle . ' ' . $faker->randomElement(['I', 'II', 'Alpha', 'Prime', 'Elite']);

            // --- Determine Rental or Sale Status (Mutually Exclusive) ---
            $isRental = $faker->boolean(50); // 50% chance of being a rental
            $isSale   = !$isRental;         // If not rental, it's for sale

            // --- Assign Conditional Pricing ---
            $basePrice      = $isSale ? $faker->randomFloat(2, 250000, 5000000) : $faker->randomFloat(2, 1200, 15000);
            $pricePerNight  = $isRental ? $faker->randomFloat(2, 150, 1200) : null;
            $salePrice      = $isSale && $faker->boolean(30) ? $basePrice * 0.9 : null; // 30% chance of discount
            
            // --- Random dates for created_at/updated_at ---
            $createdAt = $faker->dateTimeThisYear();

            // Generate sample embedding code or link for videos (60% chance)
            $videoData = $faker->boolean(60) ? $faker->randomElement([
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/ScMzIvxBSi4" frameborder="0" allowfullscreen></iframe>',
                'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Standard placeholder
            ]) : null;

            // --- Create Property record ---
            $property = Property::create([
                // Foreign Keys
                'user_id'     => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'type_id'     => $faker->randomElement($typeIds),
                'brand_id'    => !empty($brandIds) ? $faker->randomElement($brandIds) : null,
                'location_id' => $faker->randomElement($locationIds),

                // Core Data
                'title'        => $title,
                'slug'        => Str::slug($title) . '-' . Str::random(5),
                'description' => $faker->realText(800), // More immersive text

                // Conditional Pricing
                'base_price'      => $basePrice,
                'price_per_night' => $pricePerNight,
                'sale_price'      => $salePrice,

                // Property Details
                'number_of_bedrooms'      => $faker->numberBetween(1, 6),
                'number_of_bathrooms'     => $faker->numberBetween(1, 5),
                'maximum_guests'          => $faker->numberBetween(2, 12),
                'minimum_rental_days'     => $faker->numberBetween(1, 3),
                'maximum_rental_days'     => $faker->randomElement([7, 14, 30, 90]),
                'area_sq_ft'              => $faker->numberBetween(800, 8000),
                'area_sq_m'               => $faker->numberBetween(75, 750),
                'number_of_parking_spots' => $faker->numberBetween(1, 4),

                // Other Meta Information
                'hoa'           => $faker->boolean(40) ? $faker->randomFloat(2, 100, 800) : 0,
                'rules'         => "1. No smoking inside the premises.\n2. Pets allowed upon prior approval.\n3. Respect quiet hours between 10 PM and 8 AM.\n4. No unauthorized events or large gatherings.",
                'policies'      => "Standard cancellation policy: Full refund if cancelled 48 hours before check-in. Professional cleaning included in service fee. Valid government ID required for all guests.",
                'year_built'    => $faker->numberBetween(1990, 2024),
                'video'         => $videoData,
                'virtual_tour'  => null,

                // Address & Geo-Location Data
                'address'   => $faker->streetAddress,
                'city'      => $faker->city,
                'state'     => $faker->stateAbbr,
                'country'   => $faker->countryCode,
                'zip_code'  => $faker->postcode,
                'latitude'  => $faker->latitude(34, 42), // Focus on specific region
                'longitude' => $faker->longitude(-118, -74),

                // Status & Moderation
                'status'        => 'approved',
                'admin_note'    => 'Verified premium listing.',

                // Status Flags
                'is_published'  => true,
                'is_featured'   => $faker->boolean(20),
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

            if ($isRental) {
                $totalAddonsCreated += $this->seedPropertyAddonsIfMissing($property);
            }
        }
        
        // 5. Seeding Summary
        $this->command->newLine();
        $this->command->info('--- Property Seeding Summary ---');
        
        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$totalPropertiesCreated** Property records created.");
        $this->command->info("   > **$totalAmenitiesAttached** Amenities attached via pivot table.");
        $this->command->info("   > **$totalFeaturesAttached** Features attached via pivot table.");
        $this->command->info("   > **$totalAddonsCreated** Rental add-ons created.");

        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->line('✅ Property Seeder finished.');
    }
}