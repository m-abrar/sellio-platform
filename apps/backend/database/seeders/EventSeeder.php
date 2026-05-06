<?php

// File: database/seeders/EventSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Faker\Factory as Faker;
use App\Models\Event;
use App\Models\EventTicketType;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventBooking;
use Carbon\Carbon;

/**
 * Class EventSeeder
 *
 * Seeds dummy records for the core Event model and all related transactional models
 * (Tickets, Inventory, Bookings) to provide a rich dataset for testing and demonstration.
 */
class EventSeeder extends Seeder
{
    /**
     * Run the database seeds for the Event module.
     *
     * Fetches necessary foreign keys (Users, Locations, Categories) and proceeds to
     * create Events, their inventory structure, and sample bookings.
     *
     * @return void
     */
    public function run(): void
    {
        // 🎫 Header Line with Emoji (Yellow Text)
        $this->command->warn('🎫 Starting Event Module Seeding (Events, Occurrences, Tickets, Bookings)...');

        $faker = Faker::create();

        // Initialize counters for the final summary
        $initialEventCount = Event::count();
        $totalOccurrences = 0;
        $totalTicketTypes = 0;
        $totalInventoryRecords = 0;
        $totalBookings = 0;

        // Fetch required foreign keys from prerequisite seeders.
        $userIds = DB::table('users')->where('is_partner', true)->pluck('id')->toArray();
        // Pick only Level 2 locations (Cities) to ensure listing specificity
        $locationIds = DB::table('locations')->where('level', 2)->pluck('id')->toArray();
        
        $categoryIds = DB::table('categories')->where('is_event', true)->pluck('id')->toArray();
        $typeIds = DB::table('types')->where('is_event', true)->pluck('id')->toArray();
        $brandIds = DB::table('brands')->where('is_event', true)->pluck('id')->toArray();
        
        // Safety check: ensure required data exists before attempting to seed events.
        if (empty($userIds) || empty($locationIds) || empty($categoryIds)) {
            $this->command->warn('⚠️ Skipping EventSeeder: Missing base data (Users, Locations, or Event Categories).');
            // 🎉 Success Footer (Still print a footer even on skip)
            $this->command->warn('✅ Event Seeding finished (Skipped).');
            return;
        }

        $this->command->newLine();
        
        // Attractive prefix words for event titles to enhance dummy data quality.
        $eventPrefixes = [
            'Global', 'Elite', 'Executive', 'Tech', 'Strategic', 'Annual', 'Future', 
            'The Ultimate', 'Epic', 'Live', 'Exclusive', 'Mega', 'Grand', 
            'Masterclass', 'Deep Dive', 'Workshop', 'Immersive', 'Creative', 
            'Festival', 'Gala', 'Premiere', 'Challenge', 'Adventure'
        ];

        // Loop to create 15 distinct Event records.
        foreach (range(1, 15) as $index) {
            // Randomly select a prefix for the event title
            $randomPrefix = $faker->randomElement($eventPrefixes);
            $title = $randomPrefix . ' ' . $faker->words(3, true) .' '. $index;

            $startTime = $faker->dateTimeBetween('now', '+6 months');
            // 80% chance the event is paid.
            $isPaid = $faker->boolean(80);

            // 1. CREATE EVENT (Parent Record)
            // ---------------------------------------------------------------------
            $event = Event::create([
                // Foreign Keys
                'user_id' => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'brand_id' => $faker->randomElement($brandIds),
                'location_id' => $faker->randomElement($locationIds),
                'type_id' => $faker->randomElement($typeIds),
                
                // Core Data
                'title' => $title,
                'slug' => Str::slug($title) . '-' . Str::random(5),
                'description' => $faker->text(500),

                'address'   => $faker->streetAddress(),
                'city'      => $faker->city(),
                'state'     => $faker->state(),
                'country'   => $faker->country(),
                'zip_code'  => $faker->postcode(),
                'latitude'  => $faker->latitude(),
                'longitude' => $faker->longitude(),
                
                // Hardened Organizer Metadata
                'organizer_email' => $faker->email(),
                'organizer_phone' => $faker->phoneNumber(),
                'is_verified'     => $faker->boolean(70),
                'status'          => 'approved',
                'admin_note'      => 'Automatically approved for event marketplace demo.',

                // Pricing and Timing
                'base_price' => $isPaid ? $faker->randomFloat(2, 10, 200) : 0.00,
                'sale_price' => $isPaid && $faker->boolean(15) ? $faker->randomFloat(2, 5, 150) : null,
                'start_date_time' => $startTime,
                'duration_hours' => $faker->randomFloat(1, 1, 8),
                'max_attendees' => $faker->numberBetween(50, 5000),

                // Custom Event Fields
                'event_genre' => $faker->randomElement(['Music', 'Tech', 'Arts', 'Food', 'Sports']),
                'venue_size' => $faker->randomFloat(2, 1000, 10000), 

                // Status Flags
                'is_published' => true,
                'is_featured' => $faker->boolean(10),
                'is_virtual' => $faker->boolean(20),
                'is_paid' => $isPaid,
                'approved_at'       => now(),
                'created_at' => $faker->dateTimeThisYear(),
                'updated_at' => now(),
            ]);
            $this->command->line("✅ Created Event: ID **{$event->id}** ({$event->title})");


            // 2. CREATE OCCURRENCES (Dates/Times when the event takes place)
            // ---------------------------------------------------------------------
            // Create 2 to 4 separate instances/dates for the current event.
            $occurrences = $event->occurrences()->createMany(
                EventOccurrence::factory()->count($faker->numberBetween(2, 4))->make()->toArray()
            );
            $totalOccurrences += $occurrences->count();
            $this->command->line(" 📅 Created **{$occurrences->count()}** Occurrences.");


            // 3. CREATE TICKET TYPES (Ticket definition, e.g., 'General' vs 'VIP')
            // ---------------------------------------------------------------------
            // Hardcode common ticket types using the factory for the rest of the data.
            $tickets = collect([
                EventTicketType::factory()->make(['title' => 'General Admission', 'base_price' => $faker->randomFloat(2, 20, 50)]),
                EventTicketType::factory()->make(['title' => 'VIP Access', 'base_price' => $faker->randomFloat(2, 80, 150)]),
            ]);
            $tickets = $event->ticketTypes()->saveMany($tickets); 
            $totalTicketTypes += $tickets->count();
            $this->command->line(" 🎫 Created **{$tickets->count()}** Ticket Types.");

            
            // 4. CREATE INVENTORY (EventOccurrenceTicket)
            // ---------------------------------------------------------------------
            $inventoryData = [];
            foreach ($occurrences as $occurrence) {
                foreach ($tickets as $ticket) {
                    $basePrice = $ticket->base_price;
                    $availableQuantity = $faker->numberBetween(10, 100);
                    // Introduce a 20% chance of overriding the base price for this specific occurrence/ticket combo.
                    $priceOverride = $faker->boolean(20) ? $faker->randomFloat(2, $basePrice * 0.8, $basePrice * 1.2) : $basePrice;

                    $inventoryData[] = [
                        'event_occurrence_id' => $occurrence->id,
                        'event_ticket_type_id' => $ticket->id,
                        'available_quantity' => $availableQuantity,
                        'override_price' => $priceOverride,
                        'sold_count' => $faker->numberBetween(1, 10),
                        // 10% chance of a special sale price lower than the override/base price.
                        'sale_price' => $faker->boolean(10) && $priceOverride > 10 ? $faker->randomFloat(2, 5, $priceOverride - 5) : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            
            // Use mass insertion (insert) for efficiency.
            EventOccurrenceTicket::insert($inventoryData); 
            $totalInventoryRecords += count($inventoryData);
            $this->command->line(" 📦 Populated **" . count($inventoryData) . "** inventory records.");

            
            // 5. CREATE BOOKINGS (EventBooking)
            // ---------------------------------------------------------------------
            $allCombinations = [];
            
            // Fetch the newly created inventory records for lookup during booking generation.
            $inventoryRecords = EventOccurrenceTicket::whereIn('event_occurrence_id', $occurrences->pluck('id'))
                                                   ->get()
                                                   ->keyBy(fn ($item) => $item->event_occurrence_id . '-' . $item->event_ticket_type_id);

            // Prepare all possible valid (User, Occurrence, Ticket) combinations that have inventory.
            foreach ($userIds as $userId) {
                foreach ($occurrences as $occurrence) {
                    foreach ($tickets as $ticket) {
                        $key = $occurrence->id . '-' . $ticket->id;
                        $inventory = $inventoryRecords->get($key); 

                        // Only select combinations that have available inventory, with a 30% chance of booking.
                        if ($inventory && $inventory->available_quantity > 0 && $faker->boolean(30)) {
                            $allCombinations[] = [
                                'occurrence_ticket_id' => $inventory->id,
                                'user_id' => $userId,
                                'event_id' => $event->id,
                                'event_occurrence_id' => $occurrence->id,
                                'event_ticket_type_id' => $ticket->id,
                                // Use the override price from inventory, or fall back to the base ticket price.
                                'unit_price' => $inventory->override_price ?? $ticket->base_price,
                            ];
                        }
                    }
                }
            }

            // Select a random, small subset of the valid combinations for actual bookings.
            shuffle($allCombinations);
            $bookingsToCreateCount = $faker->numberBetween(1, 5);
            $actualBookingsCount = min($bookingsToCreateCount, count($allCombinations));
            $selectedCombinations = array_slice($allCombinations, 0, $actualBookingsCount);

            // Create booking data using the factory and map the foreign keys/calculated totals.
            $bookingsData = EventBooking::factory()
                ->count($actualBookingsCount)
                ->make()
                ->map(function ($booking, $index) use ($selectedCombinations) {
                    $combo = $selectedCombinations[$index];
                    $quantity = $booking->quantity;

                    // Assign foreign keys and calculated values from the random combination.
                    $booking->user_id = $combo['user_id'];
                    $booking->event_id = $combo['event_id']; 
                    $booking->event_occurrence_id = $combo['event_occurrence_id'];
                    $booking->occurrence_ticket_id = $combo['occurrence_ticket_id'];
                    $booking->event_ticket_type_id = $combo['event_ticket_type_id'];
                    $booking->quantity = $quantity;
                    
                    // Hardened Transactional Metadata
                    $booking->transaction_id = 'TRX-' . Str::upper(Str::random(10));
                    $booking->payment_status = $faker->randomElement(['paid', 'pending']);

                    // Recalculate total_price based on the selected unit price and quantity.
                    $booking->total_price = $quantity * $combo['unit_price']; 

                    // 1. Convert the model (with factory data) to an array for mass insertion.
                    $bookingArray = $booking->toArray();

                    // 2. Generate and format the dates directly as Carbon objects.
                    $createdAtCarbon = Carbon::now()
                        ->subDays(rand(1, 90))
                        ->subHours(rand(1, 23))
                        ->subMinutes(rand(1, 59));
                        
                    $updatedAtCarbon = (clone $createdAtCarbon)->addSeconds(rand(1, 60));

                    // required datetime format, potentially causing errors. We force the correct format here.
                    $bookingArray['created_at'] = $createdAtCarbon->format('Y-m-d H:i:s');
                    $bookingArray['updated_at'] = $updatedAtCarbon->format('Y-m-d H:i:s');
                    
                    // We return the array with the correct date strings for mass insertion.
                    return $bookingArray;
                })
                ->toArray();

            // Mass insert the array of booking data for high performance.
            EventBooking::insert($bookingsData);

            $totalBookings += $actualBookingsCount;
            $this->command->line(" 💵 Created **{$actualBookingsCount}** Bookings.");
            
            $this->command->newLine();
        }

        $recordsCreated = Event::count() - $initialEventCount;

        // --- Summary and Footer ---
        
        $this->command->info('--- Event Module Seeding Summary ---');
        
        // 🔢 Count Display (Green Text)
        $this->command->info("   > **$recordsCreated** new Events created.");
        $this->command->info("   > **$totalOccurrences** Event Occurrences created.");
        $this->command->info("   > **$totalTicketTypes** Event Ticket Types created.");
        $this->command->info("   > **$totalInventoryRecords** Event Inventory (Occurrence Ticket) records created.");
        $this->command->info("   > **$totalBookings** Event Bookings created.");
        
        // 🎉 Success Footer (Yellow Text with Emoji)
        $this->command->warn('🎉 Event Module Seeding is complete! Success.');
    }
}