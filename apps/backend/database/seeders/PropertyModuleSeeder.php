<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsPropertyAddons;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Faker\Factory as Faker;
use App\Models\Property;
use App\Models\PropertyFee;
use App\Models\PropertyNeighborhood;
use App\Models\PropertyScore; 
use App\Models\Review;
use App\Models\PropertyVisit;
use App\Models\PropertyBooking;
use Carbon\Carbon;

/**
 * Class PropertyModuleSeeder
 *
 * Seeds comprehensive property auxiliary data (fees, addons, neighborhoods, scores,
 * reviews, visits, and bookings) for existing Property records to simulate
 * a fully operational real estate marketplace.
 */
class PropertyModuleSeeder extends Seeder
{
    use SeedsPropertyAddons;

    private $faker;
    private array $userIds;
    private int $maxUsers;

    // --- FEE DEFINITIONS ---
    private array $availableFees = [
        [
            'title' => 'Cleaning Fee',
            'type' => 'non_refundable',
            'charge_type' => 'flat',
            'min_amount' => 50,
            'max_amount' => 150,
        ],
        [
            'title' => 'Security Deposit',
            'type' => 'refundable',
            'charge_type' => 'flat',
            'min_amount' => 100,
            'max_amount' => 500,
        ],
        [
            'title' => 'Sales Tax',
            'rate' => 0.050,
            'charge_type' => 'percentage',
        ],
        [
            'title' => 'City Lodging Tax',
            'rate' => 0.035,
            'charge_type' => 'percentage',
        ],
        [
        // This is a dynamic fee, sometimes called 'Resort Fee'
            'title' => 'Service & Amenity Fee',
            'rate' => 0.015,
            'charge_type' => 'percentage',
        ],
    ];

    /**
     * Run the database seeds for the entire Property module.
     */
    public function run(): void
    {
        $this->faker = Faker::create();
        $this->userIds = DB::table('users')->pluck('id')->toArray();
        $this->maxUsers = count($this->userIds);

        // New Header
        $this->command->info('✨ Starting Property Module Seeding...');

        if ($this->maxUsers === 0) {
            $this->command->line('⚠️ Skipping PropertyModuleSeeder: No Users found.');
            return;
        }

        // 1. Fetch EXISTING properties (Do not create new ones)
        $properties = Property::all();

        if ($properties->isEmpty()) {
            $this->command->error('❌ No existing properties found. Please run PropertySeeder first.');
            return;
        }

        $this->command->line("ℹ️ Found {$properties->count()} existing properties. Attaching relations...");

        // 2. Create Financials, Neighborhoods, and Scores for existing properties
        $this->seedFinancials($properties);

        // 3. Create Complex Relations (Reviews, Visits, Bookings) for existing properties
        $this->seedRelations($properties);

        $this->backfillMissingRentalAddons();
        
        // New Success Footer
        $this->command->info('✅ Property module data seeded successfully!');
    }

    /**
     * Ensure every rental property has bookable add-ons for the vacation checkout flow.
     */
    public function backfillMissingRentalAddons(): void
    {
        $created = 0;

        Property::query()
            ->where('is_rental', true)
            ->whereDoesntHave('addons')
            ->orderBy('id')
            ->each(function (Property $property) use (&$created) {
                $count = $this->seedPropertyAddonsIfMissing($property);
                if ($count > 0) {
                    $created += $count;
                    $this->command?->line("    🎁 Backfilled {$count} addons for rental property #{$property->id}.");
                }
            });

        if ($created > 0) {
            $this->command?->info("✅ Backfilled {$created} rental add-ons.");
        }
    }

    // =================================================================
    // 2. PROPERTY FINANCIALS & NEIGHBORHOODS & SCORES
    // =================================================================

