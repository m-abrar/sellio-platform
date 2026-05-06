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
        $planStarter = Plan::firstOrCreate(['title' => 'Starter Plan'], [
            'slug' => 'starter-plan',
            'description' => 'Perfect for a beginner.',
            'label_text' => 'Best Value',
            'price' => 9.99,
            'color' => '#1e4d4e',
            'billing_period' => 'monthly',
            
            'max_listings' => 3,
            'max_addons' => 5,
            'priority_support' => false,

            'max_featured_listings' => 1,
            'custom_branding' => false,
            'analytics_access' => 'basic',
            'listing_duration' => 30,
            'status' => 'active',
            'admin_note' => 'Default system entry plan.',
            'is_premium' => false,
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
        $planPro = Plan::firstOrCreate(['title' => 'Pro Plan'], [
            'slug' => 'pro-plan',
            'description' => 'Full access for a professional portfolio.',
            'label_text' => 'Popular',
            'price' => 49.99,
            'color' => '#3949ab',
            'billing_period' => 'monthly',
            
            'max_listings' => 10,
            'max_addons' => 50,
            'priority_support' => true,

            'max_featured_listings' => 3,
            'custom_branding' => true,
            'analytics_access' => 'advanced',
            'listing_duration' => 90,
            'status' => 'active',
            'admin_note' => 'Most popular mid-tier plan.',
            'is_premium' => true,
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
        $planEnterprise = Plan::firstOrCreate(['title' => 'Enterprise Plan'], [
            'slug' => 'enterprise-plan',
            'description' => 'For large agencies with unlimited listings.',
            'label_text' => 'Elite',
            'price' => 199.99,
            'color' => '#ff7043',
            'billing_period' => 'annually',
            
            'max_listings' => 999,
            'max_addons' => 999,
            'priority_support' => true,

            'max_featured_listings' => 10,
            'custom_branding' => true,
            'analytics_access' => 'advanced',
            'listing_duration' => 365,
            'status' => 'active',
            'admin_note' => 'High-scale agency tier.',
            'is_premium' => true,
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