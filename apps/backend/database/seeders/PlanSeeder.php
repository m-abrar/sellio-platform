<?php

// File: database/seeders/PlanSeeder.php
// Purpose: This seeder is responsible for populating the 'plans' database table with the initial set of default subscription tiers (Starter, Pro, Enterprise).
// It uses firstOrCreate to ensure that the seed can be run multiple times without creating duplicate records.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

/**
 * Class PlanSeeder
 *
 * Seeds the application's core subscription plans into the database.
 * These plans define the feature limits, pricing, and billing periods
 * available to customers.
 */
class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates the three primary subscription plans: Starter, Pro, and Enterprise.
     * The firstOrCreate method ensures idempotency, preventing duplicates
     * if the seeder is executed more than once.
     *
     * @return void
     */
    public function run(): void
    {
        $createdCount = 0;
        $existingCount = 0;

        // Header
        $this->command->info('💲 Starting Plan Module Seeding...');

        // 1. Starter Plan (Low-Cost, basic feature access)
        // Designed for new or casual users needing fundamental features and low listing limits.
        $planStarter = Plan::firstOrCreate(['title' => 'Starter Plan'], [
            'description' => 'Perfect for a beginner.',
            'label_text' => 'Best Value', // Highlighted on the pricing page as the most affordable entry point.
            'price' => 9.99,
            'billing_period' => 'monthly',
            
            'max_listings' => 3,    // Limit of 3 active listings at any time.
            'max_addons' => 5,      // Limited to 5 available feature addons.
            'priority_support' => false, // Standard support channel access.

            'max_featured_listings' => 1,   // Can feature only 1 listing on the homepage or top results.
            'custom_branding' => false,     // Platform branding remains on the user's content.
            'analytics_access' => 'basic',  // Provides basic, summarized analytics data.
            'listing_duration' => 30,   // Listings renew or expire monthly (30 days).
            'is_active' => true,
        ]);

        if ($planStarter->wasRecentlyCreated) {
            $this->command->info("  ➕ Created: '{$planStarter->title}' (Monthly \$9.99)");
            $createdCount++;
        } else {
            $this->command->line("  ⏭️ Existing: '{$planStarter->title}' found. (No changes made)");
            $existingCount++;
        }

        // 2. Pro Plan (The Standard, essential premium features)
        // Targeting professional users requiring higher limits and premium access.
        $planPro = Plan::firstOrCreate(['title' => 'Pro Plan'], [
            'description' => 'Full access for a professional portfolio.',
            'label_text' => 'Popular', // Recommended plan, visually emphasized to drive conversions.
            'price' => 49.99,
            'billing_period' => 'monthly',
            
            'max_listings' => 10,       // Increased listing capacity.
            'max_addons' => 50,      // Significant increase in available addons.
            'priority_support' => true, // Access to priority, faster support channels.

            'max_featured_listings' => 3,   // Can feature up to 3 listings concurrently.
            'custom_branding' => true,      // Allows the removal of platform branding (a key premium feature).
            'analytics_access' => 'advanced',   // Access to detailed, real-time analytics reports.
            'listing_duration' => 90,       // Listings renew or expire quarterly (90 days).
            'is_active' => true,
        ]);

        if ($planPro->wasRecentlyCreated) {
            $this->command->info("  ➕ Created: '{$planPro->title}' (Monthly \$49.99)");
            $createdCount++;
        } else {
            $this->command->line("  ⏭️ Existing: '{$planPro->title}' found. (No changes made)");
            $existingCount++;
        }

        // 3. Enterprise Plan (Unlimited, maximum access)
        // Dedicated tier for large agencies or organizations needing maximum scale.
        $planEnterprise = Plan::firstOrCreate(['title' => 'Enterprise Plan'], [
            'description' => 'For large agencies with unlimited listings.',
            'label_text' => null, // No specific label needed; its feature set speaks for itself.
            'price' => 199.99,
            'billing_period' => 'annually', // Annual commitment for better long-term predictability.
            
            'max_listings' => 999,      // Effectively unlimited listings.
            'max_addons' => 999,                // Effectively unlimited addons.
            'priority_support' => true,

            'max_featured_listings' => 10,  // Maximum number of featured listings allowed.
            'custom_branding' => true,
            'analytics_access' => 'advanced',
            'listing_duration' => 365,      // Annual renewal period.
            'is_active' => true,
        ]);

        if ($planEnterprise->wasRecentlyCreated) {
            $this->command->info("  ➕ Created: '{$planEnterprise->title}' (Annually \$199.99)");
            $createdCount++;
        } else {
            $this->command->line("  ⏭️ Existing: '{$planEnterprise->title}' found. (No changes made)");
            $existingCount++;
        }

        // Summary Footer
        $this->command->line("\n  Summary of Plan Seeding:");
        $this->command->info("✅ Successfully created {$createdCount} new plan(s).");
        if ($existingCount > 0) {
            $this->command->line("⚠️ Found {$existingCount} existing plan(s).");
        }
        $this->command->info("✨ Plan seeding finished.");
    }
}