    private function seedFinancials(Collection $properties): void
    {
        $this->command->info("\n--- 🏗️ Property Financials & Scores ---"); // New Header
        $totalFees = 0;
        $totalAddons = 0;
        $totalNeighborhoods = 0;
        $totalScores = 0;

        $properties->each(function (Property $property) use (&$totalFees, &$totalAddons, &$totalNeighborhoods, &$totalScores) {
            $this->command->line("  Property ID #{$property->id}:"); // Sub-header

            // Fees
            if($property->fees()->count() === 0) {
                $this->seedFees($property);
                $count = $property->fees()->count();
                $this->command->info("    💰 Created {$count} fees.");
                $totalFees += $count;
            }
            
            // Add-ons (rental / vacation stays only)
            if ($property->is_rental && $property->addons()->count() === 0) {
                $count = $this->seedPropertyAddonsIfMissing($property);
                if ($count > 0) {
                    $this->command->info("    🎁 Created {$count} addons.");
                    $totalAddons += $count;
                }
            }

            // Neighborhoods
            if($property->neighborhoods()->count() === 0) {
                $this->seedNeighborhoods($property);
                $count = $property->neighborhoods()->count();
                $this->command->info("    📍 Created {$count} neighborhoods.");
                $totalNeighborhoods += $count;
            }

            // Scores
            if($property->scores()->count() === 0) {
                $this->seedScores($property);
                $count = $property->scores()->count();
                $this->command->info("    ⭐ Created {$count} scores.");
                $totalScores += $count;
            }
        });

        // Summary Footer
        $this->command->line("\n  Summary of Created Records:");
        $this->command->line("  - Total Property Fees: {$totalFees}");
        $this->command->line("  - Total Property Addons: {$totalAddons}");
        $this->command->line("  - Total Neighborhood Points: {$totalNeighborhoods}");
        $this->command->line("  - Total Property Scores: {$totalScores}");
        $this->command->info('✅ Financials and Scores seeding complete.');
    }

    private function seedFees(Property $property): void
    {
        $feesCollection = collect($this->availableFees);
        $selectedFees = $feesCollection->random(mt_rand(3, 5));
        
        foreach ($selectedFees as $feeData) {
            $data = $feeData;
            unset($data['min_amount'], $data['max_amount']);

            if (($feeData['charge_type'] ?? null) === 'flat') {
                $data['amount'] = mt_rand($feeData['min_amount'] ?? 50, $feeData['max_amount'] ?? 150);
                $data['rate'] = null;
            } else {
                $data['amount'] = null;
            }
            
            PropertyFee::factory()->state(array_merge($data, [
                'property_id' => $property->id,
            ]))->create();
        }
    }
        
    private function seedNeighborhoods(Property $property): void
    {
        // Use fully qualified class name to avoid resolution issues on restricted servers.
        $allNeighborhoodData = \Database\Factories\PropertyNeighborhoodFactory::getNeighborhoodData();

        $count = mt_rand(3, 6); 
        
        // 1. Get a unique random subset of the available neighborhood titles
        $selectedNeighborhoods = collect($allNeighborhoodData)
            ->shuffle()
            ->take($count);

        // 2. Iterate and create a record for each unique selection
        foreach ($selectedNeighborhoods as $neighborhoodData) {
            
            // Override the factory's default state with the selected static data
            PropertyNeighborhood::factory()->create([
                'property_id'  => $property->id,
                'title'         => $neighborhoodData['title'],
                'icon_class'   => $neighborhoodData['icon_class'],
                'category'     => $neighborhoodData['category'],
                // The factory's default logic will handle distance and description fields.
            ]);
        }
    }

    private function seedScores(Property $property): void
    {
        // Use fully qualified class name to get the available score definitions.
        $availableScores = \Database\Factories\PropertyScoreFactory::getAvailableScores();
        
        $scoresCollection = collect($availableScores);
        // Select a unique subset of score types (3 to 5)
        $selectedScores = $scoresCollection->random(mt_rand(3, 5));

        foreach ($selectedScores as $scoreData) {
            // Use the factory's custom state to generate a score based on the unique type selected.
            PropertyScore::factory()
                ->withSpecificScore($scoreData)
                ->create([
                    'property_id' => $property->id,
                ]);
        }
    }

    // =================================================================
    // 3. PROPERTY RELATIONS (from PropertyRelationsSeeder)
    // =================================================================

