<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\Payment\PaymentGatewaysSeeder;
use Illuminate\Support\Facades\Schema;

/**
 * Class DatabaseSeeder
 *
 * Orchestrates the execution of all seeders, including the newly added Blog module,
 * ensuring all foreign key dependencies are satisfied.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        // Disable foreign key constraints to allow truncating tables
        Schema::disableForeignKeyConstraints();

        // 1. Header
        $this->command->newLine();
        $this->command->info('🚀 Starting **Master Database Seeder** Orchestration...');
        $this->command->line('This process will execute seeders in a dependency-ordered sequence.');
        $this->command->newLine();

        // --- SECTION 1: FOUNDATION ---
        $this->command->line('================================================================');
        $this->command->info('🛠️ **[1/5] Executing BASE TABLES & FOUNDATION DATA**');
        $this->command->line('================================================================');
        $this->command->newLine();

        $this->call([
            UserSeeder::class,
            SettingSeeder::class,
            PageSeeder::class,
            ThemeSeeder::class,
            LocationSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            TypeSeeder::class,
            PaymentGatewaysSeeder::class,
            AdvertisementSeeder::class,
        ]);
        
        // --- SECTION 2: LOOKUPS ---
        $this->command->newLine();
        $this->command->line('================================================================');
        $this->command->info('🔍 **[2/5] Executing LOOKUP TABLES** (Amenities, Features)');
        $this->command->line('================================================================');
        $this->command->newLine();

        $this->call([
            AmenitySeeder::class,
            FeatureSeeder::class, 
        ]);
        
        // --- SECTION 3: CORE & OPTIONAL MODULES ---
        $this->command->newLine();
        $this->command->line('================================================================');
        $this->command->info('📦 **[3/5] Executing MAIN MODULE TABLES**');
        $this->command->line('================================================================');
        $this->command->newLine();

        // Core Modules (Always Seeded)
        $this->call([
            BlogSeeder::class,
        ]);

        // Optional Marketplace Modules
        if ($this->isModuleEnabled('properties'))  {
            $this->call([
                PropertySeeder::class,
                PropertyModuleSeeder::class,
                SeasonalPriceSeeder::class,
                TransactionLineSeeder::class,
            ]);
        }
        
        if ($this->isModuleEnabled('products')) {
            $this->call([
                ProductSeeder::class,
                ProductModuleSeeder::class,
            ]);
        }

        if ($this->isModuleEnabled('autos'))       $this->call(AutoSeeder::class);
        if ($this->isModuleEnabled('events'))      $this->call(EventSeeder::class);
        if ($this->isModuleEnabled('jobs'))        $this->call(JobSeeder::class);
        
        if ($this->isModuleEnabled('services')) {
            $this->call([
                ServiceSeeder::class,
                ServicePackageSeeder::class,
                ServiceAppointmentSeeder::class,
            ]);
        }
        
        if ($this->isModuleEnabled('classifieds')) $this->call(ClassifiedAdSeeder::class);
        
        // --- SECTION 4: DETAILED DATA ---
        $this->command->newLine();
        $this->command->line('================================================================');
        $this->command->info('📑 **[4/5] Executing DETAILED MODULE DATA**');
        $this->command->line('================================================================');
        $this->command->newLine();

        // Base/Shared Detailed Data
        $this->call([
            PlanSeeder::class,
            SubscriptionSeeder::class,
            TicketSeeder::class,
        ]);
        
        // --- SECTION 5: RELATIONS & SYSTEM ---
        $this->command->newLine();
        $this->command->line('================================================================');
        $this->command->info('🔗 **[5/5] Executing FINAL & RELATIONAL TABLES**');
        $this->command->line('================================================================');
        $this->command->newLine();

        $this->call([
            TagSeeder::class,
            FavoriteSeeder::class,
            RelationSeeder::class,
            RolesAndPermissionsSeeder::class,
            MessageSeeder::class,
            NewsletterSubscriberSeeder::class,
            EmailTemplateSeeder::class,
            PaymentSeeder::class,
            WalletSeeder::class,
            WithdrawalSeeder::class,
            NotificationSeeder::class,
            MenuSeeder::class,
            MenuItemSeeder::class,
            ActivityLogSeeder::class,
            MediaFullSeeder::class,
        ]);
        
        // Final Footer
        $this->command->newLine();
        $this->command->info('🎉 **MASTER SEEDING COMPLETE!** Setup finished.');
        $this->command->newLine();

        // Re-enable foreign key constraints
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Check if a specific module is enabled in the settings table.
     *
     * @param string $module
     * @return bool
     */
    private function isModuleEnabled(string $module): bool
    {
        return \Illuminate\Support\Facades\DB::table('settings')
            ->where('key', 'is_section.' . $module)
            ->where('value', '1')
            ->exists();
    }
}