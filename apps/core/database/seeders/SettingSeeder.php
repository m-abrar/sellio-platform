<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

/**
 * Class SettingSeeder
 *
 * Seeds the 'settings' table with initial, default configuration key-value pairs
 * for the application. This typically includes site metadata, contact details,
 * theming preferences, and API keys. These settings form the basis of the
 * application's global configuration panel.
 */
class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Inserts default application settings into the 'settings' table, using
     * `insertOrIgnore` to prevent overwriting existing custom settings if
     * the seeder is run after the initial setup. This preserves user configurations.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('Preparing to seed default settings into the database...');

        // Define the current timestamp dynamically, which will be injected into every record.
        $now = Carbon::now()->toDateTimeString();

        // Define the array of default settings *without* timestamps for cleaner data definition.
        $baseSettings = [
            // --- Core Site Identity & Configuration ---
            ['key' => 'site_name', 'value' => 'Sellio'],
            ['key' => 'site_tagline', 'value' => 'All in One Listing and Booking Management'],
            ['key' => 'default_language', 'value' => 'en'],
            ['key' => 'timezone', 'value' => 'UTC'],
            ['key' => 'frontend_edit', 'value' => '1'],
            
            // --- External Application URLs ---
            ['key' => 'url_frontend', 'value' => 'http://127.0.0.1:8000'],
            ['key' => 'url_admin', 'value' => 'http://127.0.0.1:8000/admin'],
            ['key' => 'url_partner', 'value' => 'http://127.0.0.1:8000/seller'],
            ['key' => 'url_user', 'value' => 'http://127.0.0.1:8000/buyer'],

            // --- Contact & API Keys ---
            ['key' => 'email_contact', 'value' => 'm.abrar.hassan@gmail.com'],
            ['key' => 'phone_contact', 'value' => '123456789'],
            ['key' => 'google_map_api_key', 'value' => null], // NULL for the initial value, must be configured by admin

            // --- Theme Specific Settings (Placeholder Defaults) ---
            ['key' => 'theme_unifieds', 'value' => 'default'],
            ['key' => 'theme_properties', 'value' => 'default'],
            ['key' => 'theme_autos', 'value' => 'default'],
            ['key' => 'theme_events', 'value' => 'default'],
            ['key' => 'theme_jobs', 'value' => 'default'],
            ['key' => 'theme_services', 'value' => 'default'],
            ['key' => 'theme_classifieds', 'value' => 'default'],
            ['key' => 'theme_blog', 'value' => 'default'],

            // --- Content, Layout & SEO Defaults ---
            ['key' => 'site_search_results', 'value' => '1'],
            ['key' => 'site_terms', 'value' => '1'], // ID reference to a static page/post for Terms
            ['key' => 'site_privacy', 'value' => '1'], // ID reference to a static page/post for Privacy Policy
            ['key' => 'site_logo', 'value' => 'settings/logo.png'],
            ['key' => 'site_favicon', 'value' => 'settings/favicon.ico'],
            ['key' => 'currency_code', 'value' => 'USD'],
            ['key' => 'currency_symbol', 'value' => '$'],
            ['key' => 'active_theme', 'value' => 'unifieds_default'],
            ['key' => 'meta_title', 'value' => null], // Placeholder for SEO title
            ['key' => 'meta_description', 'value' => null], // Placeholder for SEO description
            
            // --- Social Links ---
            ['key' => 'facebook_url', 'value' => 'https://facebook.com/#my_company_profile'],
            ['key' => 'twitter_url', 'value' => 'https://x.com/#my_company_profile'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com/#my_company_profile'],
            ['key' => 'linkedin_url', 'value' => null],
            ['key' => 'youtube_url', 'value' => null],

            // --- Custom Code Injection / Analytics ---
            ['key' => 'google_analytics', 'value' => null], // Placeholder for Google Analytics tracking ID
            ['key' => 'custom_head_code', 'value' => null], // Allows injecting custom code into the <head> tag
            ['key' => 'custom_footer_code', 'value' => null], // Allows injecting custom code before the closing </body> tag

            // --- Homepage Configuration ---
            ['key' => 'site_home', 'value' => 'unifieds_default'],
            // ['key' => 'site_home_type', 'value' => 'global'], // Controls whether the homepage is set globally or per-theme
            // ['key' => 'active_home', 'value' => 'home-one'], // Reference to the specific active home layout template
            // ['key' => 'default_homepage', 'value' => 'unifieds_default'], // The key defining the currently selected homepage template/theme
        ];

        $settings = [];

        // Loop through the base settings and inject the dynamic timestamps.
        foreach ($baseSettings as $setting) {
            $settings[] = array_merge($setting, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
        
        // Output the number of settings being processed.
        $this->command->info('Inserting ' . count($settings) . ' default settings...');

        // Execute the database insertion.
        DB::table('settings')->insertOrIgnore($settings);
        
        $this->command->info('✅ Setting seeding complete! Default configurations applied.');
    }
}