    private function seedRelations(Collection $properties): void
    {
        $this->command->info("\n--- 🤝 Property User Relations ---"); // New Header
        $totalReviews = 0;
        $totalVisits = 0;
        $totalBookings = 0;

        foreach ($properties as $property) {
            
            $createdReviews = 0;
            $createdVisits = 0;
            $createdBookings = 0;

            // --- CREATE REVIEWS ---
            if($property->reviews()->exists()) {
                // If reviews already exist, skip but notify
                $this->command->line("  ⏭️ Skipping relations for Property ID #{$property->id}: Reviews already exist.");
                continue;
            }
            
            // Ensure minimum reviews is capped by available users
            $minReviews = min(5, $this->maxUsers);
            $maxReviews = min(10, $this->maxUsers);

            if ($minReviews > 0) {
                $initialReviewCount = $property->reviews()->count(); 
                $numberOfReviews = $this->faker->numberBetween($minReviews, $maxReviews);
                $reviewerIds = $this->faker->randomElements($this->userIds, $numberOfReviews);

                $property->reviews()->createMany(
                    Review::factory()
                        ->count(count($reviewerIds))
                        ->make()
                        ->map(function ($review, $index) use ($reviewerIds) {
                            $review->user_id = $reviewerIds[$index]; 
                            return $review->toArray();
                        })
                        ->toArray()
                );
                $createdReviews = $property->reviews()->count() - $initialReviewCount;
                $totalReviews += $createdReviews;
            }

            // --- CREATE BOOKINGS/VISITS ---
            if ($property->is_sale) {
                // Property is for sale: create visits
                $minVisits = min(2, $this->maxUsers);
                if ($minVisits > 0) {
                    $initialVisitCount = $property->visits()->count();
                    $property->visits()->createMany(
                        PropertyVisit::factory()
                            ->count($this->faker->numberBetween($minVisits, min(5, $this->maxUsers)))
                            ->make()
                            ->map(function ($visit) {
                                // 70% chance to be a registered user, 30% chance to be a guest (user_id = null)
                                $visit->user_id = $this->faker->boolean(70) ? $this->faker->randomElement($this->userIds) : null;
                                return $visit->toArray();
                            })
                            ->toArray()
                    );
                    $createdVisits = $property->visits()->count() - $initialVisitCount;
                    $totalVisits += $createdVisits;
                }
            }

            if ($property->is_rental) {
                // Property is for rent: create bookings
                $minBookings = min(3, $this->maxUsers);
                if ($minBookings > 0) {
                    $initialBookingCount = $property->bookings()->count();
                    $numBookings = $this->faker->numberBetween($minBookings, min(8, $this->maxUsers));
                    $bookerIds = $this->faker->randomElements($this->userIds, $numBookings);
                    
                    // Start booking chain a month from now to ensure future availability
                    $currentDate = Carbon::now()->addMonth()->startOfDay(); 
                    $bookingsData = [];

                    for ($i = 0; $i < $numBookings; $i++) {
                        // Ensure check-in dates are sequential
                        $checkIn = $currentDate->copy()->addDays($this->faker->numberBetween(1, 5));
                        $duration = $this->faker->numberBetween(3, 14); 
                        $checkOut = $checkIn->copy()->addDays($duration);
                        $currentDate = $checkOut; 

                        $bookingBase = PropertyBooking::factory()->make()->toArray();
                        
                        $bookingsData[] = array_merge($bookingBase, [
                            'user_id' => $bookerIds[$i],
                            'check_in_date' => $checkIn->format('Y-m-d H:i:s'),
                            'check_out_date' => $checkOut->format('Y-m-d H:i:s'),
                            'total_price' => $this->faker->randomFloat(2, 500, 3000), 
                            'guests' => $this->faker->numberBetween(1, 6),
                            'full_name' => $this->faker->title(),
                            'email' => $this->faker->unique()->safeEmail(),
                            'phone' => $this->faker->phoneNumber(),
                            'message' => $this->faker->sentence(12),
                        ]);
                    }

                    $property->bookings()->createMany($bookingsData);

                    $createdBookings = $property->bookings()->count() - $initialBookingCount;
                    $totalBookings += $createdBookings;
                }
            }

            // Output combined counts for this property
            $this->command->info("  Property ID #{$property->id}: ✍️ {$createdReviews} reviews, 👀 {$createdVisits} visits, 📅 {$createdBookings} bookings created.");
        }
        
        // Summary Footer
        $this->command->line("\n  Summary of Created Records:");
        $this->command->line("  - Total Reviews Created: {$totalReviews}");
        $this->command->line("  - Total Visits Created: {$totalVisits}");
        $this->command->line("  - Total Bookings Created: {$totalBookings}");
        $this->command->info('✅ Relations seeding complete.');
    }
}