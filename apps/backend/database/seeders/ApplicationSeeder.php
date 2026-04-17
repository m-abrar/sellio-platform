<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Application;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // Clear all existing applications per instructions
        Application::query()->delete();

        $apps = [
            // ==========================================
            // UNIFIED SERIES
            // ==========================================
            [
                'app_key' => 'unifieds_default',
                'vertical' => null,
                'title' => 'Unified Default',
                'order' => 10,
                'is_active' => true,
                'variables' => ["--color-primary" => "#1e4d4e", "--color-secondary" => "#f4f2ed", "--color-text" => "#333333", "--color-light-gray" => "#e9ecef", "--font-family-heading" => "'Playfair Display', serif", "--font-family-base" => "'Lora', serif", "--shadow-card" => "0 4px 8px rgba(0, 0, 0, 0.08)", "--shadow-hover" => "0 8px 16px rgba(0, 0, 0, 0.15)"],
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_modern',
                'vertical' => null,
                'title' => 'Unified Modern',
                'order' => 20,
                'is_active' => false,
                'variables' => ["--primary-color" => "#1e88e5", "--secondary-color" => "#3949ab", "--accent-color" => "#ff7043", "--background-color" => "#f8f9fa", "--text-color" => "#212529", "--font-family-base" => "Roboto, sans-serif", "--font-family-heading" => "Montserrat, sans-serif", "--border-radius" => "0.375rem", "--btn-radius" => "0.375rem", "--container-width" => "1140px", "--card-shadow" => "0 1px 3px rgba(0,0,0,0.1)"],
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_classic',
                'vertical' => null,
                'title' => 'Unified Classic',
                'order' => 30,
                'is_active' => false,
                'variables' => ["--primary-color" => "#0d6efd", "--secondary-color" => "#343a40", "--accent-color" => "#17a2b8", "--font-family-base" => "Nunito, sans-serif", "--font-family-heading" => "Poppins, sans-serif", "--background-color" => "#121212", "--text-color" => "#f8f9fa"],
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_interactive',
                'vertical' => null,
                'title' => 'Unified Interactive',
                'order' => 40,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_minimal',
                'vertical' => null,
                'title' => 'Unified Minimal',
                'order' => 50,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_marketplace',
                'vertical' => null,
                'title' => 'Unified Marketplace',
                'order' => 60,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_mega',
                'vertical' => null,
                'title' => 'Unified Mega',
                'order' => 60,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'unifieds_standard',
                'vertical' => null,
                'title' => 'Unified Standard',
                'order' => 60,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],

            // ==========================================
            // PROPERTIES SERIES
            // ==========================================
            [
                'app_key' => 'properties_default',
                'vertical' => 'properties',
                'title' => 'Properties Default',
                'order' => 65,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_classic',
                'vertical' => 'properties',
                'title' => 'Properties Classic',
                'order' => 70,
                'is_active' => false,
                'variables' => ["--color-primary" => "#1e4d4e", "--color-secondary" => "#f4f2ed", "--color-accent" => "#ff9800", "--color-background" => "#ffffff", "--color-text" => "#333333", "--color-text-light" => "#6c757d", "--font-family-base" => "'Lora', serif", "--font-family-heading" => "'Playfair Display', serif", "--radius-base" => "0.375rem", "--radius-button" => "0.375rem", "--layout-container-width" => "1140px", "--shadow-card" => "0 4px 8px rgba(0, 0, 0, 0.08)"],
                'config' => null,
            ],
            [
                'app_key' => 'properties_modern',
                'vertical' => 'properties',
                'title' => 'Properties Modern',
                'order' => 80,
                'is_active' => false,
                'variables' => ["--color-primary" => "#17a2b8", "--color-secondary" => "#007bff", "--color-accent" => "#ff9800", "--color-background" => "#ffffff", "--color-text" => "#212529", "--color-text-light" => "#6c757d", "--font-family-base" => "Inter, sans-serif", "--font-family-heading" => "Inter, sans-serif", "--radius-base" => "0.75rem", "--radius-button" => "0.375rem", "--layout-container-width" => "1140px", "--shadow-card" => "0 1px 3px rgba(0,0,0,0.1)"],
                'config' => null,
            ],
            [
                'app_key' => 'properties_luxury',
                'vertical' => 'properties',
                'title' => 'Properties Luxury',
                'order' => 90,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_deluxe',
                'vertical' => 'properties',
                'title' => 'Properties Deluxe',
                'order' => 100,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_urban',
                'vertical' => 'properties',
                'title' => 'Properties Urban',
                'order' => 110,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_rental',
                'vertical' => 'properties',
                'title' => 'Properties Rental / Vacation',
                'order' => 120,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_vacation',
                'vertical' => 'properties',
                'title' => 'Properties Vacation',
                'order' => 130,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_map',
                'vertical' => 'properties',
                'title' => 'Properties Map View',
                'order' => 140,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_unified',
                'vertical' => 'properties',
                'title' => 'Properties Unified / All-in-One',
                'order' => 150,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_commercial',
                'vertical' => 'properties',
                'title' => 'Properties Commercial Real Estate',
                'order' => 160,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_showcase',
                'vertical' => 'properties',
                'title' => 'Single Property Showcase',
                'order' => 170,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_neighborhood',
                'vertical' => 'properties',
                'title' => 'Neighborhood Focused',
                'order' => 180,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'properties_investment',
                'vertical' => 'properties',
                'title' => 'Investment / ROI Focused',
                'order' => 190,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],

            // ==========================================
            // EVENTS SERIES
            // ==========================================
            [
                'app_key' => 'events_default',
                'vertical' => 'events',
                'title' => 'Events Default',
                'order' => 195,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'events_classic',
                'vertical' => 'events',
                'title' => 'Events Classic',
                'order' => 200,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'events_creative',
                'vertical' => 'events',
                'title' => 'Events Creative',
                'order' => 210,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'events_corporate',
                'vertical' => 'events',
                'title' => 'Events Corporate',
                'order' => 220,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'events_music',
                'vertical' => 'events',
                'title' => 'Events Music / Concert',
                'order' => 230,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'events_festival',
                'vertical' => 'events',
                'title' => 'Events Festival / Outdoor',
                'order' => 240,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],

            // ==========================================
            // AUTOS SERIES
            // ==========================================
            [
                'app_key' => 'autos_default',
                'vertical' => 'autos',
                'title' => 'Autos Default',
                'order' => 245,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'autos_classic',
                'vertical' => 'autos',
                'title' => 'Autos Classic / Dealer',
                'order' => 250,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'autos_modern',
                'vertical' => 'autos',
                'title' => 'Autos Modern / Showcase',
                'order' => 260,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'autos_used',
                'vertical' => 'autos',
                'title' => 'Autos Used / Marketplace',
                'order' => 270,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'autos_luxury',
                'vertical' => 'autos',
                'title' => 'Autos Luxury / Premium',
                'order' => 280,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'autos_electric',
                'vertical' => 'autos',
                'title' => 'Autos Electric / Green Cars',
                'order' => 290,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],

            // ==========================================
            // SERVICES SERIES
            // ==========================================
            [
                'app_key' => 'services_default',
                'vertical' => 'services',
                'title' => 'Services Default',
                'order' => 295,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'services_corporate',
                'vertical' => 'services',
                'title' => 'Services Corporate / Agency',
                'order' => 300,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'services_marketplace',
                'vertical' => 'services',
                'title' => 'Services Marketplace / Freelance',
                'order' => 310,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'services_creative',
                'vertical' => 'services',
                'title' => 'Services Creative / Studio',
                'order' => 320,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'services_local',
                'vertical' => 'services',
                'title' => 'Services Home / Local',
                'order' => 330,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'services_health',
                'vertical' => 'services',
                'title' => 'Services Health & Wellness',
                'order' => 340,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],

            // ==========================================
            // JOBS SERIES
            // ==========================================
            [
                'app_key' => 'jobs_default',
                'vertical' => 'jobs',
                'title' => 'Jobs Default',
                'order' => 345,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'jobs_corporate',
                'vertical' => 'jobs',
                'title' => 'Jobs Corporate / Professional',
                'order' => 350,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'jobs_startup',
                'vertical' => 'jobs',
                'title' => 'Jobs Startup / Modern',
                'order' => 360,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'jobs_tech',
                'vertical' => 'jobs',
                'title' => 'Jobs Tech / IT',
                'order' => 370,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'jobs_blue_collar',
                'vertical' => 'jobs',
                'title' => 'Jobs Blue-Collar / Local',
                'order' => 380,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'jobs_freelance',
                'vertical' => 'jobs',
                'title' => 'Jobs Freelance / Gig Economy',
                'order' => 390,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],

            // ==========================================
            // CLASSIFIEDS SERIES
            // ==========================================
            [
                'app_key' => 'classifieds_default',
                'vertical' => 'classifieds',
                'title' => 'Classifieds Default',
                'order' => 395,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'classifieds_general',
                'vertical' => 'classifieds',
                'title' => 'Classifieds General / Marketplace',
                'order' => 400,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'classifieds_modern',
                'vertical' => 'classifieds',
                'title' => 'Classifieds Modern / Card Style',
                'order' => 410,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'classifieds_local',
                'vertical' => 'classifieds',
                'title' => 'Classifieds Local / Community',
                'order' => 420,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'classifieds_deals',
                'vertical' => 'classifieds',
                'title' => 'Classifieds Deals / Bargain',
                'order' => 430,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ],
            [
                'app_key' => 'classifieds_premium',
                'vertical' => 'classifieds',
                'title' => 'Classifieds Premium',
                'order' => 440,
                'is_active' => false,
                'variables' => null,
                'config' => null,
            ]
        ];

        foreach ($apps as $app) {
            Application::updateOrCreate(
                ['app_key' => $app['app_key']],
                $app
            );
        }
    }
}
