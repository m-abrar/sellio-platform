<?php

// File: database/seeders/NotificationSeeder.php
// Purpose: Seeds sample database notification records, typically targeted at an admin user.
// This is essential for demonstrating the functionality of the notification system in a fresh installation,
// ensuring the dashboard shows pre-populated alerts upon first run.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Notifications\ContentFlagged; // Import your custom notification

/**
 * Class NotificationSeeder
 *
 * Seeds various types of unread notifications for the administration dashboard,
 * simulating common system alerts (e.g., queue failure, payment issues) and
 * user reports (e.g., spam flags, new support requests).
 */
class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Finds a suitable recipient (preferably an admin based on the 'admin' role)
     * and attaches several instances of the ContentFlagged notification to their profile
     * to populate the notification list.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('🔔 Starting Notification Seeder...');
        $count = 0;

        // 1. Find the Admin User
        // Attempts to find the primary admin user based on the assigned 'admin' role.
        $admin = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->first();

        if (!$admin) {
            // Fallback logic: If no specific admin user is found (e.g., roles seeder wasn't run),
            // we default to notifying a random existing user.
            $admin = User::inRandomOrder()->first(); 
            if (!$admin) {
                // Skip seeding if no users exist in the database at all.
                $this->command->error('❌ Skipping Notification Seeder: No users found in the database.');
                return;
            }
            $this->command->line("⚠️ Admin user not found. Defaulting to random user: {$admin->name} (ID: {$admin->id})");
        } else {
            $this->command->info("  👤 Target recipient: {$admin->name} (Admin)");
        }

        $this->command->line("\n--- 🚨 Seeding Unread Notifications ---");

        // notifyNow() bypasses ShouldQueue so records land in the DB immediately
        // without a queue worker (required for demo seeding to work reliably).
        $items = [
            ['alert',  'Queue worker failed on service job #456'],
            ['flag',   'Review flagged for spam'],
            ['review', 'New partner application pending review'],
            ['report', 'Broken photos reported on Listing #78'],
            ['alert',  'Subscription payment failed for user ID 991'],
            ['new',    'New support ticket opened by Jane Doe'],
            ['alert',  'External API sync failed at 3:00 AM'],
        ];

        foreach ($items as [$type, $message]) {
            $admin->notifyNow(new ContentFlagged($type, $message));
            $count++;
        }

        // --- 3. Output Confirmation ---
        $this->command->info("\n--- 🏁 Notification Seeding Complete ---");
        $this->command->info("🎉 Successfully seeded {$count} unread notifications for user: {$admin->name}.");
    }
}