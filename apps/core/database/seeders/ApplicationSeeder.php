<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Application;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. eCommerce (Default)
        Application::updateOrCreate(['app_key' => 'ecommerce_basic'], [
            'title' => 'Sellio eCommerce',
            'vertical' => 'ecommerce',
            'is_active' => true,
            'order' => 1,
            'config' => [
                'features' => ['cart', 'checkout', 'wishlist'],
            ],
            'variables' => [
                'primary_color' => '#10b981', // Green
                'accent_color' => '#059669',
            ]
        ]);

        // 2. Real Estate
        Application::updateOrCreate(['app_key' => 'realestate_pro'], [
            'title' => 'Luxury Estates',
            'vertical' => 'real_estate',
            'is_active' => false,
            'order' => 2,
            'config' => [
                'features' => ['map_view', 'agent_contact', 'virtual_tours'],
            ],
            'variables' => [
                'primary_color' => '#3b82f6', // Blue
                'accent_color' => '#2563eb',
            ]
        ]);

        // 3. Vacation Rental
        Application::updateOrCreate(['app_key' => 'rental_vibe'], [
            'title' => 'Vacation Vibe',
            'vertical' => 'vacation_rental',
            'is_active' => false,
            'order' => 3,
            'config' => [
                'features' => ['booking_calendar', 'guest_reviews'],
            ],
            'variables' => [
                'primary_color' => '#f43f5e', // Rose
                'accent_color' => '#e11d48',
            ]
        ]);

        // 4. eCommerce-2 (Alternative Style)
        Application::updateOrCreate(['app_key' => 'ecommerce_dark'], [
            'title' => 'Dark Fashion eCommerce',
            'vertical' => 'ecommerce',
            'is_active' => false,
            'order' => 4,
            'config' => [
                'features' => ['dark_mode_only', 'newsletter_popup'],
            ],
            'variables' => [
                'primary_color' => '#111827', // Gray 900
                'accent_color' => '#6366f1', // Indigo
            ]
        ]);
    }
}
