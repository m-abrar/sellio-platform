<?php

namespace Database\Seeders;

use Database\Seeders\Concerns\SeedsBrandAssets;
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
    use SeedsBrandAssets;
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
            // --- Core Site Identity & Configuration (Group: general) ---
            ['group' => 'general', 'key' => 'site_name', 'value' => 'Sellio'],
            ['group' => 'general', 'key' => 'site_tagline', 'value' => 'Premium Multi-Vendor Marketplace Platform'],
            ['group' => 'general', 'key' => 'default_language', 'value' => 'en'],
            ['group' => 'general', 'key' => 'timezone', 'value' => 'UTC'],
            ['group' => 'general', 'key' => 'frontend_edit', 'value' => '1'],
            
            // --- External Application URLs (Group: general) ---
            // Left blank on install — admin must enter and verify real production URLs.
            ['group' => 'general', 'key' => 'url_frontend', 'value' => env('STOREFRONT_URL') ?: ''],
            ['group' => 'general', 'key' => 'url_admin', 'value' => env('ADMIN_APP_URL') ?: ''],
            ['group' => 'general', 'key' => 'url_partner', 'value' => env('SELLER_APP_URL') ?: ''],
            ['group' => 'general', 'key' => 'url_user', 'value' => env('BUYER_APP_URL') ?: ''],

            // --- Contact & API Keys (Group: contact / api) ---
            ['group' => 'contact', 'key' => 'email_contact', 'value' => 'support@sellio-platform.test'],
            ['group' => 'contact', 'key' => 'phone_contact', 'value' => '+1 (555) 000-0000'],
            ['group' => 'api', 'key' => 'google_map_api_key', 'value' => null],

            // --- Theme Specific Settings (Group: theme) ---
            ['group' => 'theme', 'key' => 'theme_property', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'theme_auto', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'theme_event', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'theme_job', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'theme_service', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'theme_classified', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'theme_blog', 'value' => 'default'],
            ['group' => 'theme', 'key' => 'active_theme', 'value' => 'unifieds_default'],

            // --- Content, Layout & SEO Defaults (Group: content / seo / commerce) ---
            ['group' => 'content', 'key' => 'site_search_results', 'value' => '1'],
            ['group' => 'content', 'key' => 'site_terms', 'value' => '1'],
            ['group' => 'content', 'key' => 'site_privacy', 'value' => '1'],
            ['group' => 'content', 'key' => 'site_logo', 'value' => 'settings/logo.png'],
            ['group' => 'content', 'key' => 'site_favicon', 'value' => 'settings/favicon.ico'],
            ['group' => 'commerce', 'key' => 'currency_code', 'value' => 'USD'],
            ['group' => 'commerce', 'key' => 'currency_symbol', 'value' => '$'],
            ['group' => 'seo', 'key' => 'meta_title', 'value' => 'Sellio - Ultimate Multi-Vertical Marketplace'],
            ['group' => 'seo', 'key' => 'meta_description', 'value' => 'Sellio is a highly scalable, multi-vertical marketplace solution for real estate, automotive, jobs, services, and more.'],
            
            // --- Social Links (Group: social) ---
            ['group' => 'social', 'key' => 'facebook_url', 'value' => 'https://facebook.com/sellio'],
            ['group' => 'social', 'key' => 'twitter_url', 'value' => 'https://x.com/sellio'],
            ['group' => 'social', 'key' => 'instagram_url', 'value' => 'https://instagram.com/sellio'],
            ['group' => 'social', 'key' => 'linkedin_url', 'value' => null],
            ['group' => 'social', 'key' => 'youtube_url', 'value' => null],

            // --- Custom Code Injection / Analytics (Group: scripts) ---
            ['group' => 'scripts', 'key' => 'google_analytics', 'value' => null],
            ['group' => 'scripts', 'key' => 'custom_head_code', 'value' => null],
            ['group' => 'scripts', 'key' => 'custom_footer_code', 'value' => null],

            // --- Homepage Configuration (Group: theme) ---
            ['group' => 'theme', 'key' => 'site_home', 'value' => 'unifieds_default'],

            // --- Module Activation Flags (Group: general) ---
            ['group' => 'general', 'key' => 'is_section.properties', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.autos', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.events', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.jobs', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.services', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.classifieds', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.products', 'value' => '1'],
            ['group' => 'general', 'key' => 'is_section.blog', 'value' => '1'],
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

        $this->seedBrandAssetsFromSeederImages();
        
        $this->command->info('✅ Setting seeding complete! Default configurations applied.');
    }
}