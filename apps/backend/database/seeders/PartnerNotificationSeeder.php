<?php
// File: apps/backend/database/seeders/PartnerNotificationSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Notifications\Partner\PartnerAlertNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PartnerNotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('🔔 Starting Partner Notification Seeder...');
        }

        $partners = User::whereHas('roles', function ($query) {
            $query->where('name', 'partner');
        })->get();

        $seededCount = 0;

        foreach ($partners as $partner) {
            // Delete old database notifications for partners to make a clean seed
            $partner->notifications()->delete();

            // 1. Order alert (Unread)
            $partner->notify(new PartnerAlertNotification(
                'order',
                'New Product Order Received',
                'A buyer has purchased the premium listing "Pro Soundboard Pack" for $45.00. Ready for fulfillment.',
                '/dashboard/orders'
            ));

            // 2. Booking alert (Unread)
            $partner->notify(new PartnerAlertNotification(
                'booking',
                'Property Visit Scheduled',
                'Julian Sterling requested an in-person viewing appointment for "Luxury Downtown Loft" on Monday at 3:00 PM.',
                '/dashboard/leads'
            ));

            // 3. Inquiry alert (Unread)
            $partner->notify(new PartnerAlertNotification(
                'inquiry',
                'New Classified Inquiry',
                'A buyer submitted a listing inquiry: "Is the price negotiable? I can pick up tomorrow morning."',
                '/dashboard/leads'
            ));

            // 4. Payout alert (Read)
            $partner->notify(new PartnerAlertNotification(
                'payout',
                'Withdrawal Request Approved',
                'Your withdrawal request #8749 of $1,250.00 to Chase Bank **** 4290 was processed and completed.',
                '/dashboard/wallet'
            ));

            // 5. Review alert (Read)
            $partner->notify(new PartnerAlertNotification(
                'review',
                'New 5-Star Customer Review',
                'Sarah Jenkins left a 5-star rating: "Fantastic service, prompt delivery and exactly as described!"',
                '/dashboard/reviews'
            ));

            // 6. System Alert (Read)
            $partner->notify(new PartnerAlertNotification(
                'system',
                'Account Login from New IP',
                'A successful dashboard login was detected from a new location (San Francisco, CA) at 12:45 PM.',
                '/dashboard/profile'
            ));

            // Force mark the last 3 as read to test unread filters
            $partner->notifications()
                ->orderBy('created_at', 'asc')
                ->limit(3)
                ->get()
                ->each(function ($n) {
                    $n->update(['read_at' => Carbon::now()->subHours(mt_rand(1, 24))]);
                });

            $seededCount += 6;
        }

        if ($this->command) {
            $this->command->info("✅ Successfully seeded {$seededCount} notifications for {$partners->count()} partners.");
        }
    }
}
