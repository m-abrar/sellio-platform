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
            $this->command->line("⚠️ Admin user not found. Defaulting to random user: {$admin->title} (ID: {$admin->id})");
        } else {
            $this->command->info("  👤 Target recipient: {$admin->title} (Admin)");
        }

        $this->command->line("\n--- 🚨 Seeding Unread Notifications ---");

        // --- 2. Create Sample Notifications (System Alerts and User Reports) ---
        
        // High-priority system alert simulating an infrastructure failure.
        $admin->notify(new ContentFlagged('alert', 'Queue worker failed on service job #456'));
        $count++;

        // Moderation flag indicating user-reported content requiring review.
        $admin->notify(new ContentFlagged('flag', 'Review flagged for spam'));
        $count++;
        
        // Workflow trigger indicating a task requiring manual approval from an administrator.
        $admin->notify(new ContentFlagged('review', 'New partner application pending review'));
        $count++;

        // Broken content report, typically triggered by an automated check or user feedback.
        $admin->notify(new ContentFlagged('report', 'Broken Listing: Broken photos reported on Listing #78'));
        $count++;

        // Critical billing/financial issue, often requiring immediate attention.
        $admin->notify(new ContentFlagged('alert', 'Subscription payment failed for user ID 991.'));
        $count++;

        // New user interaction, directing the admin to the support area.
        $admin->notify(new ContentFlagged('new', 'New support ticket opened by Jane Doe.'));
        $count++;

        // External service integration failure, impacting third-party data sync.
        $admin->notify(new ContentFlagged('alert', 'External API sync failed at 3:00 AM.'));
        $count++;

        // --- 3. Output Confirmation ---
        $this->command->info("\n--- 🏁 Notification Seeding Complete ---");
        $this->command->info("🎉 Successfully seeded {$count} unread notifications for user: {$admin->title}.");
    }
}