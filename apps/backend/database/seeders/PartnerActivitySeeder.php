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
use App\Models\Withdrawal;

/**
 * Class PartnerActivitySeeder
 *
 * Populates Julian Sterling's partner panel dashboard under partner@sellio.buzz.
 * It transfers listing ownership to Julian and simulates buyer actions (bookings, quotes,
 * inquiries, reviews, wallet earnings, withdrawals, and direct messaging).
 */
class PartnerActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        config(['activitylog.enabled' => false]);

        $this->command->info('👤✨ Starting **Partner Activity Seeder** for partner@sellio.buzz...');

        // 1. Fetch Julian Sterling (Partner) and some buyers
        $partner = User::where('email', 'partner@sellio.buzz')->first();
        $buyer = User::where('email', 'buyer@sellio.buzz')->first();
        $otherBuyers = User::where('is_partner', false)->where('id', '!=', $buyer ? $buyer->id : 0)->limit(5)->get();

        if (!$partner) {
            $this->command->error('❌ Partner user partner@sellio.buzz not found. Ensure UserSeeder has run first.');
            return;
        }

        $buyerId = $buyer ? $buyer->id : 3;

        $this->cleanupOldRecords($partner->id, $buyer?->id);

        // --- 2. RETRIEVE & ASSIGN LISTINGS TO JULIAN STERLING ---
        $this->command->line('  ⚙️ Transferring listing ownerships to Julian Sterling...');

        // Pick 4 Properties to be owned by Julian
        $properties = Property::limit(4)->get();
        foreach ($properties as $property) {
            $property->user_id = $partner->id;
            $property->save();
        }

        // Pick 4 Autos to be owned by Julian
        $autos = Auto::limit(4)->get();
        foreach ($autos as $auto) {
            $auto->user_id = $partner->id;
            $auto->save();
        }

        // Pick 4 Events to be owned by Julian
        $events = Event::with(['occurrences', 'ticketTypes'])->limit(4)->get();
        foreach ($events as $event) {
            $event->user_id = $partner->id;
            $event->save();
        }

        // Pick 4 Services to be owned by Julian
        $services = Service::with('packages')->limit(4)->get();
        foreach ($services as $service) {
            $service->user_id = $partner->id;
            $service->save();
        }

        // Pick 4 Job Listings to be owned by Julian
        $jobs = JobListing::limit(4)->get();
        foreach ($jobs as $job) {
            $job->user_id = $partner->id;
            $job->save();
        }

        // Pick 4 Classifieds to be owned by Julian
        $classifieds = Classified::limit(4)->get();
        foreach ($classifieds as $classified) {
            $classified->user_id = $partner->id;
            $classified->save();
        }

        // --- 3. PROPERTY BOOKINGS (Incoming to Julian's Properties) ---
        if ($properties->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  🏠 Seeding Bookings on Julian\'s Properties...');
            $statuses = [PropertyBooking::STATUS_CONFIRMED, PropertyBooking::STATUS_PENDING, PropertyBooking::STATUS_COMPLETED, PropertyBooking::STATUS_CANCELLED];
            
            foreach ($properties as $index => $property) {
                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();
                
                $checkIn = Carbon::now()->addDays(($index + 1) * 3);
                $checkOut = (clone $checkIn)->addDays(3);
                $nights = 3;
                $basePricePerNight = $property->base_price ?: 120.00;
                $totalPrice = $basePricePerNight * $nights;
                $feeAndTax = 35.00;
                $addonPrice = 25.00;
                $finalPrice = $totalPrice + $feeAndTax + $addonPrice;

                // Create Booking
                $booking = new PropertyBooking();
                $booking->user_id = $customer->id;
                $booking->property_id = $property->id;
                $booking->check_in_date = $checkIn;
                $booking->check_out_date = $checkOut;
                $booking->guests = rand(1, 4);
                $booking->total_price = $finalPrice;
                $booking->status = $status;
                $booking->full_name = $customer->name;
                $booking->email = $customer->email;
                $booking->phone = $customer->phone ?: '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999);
                $booking->message = 'Hi Julian! I am extremely excited to book this listing. Let me know if there are any specific guidelines.';
                $booking->save();

                // Create Transaction Lines
                TransactionLine::create([
                    'property_id' => $property->id,
                    'property_booking_id' => $booking->id,
                    'description' => 'Base Rental (3 nights)',
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
            }
        }

        // --- 4. PROPERTY VISITS (Viewings requested on Julian's Properties) ---
        if ($properties->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  👀 Seeding Visits on Julian\'s Properties...');
            $statuses = ['confirmed', 'pending', 'completed'];
            
            foreach ($properties->take(3) as $index => $property) {
                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();
                
                PropertyVisit::create([
                    'user_id' => $customer->id,
                    'property_id' => $property->id,
                    'full_name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone ?: '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999),
                    'scheduled_at' => Carbon::now()->addDays(($index + 1) * 2)->setTime(11 + $index, 30),
                    'status' => $status,
                    'notes' => 'Would love to inspect the garage layout and security system during the viewing.',
                ]);
            }
        }

        // --- 5. EVENT BOOKINGS (Ticket sales on Julian's Events) ---
        if ($events->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  🎫 Seeding Ticket Sales on Julian\'s Events...');
            $statuses = ['confirmed', 'pending', 'confirmed'];
            
            foreach ($events->take(3) as $index => $event) {
                $occurrence = $event->occurrences->first();
                $ticketType = $event->ticketTypes->first();
                
                if (!$occurrence || !$ticketType) continue;

                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();
                $quantity = rand(2, 4);
                $unitPrice = $ticketType->base_price ?: 60.00;
                
                $inventory = EventOccurrenceTicket::firstOrCreate(
                    [
                        'event_occurrence_id' => $occurrence->id,
                        'event_ticket_type_id' => $ticketType->id,
                    ],
                    [
                        'available_quantity' => 150,
                        'override_price' => $unitPrice,
                        'sold_count' => 0,
                    ]
                );

                EventBooking::create([
                    'user_id' => $customer->id,
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

        // --- 6. SERVICE APPOINTMENTS (Client Bookings on Julian's Services) ---
        if ($services->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  🛠️ Seeding Appointments on Julian\'s Services...');
            $statuses = [ServiceAppointment::STATUS_CONFIRMED, ServiceAppointment::STATUS_PENDING, ServiceAppointment::STATUS_COMPLETED];
            
            foreach ($services->take(3) as $index => $service) {
                $package = $service->packages->first();
                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();
                $price = $package ? $package->price : ($service->sale_price ?? $service->base_price ?? 90.00);

                ServiceAppointment::withoutEvents(fn () => ServiceAppointment::create([
                    'user_id' => $customer->id,
                    'service_id' => $service->id,
                    'service_package_id' => $package ? $package->id : null,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone ?: '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999),
                    'topic' => $package ? $package->title : 'Custom Logistics Setup',
                    'scheduled_at' => Carbon::now()->addDays(($index + 1) * 3)->setTime(13 + $index, 0),
                    'status' => $status,
                    'notes' => 'Looking forward to meeting to detail the operational roadmap.',
                    'admin_note' => 'Standard appointment.',
                    'price' => $price,
                ]));
            }
        }

        // --- 7. SERVICE QUOTES (Incoming RFQs for Julian's Services) ---
        if ($services->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  ✉️ Seeding RFQs on Julian\'s Services...');
            $statuses = [ServiceQuote::STATUS_PENDING, ServiceQuote::STATUS_QUOTED, ServiceQuote::STATUS_ACCEPTED];
            
            foreach ($services->take(3) as $index => $service) {
                $package = $service->packages->first();
                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();

                $quote = new ServiceQuote();
                $quote->user_id = $customer->id;
                $quote->service_id = $service->id;
                $quote->service_package_id = $package ? $package->id : null;
                $quote->scope_size = 'Custom Enterprise';
                $quote->details = 'Need full system integration with multi-user permissions, audit trail logging, and custom brand configurations.';
                $quote->requested_date = Carbon::now()->addWeeks(1 + $index);
                $quote->status = $status;
                $quote->quoted_price = $status !== ServiceQuote::STATUS_PENDING ? ($service->base_price * 1.50 ?: 750.00) : null;
                $quote->save();
            }
        }

        // --- 8. JOB APPLICATIONS (Candidates applying to Julian's Jobs) ---
        if ($jobs->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  💼 Seeding Applications on Julian\'s Job Listings...');
            $statuses = [JobApplication::STATUS_PENDING, JobApplication::STATUS_REVIEWED, JobApplication::STATUS_INTERVIEW];
            
            foreach ($jobs->take(3) as $index => $job) {
                $status = $statuses[$index % count($statuses)];
                $candidate = $otherBuyers->random();

                JobApplication::create([
                    'job_listing_id' => $job->id,
                    'user_id' => $candidate->id,
                    'status' => $status,
                    'cover_letter' => "Dear Mr. Sterling,\n\nI am extremely interested in joining your esteemed enterprise in the {$job->title} role. Having worked extensively in high-performing systems and marketplace operations, I am confident I can excel in your environment.\n\nBest regards,\n{$candidate->name}",
                    'resume_path' => 'resumes/candidate-resume-' . $index . '.pdf',
                    'portfolio_url' => 'https://github.com/candidate-dev-' . $index,
                    'admin_note' => 'Qualified profile, scheduling screen.',
                ]);
            }
        }

        // --- 9. AUTO INQUIRIES (Buyer Leads on Julian's Vehicles) ---
        if ($autos->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  🚗 Seeding Leads on Julian\'s Autos...');
            $statuses = ['pending', 'contacted', 'resolved'];
            
            foreach ($autos->take(3) as $index => $auto) {
                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();

                AutoInquiry::create([
                    'user_id' => $customer->id,
                    'auto_id' => $auto->id,
                    'full_name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone ?: '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999),
                    'preferred_date' => Carbon::now()->addDays($index + 3)->format('Y-m-d'),
                    'preferred_time' => 'PM',
                    'message' => 'Hello, I saw your vehicle listing and am looking to confirm if the service papers and title are fully clear? I would love to see it this week.',
                    'status' => $status,
                ]);
            }
        }

        // --- 10. CLASSIFIED INQUIRIES (Leads on Julian's Classified Ads) ---
        if ($classifieds->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $this->command->line('  📣 Seeding Leads on Julian\'s Classifieds...');
            $statuses = [ClassifiedInquiry::STATUS_PENDING, ClassifiedInquiry::STATUS_CONTACTED, ClassifiedInquiry::STATUS_CONTACTED];
            
            foreach ($classifieds->take(3) as $index => $classified) {
                $status = $statuses[$index % count($statuses)];
                $customer = $otherBuyers->random();

                DB::table('classified_inquiries')->insert([
                    'user_id' => $customer->id,
                    'classified_id' => $classified->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone ?: '+1 (555) ' . rand(100, 999) . '-' . rand(1000, 9999),
                    'status' => $status,
                    'message' => 'Is this item still available? If so, are you available for local pickup this Friday afternoon? Thank you!',
                    'created_at' => Carbon::now()->subDays($index + 1),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        // --- 11. POLYMORPHIC REVIEWS (Received by Julian's Properties & Services) ---
        $this->command->line('  ⭐ Seeding Reviews on Julian\'s listings...');
        if ($properties->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $prop = $properties->first();
            $customer = $otherBuyers->random();
            Review::where('user_id', $customer->id)
                ->where('reviewable_id', $prop->id)
                ->where('reviewable_type', Property::class)
                ->delete();
            Review::create([
                'user_id' => $customer->id,
                'rating' => 5,
                'comment' => 'Julian is a fantastic host. The glass villa is absolutely breathtaking, fully equipped, and clean. An exquisite experience overall.',
                'status' => Review::STATUS_APPROVED,
                'reviewable_id' => $prop->id,
                'reviewable_type' => Property::class,
                'partner_id' => $partner->id,
            ]);
        }

        if ($services->isNotEmpty() && $otherBuyers->isNotEmpty()) {
            $srv = $services->first();
            $customer = $otherBuyers->random();
            Review::where('user_id', $customer->id)
                ->where('reviewable_id', $srv->id)
                ->where('reviewable_type', Service::class)
                ->delete();
            Review::create([
                'user_id' => $customer->id,
                'rating' => 5,
                'comment' => 'Outstanding implementation, premium communication channels, and super polite staff members. The team exceeded all performance expectations!',
                'status' => Review::STATUS_APPROVED,
                'reviewable_id' => $srv->id,
                'reviewable_type' => Service::class,
                'partner_id' => $partner->id,
            ]);
        }

        // --- 12. WALLET DEPOSITS & EARNINGS ---
        $this->command->line('  💰 Seeding Wallet Transactions for Julian...');
        $wallet = $partner->wallet;
        
        // Let's seed a massive transaction history of deposits (in cents)
        // 0. Historical Sales Revenue ($6,000.00 USD)
        $partner->deposit(600000, [
            'type' => 'historical_sales_revenue',
            'description' => 'Onboarding historical marketplace sales revenue credit',
            'partner_id' => $partner->id,
        ]);

        // 1. Property Booking Earning ($2,500.00 USD)
        $partner->deposit(250000, [
            'type' => 'property_booking_payout',
            'description' => 'Earning payout for glass villa booking #PV-8422',
            'partner_id' => $partner->id,
        ]);

        // 2. Service Project Earning ($1,250.00 USD)
        $partner->deposit(125000, [
            'type' => 'service_earning',
            'description' => 'Earning payout for custom design studio integration',
            'partner_id' => $partner->id,
        ]);

        // 3. Event Ticket Sales ($800.00 USD)
        $partner->deposit(80000, [
            'type' => 'ticket_sales_payout',
            'description' => 'Ticket sales payout for Tech Masterclass',
            'partner_id' => $partner->id,
        ]);

        // --- 13. WITHDRAWAL PAYOUTS ---
        $this->command->line('  💸 Seeding Payout Withdrawals and Transactions for Julian...');
        
        // Payout 1: Approved / Completed Bank Transfer ($1,500.00)
        $payoutDate1 = Carbon::now()->subDays(6);
        $w1 = Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 150000, // $1,500.00 USD (in cents)
            'method' => 'Bank Transfer',
            'details' => json_encode(['account' => 'Chase Bank **** 4290', 'name' => 'Julian Sterling']),
            'status' => 'approved',
            'admin_note' => 'Payout processed to verified Chase account.',
            'approved_at' => $payoutDate1->copy()->addDay(),
            'created_at' => $payoutDate1,
            'updated_at' => $payoutDate1->copy()->addDay(),
        ]);
        
        $tx1 = $partner->withdraw(150000, [
            'type' => 'withdrawal_request',
            'description' => 'Chase Bank Transfer payout (Withdrawal #' . $w1->id . ')',
            'withdrawal_id' => $w1->id,
        ]);
        $tx1->update(['created_at' => $payoutDate1, 'updated_at' => $payoutDate1]);

        // Payout 2: Pending Withdrawal ($850.00)
        $payoutDate2 = Carbon::now()->subHours(18);
        $w2 = Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 85000, // $850.00 USD (in cents)
            'method' => 'PayPal',
            'details' => json_encode(['account' => 'sterling.global@paypal.test', 'name' => 'Julian Sterling']),
            'status' => 'pending',
            'admin_note' => 'Awaiting corporate finance approval batch.',
            'created_at' => $payoutDate2,
            'updated_at' => $payoutDate2,
        ]);
        
        $tx2 = $partner->withdraw(85000, [
            'type' => 'withdrawal_request',
            'description' => 'Pending PayPal Transfer request (Withdrawal #' . $w2->id . ')',
            'withdrawal_id' => $w2->id,
        ]);
        $tx2->update(['created_at' => $payoutDate2, 'updated_at' => $payoutDate2]);

        // Payout 3: Rejected / Failed Withdrawal ($3,000.00)
        $payoutDate3 = Carbon::now()->subDays(12);
        $w3 = Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 300000, // $3,000.00 USD (in cents)
            'method' => 'Wire Transfer',
            'details' => json_encode(['account' => 'SWIFT-STERL-822', 'name' => 'Julian Sterling']),
            'status' => 'rejected',
            'admin_note' => 'Invalid SWIFT routing code provided. Funds returned to balance.',
            'rejected_at' => $payoutDate3->copy()->addDays(2),
            'created_at' => $payoutDate3,
            'updated_at' => $payoutDate3->copy()->addDays(2),
        ]);
        
        $tx3 = $partner->withdraw(300000, [
            'type' => 'withdrawal_request',
            'description' => 'Pending Wire Transfer request (Withdrawal #' . $w3->id . ')',
            'withdrawal_id' => $w3->id,
        ]);
        $tx3->update(['created_at' => $payoutDate3, 'updated_at' => $payoutDate3]);

        // Simulate the rejection refund (deposit)
        $txRefund = $partner->deposit(300000, [
            'type' => 'withdrawal_refund',
            'description' => "Withdrawal Request #{$w3->id} Rejected/Refunded",
            'reversal_of_id' => $tx3->id,
        ]);
        $txRefund->update(['created_at' => $payoutDate3->copy()->addDays(2), 'updated_at' => $payoutDate3->copy()->addDays(2)]);

        // --- 14. INBOX CONVERSATIONS & MESSAGES ---
        $this->command->line('  💬 Seeding Partner Message Threads...');

        // Conversation with Another Buyer: Auto Negotiation
        $otherBuyer = $otherBuyers->first();
        if ($otherBuyer) {
            $conv = Conversation::create([
                'user_id' => $otherBuyer->id,
                'partner_id' => $partner->id,
                'subject' => 'Auto Offer: Luxury Sports Car inspection',
                'status' => 'active',
                'admin_note' => 'Julian Sterling partner inbox thread.',
                'created_at' => Carbon::now()->subHours(15),
                'updated_at' => Carbon::now()->subHours(2),
            ]);

            Message::create([
                'conversation_id' => $conv->id,
                'sender_id' => $otherBuyer->id,
                'body' => 'Hi Mr. Sterling! I saw your sports car listing. Is the pricing flexible if I pay in full bank draft next Monday? Can we schedule a pre-purchase inspection?',
                'created_at' => Carbon::now()->subHours(15),
            ]);

            Message::create([
                'conversation_id' => $conv->id,
                'sender_id' => $partner->id,
                'body' => 'Greetings! Yes, I am open to a slight discount for immediate bank drafts. The vehicle is ready for mechanical screening. Let\'s book a visiting time.',
                'created_at' => Carbon::now()->subHours(10),
            ]);

            Message::create([
                'conversation_id' => $conv->id,
                'sender_id' => $otherBuyer->id,
                'body' => 'Fantastic! I will submit an inquiry to coordinate the time. Thank you.',
                'created_at' => Carbon::now()->subHours(2),
            ]);
        }

        $this->command->info('✅ Partner Activity Seeder finished successfully!');
    }

    /**
     * Cleans up partner demo leads on Julian's core listings without wiping the demo buyer account.
     *
     * @param int $userId Partner user id (Julian Sterling)
     * @param int|null $preserveBuyerId Demo buyer user id to keep untouched (buyer@sellio.buzz)
     * @return void
     */
    private function cleanupOldRecords(int $userId, ?int $preserveBuyerId = null): void
    {
        $excludeDemoBuyer = function ($query) use ($preserveBuyerId) {
            if ($preserveBuyerId) {
                $query->where('user_id', '!=', $preserveBuyerId);
            }

            return $query;
        };

        $propertyIds = Property::limit(4)->pluck('id')->toArray();
        if (!empty($propertyIds)) {
            $bookingIds = $excludeDemoBuyer(
                DB::table('property_bookings')->whereIn('property_id', $propertyIds)
            )->pluck('id')->toArray();
            if (!empty($bookingIds)) {
                DB::table('transaction_lines')->whereIn('property_booking_id', $bookingIds)->delete();
                DB::table('property_bookings')->whereIn('id', $bookingIds)->delete();
            }
            $excludeDemoBuyer(DB::table('property_visits')->whereIn('property_id', $propertyIds))->delete();
            DB::table('reviews')
                ->whereIn('reviewable_id', $propertyIds)
                ->where('reviewable_type', Property::class)
                ->when($preserveBuyerId, fn ($query) => $query->where('user_id', '!=', $preserveBuyerId))
                ->delete();
        }

        $eventIds = Event::limit(4)->pluck('id')->toArray();
        if (!empty($eventIds)) {
            $excludeDemoBuyer(DB::table('event_bookings')->whereIn('event_id', $eventIds))->delete();
        }

        $serviceIds = Service::limit(4)->pluck('id')->toArray();
        if (!empty($serviceIds)) {
            $excludeDemoBuyer(DB::table('service_appointments')->whereIn('service_id', $serviceIds))->delete();
            $excludeDemoBuyer(DB::table('service_quotes')->whereIn('service_id', $serviceIds))->delete();
            DB::table('reviews')
                ->whereIn('reviewable_id', $serviceIds)
                ->where('reviewable_type', Service::class)
                ->when($preserveBuyerId, fn ($query) => $query->where('user_id', '!=', $preserveBuyerId))
                ->delete();
        }

        $jobIds = JobListing::limit(4)->pluck('id')->toArray();
        if (!empty($jobIds)) {
            $excludeDemoBuyer(DB::table('job_applications')->whereIn('job_listing_id', $jobIds))->delete();
        }

        $autoIds = Auto::limit(4)->pluck('id')->toArray();
        if (!empty($autoIds)) {
            $excludeDemoBuyer(DB::table('auto_inquiries')->whereIn('auto_id', $autoIds))->delete();
        }

        $classifiedIds = Classified::limit(4)->pluck('id')->toArray();
        if (!empty($classifiedIds)) {
            $excludeDemoBuyer(DB::table('classified_inquiries')->whereIn('classified_id', $classifiedIds))->delete();
        }

        DB::table('withdrawals')->where('user_id', $userId)->delete();
        DB::table('reviews')->where('partner_id', $userId)->delete();

        // Purge previous transactions and reset wallet balance
        $partner = User::find($userId);
        if ($partner && $partner->wallet) {
            DB::table('transactions')->where('wallet_id', $partner->wallet->id)->delete();
            $partner->wallet->update(['balance' => 0]);
        }
    }
}
