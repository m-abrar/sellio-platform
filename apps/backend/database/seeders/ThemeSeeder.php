<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon; // Import Carbon for generating consistent timestamps

/**
 * Seeds the 'themes' table with a comprehensive list of default design themes.
 *
 * These themes are categorized by the module they are intended for (e.g., 'unifieds', 'properties', 'events').
 * Each theme provides a starting set of CSS variables (stored as JSON) for immediate use in the frontend
 * styling system.
 */
class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Deletes the existing themes data and inserts a predefined array of themes
     * for various modules.
     *
     * @return void
     */
    public function run(): void
    {
        // Add console output for better seeder visibility
        if ($this->command) {
            $this->command->info('🎨 Starting Theme Seeder...');
        }

        // Clear existing theme data before adding new records to ensure idempotency.
        DB::table('themes')->delete();
        
        if ($this->command) {
            $this->command->line('  🗑️ Cleared existing themes data.');
        }

        // Define the themes data structure.
        // The 'variables' column holds a JSON string of CSS custom properties.
        $themes = [
            // =======================================================
            // UNIFIED / ALL-IN-ONE MODULES
            // =======================================================
            [
                'theme_key' => 'unifieds_default',
                'title' => 'Unified Default',
                'order' => 10, 
                'is_active' => 1, // Set the first theme as the active default
                'variables' => '{"--color-primary":"#1e4d4e","--color-secondary":"#f4f2ed","--color-text":"#333333","--color-light-gray":"#e9ecef","--font-family-heading":"\'Playfair Display\', serif","--font-family-base":"\'Lora\', serif","--shadow-card":"0 4px 8px rgba(0, 0, 0, 0.08)","--shadow-hover":"0 8px 16px rgba(0, 0, 0, 0.15)"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'unifieds_modern',
                'title' => 'Unified Modern',
                'order' => 20, 
                'is_active' => 0,
                // Example of a modern theme with different variable naming conventions
                'variables' => '{"--primary-color":"#1e88e5","--secondary-color":"#3949ab","--accent-color":"#ff7043","--background-color":"#f8f9fa","--text-color":"#212529","--font-family-base":"Roboto, sans-serif","--font-family-heading":"Montserrat, sans-serif","--border-radius":"0.375rem","--btn-radius":"0.375rem","--container-width":"1140px","--card-shadow":"0 1px 3px rgba(0,0,0,0.1)"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'unifieds_classic',
                'title' => 'Unified Classic',
                'order' => 30, 
                'is_active' => 0,
                // Example of a dark theme variation
                'variables' => '{"--primary-color":"#0d6efd","--secondary-color":"#343a40","--accent-color":"#17a2b8","--font-family-base":"Nunito, sans-serif","--font-family-heading":"Poppins, sans-serif","--background-color":"#121212","--text-color":"#f8f9fa"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Themes below this point use 'null' for variables, implying they rely on a minimal
            // core set of CSS variables and are added here as placeholders for future expansion.
            [
                'theme_key' => 'unifieds_interactive',
                'title' => 'Unified Interactive',
                'order' => 40, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'unifieds_minimal',
                'title' => 'Unified Minimal',
                'order' => 50, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'unifieds_marketplace',
                'title' => 'Unified Marketplace',
                'order' => 60, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            [
                'theme_key' => 'unifieds_mega',
                'title' => 'Unified Mega',
                'order' => 60, // Note: Order conflict with 'marketplace', which can be resolved if needed
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            [
                'theme_key' => 'unifieds_standard',
                'title' => 'Unified Standard',
                'order' => 60, // Note: Order conflict with 'marketplace' and 'mega'
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            // =======================================================
            // PROPERTIES / REAL ESTATE MODULES
            // =======================================================
            [
                'theme_key' => 'properties_default',
                'title' => 'Properties Default',
                'order' => 65, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_classic',
                'title' => 'Properties Classic',
                'order' => 70, 
                'is_active' => 0,
                'variables' => '{"--color-primary":"#1e4d4e","--color-secondary":"#f4f2ed","--color-accent":"#ff9800","--color-background":"#ffffff","--color-text":"#333333","--color-text-light":"#6c757d","--font-family-base":"\'Lora\', serif","--font-family-heading":"\'Playfair Display\', serif","--radius-base":"0.375rem","--radius-button":"0.375rem","--layout-container-width":"1140px","--shadow-card":"0 4px 8px rgba(0, 0, 0, 0.08)"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_modern',
                'title' => 'Properties Modern',
                'order' => 80, 
                'is_active' => 0,
                'variables' => '{"--color-primary":"#17a2b8","--color-secondary":"#007bff","--color-accent":"#ff9800","--color-background":"#ffffff","--color-text":"#212529","--color-text-light":"#6c757d","--font-family-base":"Inter, sans-serif","--font-family-heading":"Inter, sans-serif","--radius-base":"0.75rem","--radius-button":"0.375rem","--layout-container-width":"1140px","--shadow-card":"0 1px 3px rgba(0,0,0,0.1)"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_luxury',
                'title' => 'Properties Luxury',
                'order' => 90, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_deluxe',
                'title' => 'Properties Deluxe',
                'order' => 100, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_urban',
                'title' => 'Properties Urban',
                'order' => 110, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_rental',
                'title' => 'Properties Rental / Vacation',
                'order' => 120, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_vacation',
                'title' => 'Properties Vacation',
                'order' => 130, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_map',
                'title' => 'Properties Map View',
                'order' => 140, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_unified',
                'title' => 'Properties Unified / All-in-One',
                'order' => 150, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_commercial',
                'title' => 'Properties Commercial Real Estate',
                'order' => 160, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_showcase',
                'title' => 'Single Property Showcase',
                'order' => 170, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_neighborhood',
                'title' => 'Neighborhood Focused',
                'order' => 180, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'properties_investment',
                'title' => 'Investment / ROI Focused',
                'order' => 190, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            // =======================================================
            // EVENTS MODULES
            // =======================================================
            [
                'theme_key' => 'events_default',
                'title' => 'Events Default',
                'order' => 195, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'events_classic',
                'title' => 'Events Classic',
                'order' => 200, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'events_creative',
                'title' => 'Events Creative',
                'order' => 210, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'events_corporate',
                'title' => 'Events Corporate',
                'order' => 220, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'events_music',
                'title' => 'Events Music / Concert',
                'order' => 230, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'events_festival',
                'title' => 'Events Festival / Outdoor',
                'order' => 240, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            // =======================================================
            // AUTOS / VEHICLES MODULES
            // =======================================================
            [
                'theme_key' => 'autos_default',
                'title' => 'Autos Default',
                'order' => 245, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'autos_classic',
                'title' => 'Autos Classic / Dealer',
                'order' => 250, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'autos_modern',
                'title' => 'Autos Modern / Showcase',
                'order' => 260, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'autos_used',
                'title' => 'Autos Used / Marketplace',
                'order' => 270, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'autos_luxury',
                'title' => 'Autos Luxury / Premium',
                'order' => 280, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'autos_electric',
                'title' => 'Autos Electric / Green Cars',
                'order' => 290, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            // =======================================================
            // SERVICES MODULES
            // =======================================================
            [
                'theme_key' => 'services_default',
                'title' => 'Services Default',
                'order' => 295, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'services_corporate',
                'title' => 'Services Corporate / Agency',
                'order' => 300, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'services_marketplace',
                'title' => 'Services Marketplace / Freelance',
                'order' => 310, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'services_creative',
                'title' => 'Services Creative / Studio',
                'order' => 320, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'services_local',
                'title' => 'Services Home / Local',
                'order' => 330, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'services_health',
                'title' => 'Services Health & Wellness',
                'order' => 340, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            // =======================================================
            // JOBS MODULES
            // =======================================================
            [
                'theme_key' => 'jobs_default',
                'title' => 'Jobs Default',
                'order' => 345, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'jobs_corporate',
                'title' => 'Jobs Corporate / Professional',
                'order' => 350, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'jobs_startup',
                'title' => 'Jobs Startup / Modern',
                'order' => 360, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'jobs_tech',
                'title' => 'Jobs Tech / IT',
                'order' => 370, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'jobs_blue_collar',
                'title' => 'Jobs Blue-Collar / Local',
                'order' => 380, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'jobs_freelance',
                'title' => 'Jobs Freelance / Gig Economy',
                'order' => 390, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
            // =======================================================
            // CLASSIFIEDS MODULES
            // =======================================================
            [
                'theme_key' => 'classifieds_default',
                'title' => 'Classifieds Default',
                'order' => 395, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'classifieds_general',
                'title' => 'Classifieds General / Marketplace',
                'order' => 400, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'classifieds_modern',
                'title' => 'Classifieds Modern / Card Style',
                'order' => 410, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'classifieds_local',
                'title' => 'Classifieds Local / Community',
                'order' => 420, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'classifieds_deals',
                'title' => 'Classifieds Deals / Bargain',
                'order' => 430, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'theme_key' => 'classifieds_premium',
                'title' => 'Classifieds Premium',
                'order' => 440, 
                'is_active' => 0,
                'variables' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ];

        // Insert the entire array of theme data into the 'themes' table using the DB facade.
        DB::table('themes')->insert($themes);

        if ($this->command) {
            $count = count($themes);
            $this->command->info("  ✅ Successfully inserted {$count} default themes.");
            $this->command->info('--- 🏁 Theme Seeding Complete ---');
        }
    }
}