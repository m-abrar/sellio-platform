<?php

// File: database/seeders/NewsletterSubscriberSeeder.php
// Purpose: Seeds the 'newsletter_subscribers' table with dummy data for development and testing.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewsletterSubscriber;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

/**
 * Class NewsletterSubscriberSeeder
 *
 * Populates the newsletter subscriber list with mock data, including various
 * confirmation statuses and subscription sources for testing segmenting and analytics.
 */
class NewsletterSubscriberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates 20 unique dummy newsletter subscribers.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        $count = 20; // Number of dummy subscribers to create

        $this->command->info('📧 Starting Newsletter Subscriber Seeder...');
        DB::table('newsletter_subscribers')->delete();
        $this->command->line('  🗑️ Cleared existing newsletter subscribers data.');

        // Common subscription sources used across the application
        $sources = ['footer', 'homepage_popup', 'blog_sidebar', 'checkout'];
        $subscribersCreated = 0;

        $this->command->line("\n--- 🧑‍💻 Creating {$count} Subscribers ---");

        for ($i = 0; $i < $count; $i++) {
            // Use firstOrCreate to prevent duplicates if seeding multiple times,
            // based on the unique 'email' column.
            NewsletterSubscriber::firstOrCreate(
                [
                    'email' => $faker->unique()->safeEmail(),
                ],
                [
                    'is_confirmed' => $faker->boolean(80), // 80% confirmed status for realism
                    'source' => $faker->randomElement($sources),
                    'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                    'updated_at' => now(),
                ]
            );
            $subscribersCreated++;
        }

        // Final Summary Footer
        $this->command->info("\n--- 🏁 Newsletter Seeding Complete ---");
        $this->command->info("🎉 Successfully seeded {$subscribersCreated} unique newsletter subscribers.");
    }
}