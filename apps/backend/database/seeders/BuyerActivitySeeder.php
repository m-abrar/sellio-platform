<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\TransactionLine;
use App\Models\Auto;
use App\Models\AutoInquiry;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\JobListing;
use App\Models\JobApplication;
use App\Models\Service;
use App\Models\ServicePackage;
use App\Models\ServiceAppointment;
use App\Models\ServiceQuote;
use App\Models\Favorite;
use App\Models\Review;
use App\Models\Conversation;
use App\Models\Message;

/**
 * Class BuyerActivitySeeder
 *
 * Populates all dashboard modules specifically for the buyer account (buyer@sellio-platform.test).
 * This ensures that when logging into the buyer panel, there is realistic, detailed demo data
 * in every single tab instead of "no records found" screens.
 */
class BuyerActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('👤✨ Starting **Buyer Activity Seeder** for buyer@sellio-platform.test...');

        // 1. Fetch Eleanor Vance (Buyer) & Julian Sterling (Partner)
        $buyer = User::where('email', 'buyer@sellio-platform.test')->first();
        $partner = User::where('email', 'partner@sellio-platform.test')->first();

        if (!$buyer) {
            $this->command->error('❌ Buyer user buyer@sellio-platform.test not found. Ensure UserSeeder has run first.');
            return;
        }

        if (!$partner) {
            $partner = User::where('is_partner', true)->first();
        }

        $partnerId = $partner ? $partner->id : 2;

        // Clear any old Eleanor Vance activity records to avoid duplicates if run multiple times
        $this->cleanupOldRecords($buyer->id);

        // --- 1. PROPERTY BOOKINGS & TRANSACTION LINES ---
        $properties = Property::limit(3)->get();
        if ($properties->isNotEmpty()) {
            $this->command->line('  🏠 Seeding Property Bookings...');
            $statuses = [PropertyBooking::STATUS_CONFIRMED, PropertyBooking::STATUS_PENDING, PropertyBooking::STATUS_COMPLETED];
            
            foreach ($properties as $index => $property) {
                $status = $statuses[$index % count($statuses)];
                
                $checkIn = Carbon::now()->addDays(($index + 1) * 5);
                $checkOut = (clone $checkIn)->addDays(4);
                $nights = 4;
                $basePricePerNight = $property->base_price ?: 150.00;
                $totalPrice = $basePricePerNight * $nights;
                $feeAndTax = 45.00;
                $addonPrice = 30.00;
                $finalPrice = $totalPrice + $feeAndTax + $addonPrice;

                // Create Booking
                $booking = new PropertyBooking();
                $booking->user_id = $buyer->id;
                $booking->property_id = $property->id;
                $booking->check_in_date = $checkIn;
                $booking->check_out_date = $checkOut;
                $booking->guests = rand(1, 3);
                $booking->total_price = $finalPrice;
                $booking->status = $status;
                $booking->full_name = $buyer->name;
                $booking->email = $buyer->email;
                $booking->phone = $buyer->phone ?: '+1 (555) 444-5555';
                $booking->message = 'Hi, I am booking this for my upcoming design consultancy visit. Thank you!';
                $booking->save();

                // Create Transaction Lines
                TransactionLine::create([
                    'property_id' => $property->id,
                    'property_booking_id' => $booking->id,
                    'description' => 'Base Rental (4 nights)',
                    'amount' => $totalPrice,
                    'type' => 'revenue',
                    'status' => 'active',
                    'transaction_date' => Carbon::now(),
                ]);

                TransactionLine::create([
                    'property_id' => $property->id,
                    'property_booking_id' => $booking->id,
                    'description' => 'Tax & Service Fees',
                    'amount' => $feeAndTax,
                    'type' => 'revenue',
                    'status' => 'active',
                    'transaction_date' => Carbon::now(),
                ]);

                TransactionLine::create([
                    'property_id' => $property->id,
                    'property_booking_id' => $booking->id,
                    'description' => 'Add-on: Housekeeping',
                    'amount' => $addonPrice,
                    'type' => 'revenue',
                    'status' => 'active',
                    'transaction_date' => Carbon::now(),
                ]);
            }
        }

        // --- 2. PROPERTY VISITS ---
        if ($properties->isNotEmpty()) {
            $this->command->line('  👀 Seeding Property Visits...');
            $statuses = ['confirmed', 'pending', 'completed'];
            
            foreach ($properties as $index => $property) {
                $status = $statuses[$index % count($statuses)];
                
                PropertyVisit::create([
                    'user_id' => $buyer->id,
                    'property_id' => $property->id,
                    'full_name' => $buyer->name,
                    'email' => $buyer->email,
                    'phone' => $buyer->phone ?: '+1 (555) 444-5555',
                    'scheduled_at' => Carbon::now()->addDays(($index + 1) * 3)->setTime(10 + $index, 0),
                    'status' => $status,
                    'notes' => 'Would love to inspect the architectural details of the exterior facade.',
                ]);
            }
        }

        // --- 3. EVENT BOOKINGS ---
        $events = Event::with(['occurrences', 'ticketTypes'])->limit(3)->get();
        if ($events->isNotEmpty()) {
            $this->command->line('  🎫 Seeding Event Bookings...');
            $statuses = ['confirmed', 'pending', 'cancelled'];
            
            foreach ($events as $index => $event) {
                $occurrence = $event->occurrences->first();
                $ticketType = $event->ticketTypes->first();
                
                if (!$occurrence || !$ticketType) continue;

                $status = $statuses[$index % count($statuses)];
                $quantity = rand(1, 2);
                $unitPrice = $ticketType->base_price ?: 50.00;
                
                // Ensure there is an inventory record
                $inventory = EventOccurrenceTicket::firstOrCreate(
                    [
                        'event_occurrence_id' => $occurrence->id,
                        'event_ticket_type_id' => $ticketType->id,
                    ],
                    [
                        'available_quantity' => 100,
                        'override_price' => $unitPrice,
                        'sold_count' => 0,
                    ]
                );

                EventBooking::create([
                    'user_id' => $buyer->id,
                    'event_id' => $event->id,
                    'event_occurrence_id' => $occurrence->id,
                    'occurrence_ticket_id' => $inventory->id,
                    'event_ticket_type_id' => $ticketType->id,
                    'quantity' => $quantity,
                    'total_price' => $quantity * $unitPrice,
                    'status' => $status,
                    'transaction_id' => 'TRX-' . Str::upper(Str::random(10)),
                    'payment_status' => $status === 'confirmed' ? 'paid' : 'pending',
                ]);
            }
        }

        // --- 4. SERVICE APPOINTMENTS ---
        $services = Service::with('packages')->limit(3)->get();
        if ($services->isNotEmpty()) {
            $this->command->line('  🛠️ Seeding Service Appointments...');
            $statuses = [ServiceAppointment::STATUS_CONFIRMED, ServiceAppointment::STATUS_PENDING, ServiceAppointment::STATUS_COMPLETED];
            
            foreach ($services as $index => $service) {
                $package = $service->packages->first();
                $status = $statuses[$index % count($statuses)];
                $price = $package ? $package->price : ($service->sale_price ?? $service->base_price ?? 75.00);

                ServiceAppointment::create([
                    'user_id' => $buyer->id,
                    'service_id' => $service->id,
                    'service_package_id' => $package ? $package->id : null,
                    'name' => $buyer->name,
                    'email' => $buyer->email,
                    'phone' => $buyer->phone ?: '+1 (555) 444-5555',
                    'topic' => $package ? $package->title : 'General Consultation',
                    'scheduled_at' => Carbon::now()->addDays(($index + 1) * 4)->setTime(14, 0),
                    'status' => $status,
                    'notes' => 'Need to coordinate customized delivery instructions.',
                    'admin_note' => 'Priority booking from high-value Eleanor.',
                    'price' => $price,
                ]);
            }
        }

        // --- 5. SERVICE QUOTES (RFQ) ---
        if ($services->isNotEmpty()) {
            $this->command->line('  ✉️ Seeding Service Quotes (RFQs)...');
            $statuses = [ServiceQuote::STATUS_PENDING, ServiceQuote::STATUS_QUOTED, ServiceQuote::STATUS_ACCEPTED];
            
            foreach ($services as $index => $service) {
                $package = $service->packages->first();
                $status = $statuses[$index % count($statuses)];

                $quote = new ServiceQuote();
                $quote->user_id = $buyer->id;
                $quote->service_id = $service->id;
                $quote->service_package_id = $package ? $package->id : null;
                $quote->scope_size = 'Large';
                $quote->details = 'Looking for full structural integration with custom typography design and brand alignments.';
                $quote->requested_date = Carbon::now()->addWeeks(2 + $index);
                $quote->status = $status;
                $quote->quoted_price = $status !== ServiceQuote::STATUS_PENDING ? ($service->base_price * 1.25 ?: 500.00) : null;
                $quote->save();
            }
        }

        // --- 6. JOB APPLICATIONS ---
        $jobs = JobListing::limit(3)->get();
        if ($jobs->isNotEmpty()) {
            $this->command->line('  💼 Seeding Job Applications...');
            $statuses = [JobApplication::STATUS_PENDING, JobApplication::STATUS_REVIEWED, JobApplication::STATUS_INTERVIEW];
            
            foreach ($jobs as $index => $job) {
                $status = $statuses[$index % count($statuses)];

                JobApplication::create([
                    'job_listing_id' => $job->id,
                    'user_id' => $buyer->id,
                    'status' => $status,
                    'cover_letter' => "Dear Hiring Manager,\n\nI am writing to express my eager interest in the {$job->title} position at your company. With my extensive background in design consultancy and premium portfolio management, I believe I can bring immediate value to the team.\n\nThank you for your consideration.\n\nWarm regards,\nEleanor Vance",
                    'resume_path' => 'resumes/eleanor-vance-curator-cv.pdf',
                    'portfolio_url' => 'https://vancecurator-studios.test',
                    'admin_note' => 'Outstanding portfolio submitted.',
                ]);
            }
        }

        // --- 7. AUTO INQUIRIES ---
        $autos = Auto::limit(3)->get();
        if ($autos->isNotEmpty()) {
            $this->command->line('  🚗 Seeding Auto Inquiries...');
            $statuses = ['pending', 'contacted', 'resolved'];
            
            foreach ($autos as $index => $auto) {
                $status = $statuses[$index % count($statuses)];

                AutoInquiry::create([
                    'user_id' => $buyer->id,
                    'auto_id' => $auto->id,
                    'full_name' => $buyer->name,
                    'email' => $buyer->email,
                    'phone' => $buyer->phone ?: '+1 (555) 444-5555',
                    'preferred_date' => Carbon::now()->addDays($index + 2)->format('Y-m-d'),
                    'preferred_time' => 'AM',
                    'message' => 'Is this vehicle still in active stock? I am looking to schedule an on-site mechanical inspection and test drive next Tuesday.',
                    'status' => $status,
                ]);
            }
        }

        // --- 8. CLASSIFIED INQUIRIES ---
        $classifieds = Classified::limit(3)->get();
        if ($classifieds->isNotEmpty()) {
            $this->command->line('  📣 Seeding Classified Inquiries...');
            $statuses = [ClassifiedInquiry::STATUS_PENDING, ClassifiedInquiry::STATUS_CONTACTED, ClassifiedInquiry::STATUS_CONTACTED];
            
            foreach ($classifieds as $index => $classified) {
                $status = $statuses[$index % count($statuses)];

                DB::table('classified_inquiries')->insert([
                    'user_id' => $buyer->id,
                    'classified_id' => $classified->id,
                    'name' => $buyer->name,
                    'email' => $buyer->email,
                    'phone' => $buyer->phone ?: '+1 (555) 444-5555',
                    'status' => $status,
                    'message' => 'Hello! I am highly interested in purchasing this listing. Is the price negotiable, and can we set up a secure meeting place?',
                    'created_at' => Carbon::now()->subDays($index),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        // --- 9. POLYMORPHIC FAVORITES ---
        $this->command->line('  ❤️ Seeding Polymorphic Favorites...');
        
        $favoritesData = [];

        // Add 2 properties
        foreach ($properties->take(2) as $p) {
            $favoritesData[] = ['favoritable_id' => $p->id, 'favoritable_type' => Property::class];
        }
        // Add 2 autos
        foreach ($autos->take(2) as $a) {
            $favoritesData[] = ['favoritable_id' => $a->id, 'favoritable_type' => Auto::class];
        }
        // Add 2 services
        foreach ($services->take(2) as $s) {
            $favoritesData[] = ['favoritable_id' => $s->id, 'favoritable_type' => Service::class];
        }
        // Add 2 jobs
        foreach ($jobs->take(2) as $j) {
            $favoritesData[] = ['favoritable_id' => $j->id, 'favoritable_type' => JobListing::class];
        }
        // Add 2 events
        foreach ($events->take(2) as $e) {
            $favoritesData[] = ['favoritable_id' => $e->id, 'favoritable_type' => Event::class];
        }
        // Add 2 classifieds
        foreach ($classifieds->take(2) as $c) {
            $favoritesData[] = ['favoritable_id' => $c->id, 'favoritable_type' => Classified::class];
        }

        foreach ($favoritesData as $fav) {
            Favorite::firstOrCreate([
                'user_id' => $buyer->id,
                'favoritable_id' => $fav['favoritable_id'],
                'favoritable_type' => $fav['favoritable_type'],
            ]);
        }

        // --- 10. POLYMORPHIC REVIEWS ---
        $this->command->line('  ⭐ Seeding Polymorphic Reviews...');
        
        // Let's have the buyer review 1 property and 1 service
        if ($properties->isNotEmpty()) {
            $prop = $properties->first();
            Review::where('user_id', $buyer->id)
                ->where('reviewable_id', $prop->id)
                ->where('reviewable_type', Property::class)
                ->forceDelete();
            Review::create([
                'user_id' => $buyer->id,
                'rating' => 5,
                'comment' => 'Outstanding location! Extremely high-end aesthetic layout, gorgeous typography on custom panels, and flawless response speed from the manager. Strongly recommend!',
                'status' => Review::STATUS_APPROVED,
                'reviewable_id' => $prop->id,
                'reviewable_type' => Property::class,
                'partner_id' => $prop->user_id,
            ]);
        }

        if ($services->isNotEmpty()) {
            $srv = $services->first();
            Review::where('user_id', $buyer->id)
                ->where('reviewable_id', $srv->id)
                ->where('reviewable_type', Service::class)
                ->forceDelete();
            Review::create([
                'user_id' => $buyer->id,
                'rating' => 4,
                'comment' => 'Very professional execution of service tasks. Timely coordination, highly recommended package structures, and polite staff members.',
                'status' => Review::STATUS_APPROVED,
                'reviewable_id' => $srv->id,
                'reviewable_type' => Service::class,
                'partner_id' => $srv->user_id,
            ]);
        }

        // --- 11. INBOX MESSAGES & CONVERSATIONS ---
        $this->command->line('  💬 Seeding Message Threads...');

        $buyerProperty = Property::first();
        $buyerService = Service::first();

        // Conversation 1: Property Inquiry
        $conv1 = Conversation::create([
            'user_id' => $buyer->id,
            'partner_id' => $partnerId,
            'subject' => 'Inquiry about Sterling Villa Listing details',
            'status' => 'active',
            'admin_note' => 'Eleanor Vance inbox thread.',
            'inquiriable_type' => $buyerProperty ? Property::class : null,
            'inquiriable_id' => $buyerProperty ? $buyerProperty->id : null,
            'created_at' => Carbon::now()->subHours(12),
            'updated_at' => Carbon::now()->subHours(4),
        ]);

        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $buyer->id,
            'body' => 'Hello Julian! I viewed the luxury villa listing and would like to ask if there are high-resolution architectural plans or layouts available? Looking forward to your details.',
            'created_at' => Carbon::now()->subHours(12),
        ]);

        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $partnerId,
            'body' => 'Hi Eleanor, thank you for reaching out! Yes, I have the full brochure and blue-collar/engineering floor plans in PDF format. I will send them directly to your email shortly!',
            'created_at' => Carbon::now()->subHours(8),
        ]);

        Message::create([
            'conversation_id' => $conv1->id,
            'sender_id' => $buyer->id,
            'body' => 'That is wonderful, thank you so much! Please do so, and let\'s coordinate a physical visit for next week.',
            'created_at' => Carbon::now()->subHours(4),
        ]);

        // Conversation 2: Service Booking Coordination
        $conv2 = Conversation::create([
            'user_id' => $buyer->id,
            'partner_id' => $partnerId,
            'subject' => 'Service Package Customization Options',
            'status' => 'active',
            'admin_note' => 'Eleanor Vance inbox thread 2.',
            'inquiriable_type' => $buyerService ? Service::class : null,
            'inquiriable_id' => $buyerService ? $buyerService->id : null,
            'created_at' => Carbon::now()->subDays(2),
            'updated_at' => Carbon::now()->subDays(1),
        ]);

        Message::create([
            'conversation_id' => $conv2->id,
            'sender_id' => $buyer->id,
            'body' => 'Greetings, I would like to request some customization on your Premium Wellness tier package. Are we able to swap the standard sessions for deep tissue therapy?',
            'created_at' => Carbon::now()->subDays(2),
        ]);

        Message::create([
            'conversation_id' => $conv2->id,
            'sender_id' => $partnerId,
            'body' => 'Absolutely, Eleanor! We are highly flexible for VIP premium clients. I have updated your request internally so you can book the slots accordingly.',
            'created_at' => Carbon::now()->subDays(1),
        ]);

        $this->command->info('✅ Buyer Activity Seeder finished successfully!');
    }

    /**
     * Cleans up any existing activity records specifically for Eleanor to avoid duplicate seedings.
     *
     * @param int $userId
     * @return void
     */
    private function cleanupOldRecords(int $userId): void
    {
        PropertyBooking::where('user_id', $userId)->delete();
        PropertyVisit::where('user_id', $userId)->delete();
        EventBooking::where('user_id', $userId)->delete();
        ServiceAppointment::where('user_id', $userId)->delete();
        ServiceQuote::where('user_id', $userId)->delete();
        JobApplication::where('user_id', $userId)->delete();
        AutoInquiry::where('user_id', $userId)->delete();
        DB::table('classified_inquiries')->where('user_id', $userId)->delete();
        Favorite::where('user_id', $userId)->delete();
        Review::where('user_id', $userId)->forceDelete();
        
        $convIds = Conversation::where('user_id', $userId)->pluck('id')->toArray();
        if (!empty($convIds)) {
            Message::whereIn('conversation_id', $convIds)->delete();
            Conversation::whereIn('id', $convIds)->delete();
        }
    }
}
