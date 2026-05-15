<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Theme;

/**
 * Class ThemeSeeder
 *
 * Registers all available frontend themes based on the landing-pages-map.html.
 */
class ThemeSeeder extends Seeder
{
    public function run(): void
    {
        // Clear all existing themes
        Theme::query()->delete();

        $themeGroups = [
            'Unified' => [
                'vertical' => null,
                'themes' => [
                    'default' => 'Universal Default',
                    'standard' => 'Universal Standard',
                    'classic' => 'Universal Classic',
                    'modern' => 'Universal Modern',
                    'mega' => 'Universal Mega',
                    'interactive' => 'Universal Interactive',
                    'minimal' => 'Universal Minimal',
                    'marketplace' => 'Universal Marketplace',
                ]
            ],
            'Properties' => [
                'vertical' => 'properties',
                'themes' => [
                    'classic' => 'Properties Classic',
                    'modern' => 'Properties Modern',
                    'luxury' => 'Properties Luxury',
                    'luxury_2' => 'Properties Luxury 2',
                    'urban' => 'Properties Urban',
                    'rental' => 'Properties Rental / Vacation',
                    'vacation' => 'Properties Vacation',
                    'map' => 'Properties Map View',
                    'unified' => 'Properties Unified / All-in-One',
                    'commercial' => 'Properties Commercial Real Estate',
                    'showcase' => 'Single Property Showcase',
                    'neighborhood' => 'Neighborhood Focused',
                    'investment' => 'Investment / ROI Focused',
                ]
            ],
            'Events' => [
                'vertical' => 'events',
                'themes' => [
                    'classic' => 'Events Classic',
                    'creative' => 'Events Creative',
                    'corporate' => 'Events Corporate',
                    'music' => 'Events Music / Concert',
                    'festival' => 'Events Festival / Outdoor',
                ]
            ],
            'Autos' => [
                'vertical' => 'autos',
                'themes' => [
                    'classic' => 'Autos Classic / Dealer',
                    'modern' => 'Autos Modern / Showcase',
                    'used' => 'Autos Used / Marketplace',
                    'luxury' => 'Autos Luxury / Premium',
                    'electric' => 'Autos Electric / Green Cars',
                ]
            ],
            'Services' => [
                'vertical' => 'services',
                'themes' => [
                    'corporate' => 'Services Corporate / Agency',
                    'marketplace' => 'Services Marketplace / Freelance',
                    'creative' => 'Services Creative / Studio',
                    'local' => 'Services Home / Local',
                    'health' => 'Services Health & Wellness',
                ]
            ],
            'Jobs' => [
                'vertical' => 'jobs',
                'themes' => [
                    'corporate' => 'Jobs Corporate / Professional',
                    'startup' => 'Jobs Startup / Modern',
                    'tech' => 'Jobs Tech / IT',
                    'blue_collar' => 'Jobs Blue-Collar / Local',
                    'freelance' => 'Jobs Freelance / Gig Economy',
                ]
            ],
            'Classifieds' => [
                'vertical' => 'classifieds',
                'themes' => [
                    'general' => 'Classifieds General / Marketplace',
                    'modern' => 'Classifieds Modern / Card Style',
                    'local' => 'Classifieds Local / Community',
                    'deals' => 'Classifieds Deals / Bargain',
                    'premium' => 'Classifieds Premium',
                ]
            ],
            'Ecommerce' => [
                'vertical' => 'ecommerce',
                'themes' => [
                    'default' => 'Ecommerce Standard',
                    'luxury' => 'Ecommerce Luxury',
                    'fashion' => 'Ecommerce Fashion',
                    'electronics' => 'Ecommerce Electronics',
                ]
            ]
        ];

        $order = 10;
        foreach ($themeGroups as $groupName => $group) {
            $vertical = $group['vertical'];
            $prefix = ($groupName === 'Unified') ? 'unifieds' : strtolower($groupName);
            
            foreach ($group['themes'] as $key => $title) {
                $themeKey = "{$prefix}_{$key}";
                
                Theme::create([
                    'theme_key' => $themeKey,
                    'vertical' => $vertical,
                    'title' => $title,
                    'order' => $order,
                    'is_active' => ($themeKey === 'unifieds_default'),
                    'variables' => $this->getDefaultVariables($themeKey),
                    'config' => null,
                ]);
                
                $order += 10;
            }
        }
    }

    private function getDefaultVariables(string $themeKey): array
    {
        // Default color palette
        $defaults = [
            "--color-primary" => "#1e4d4e",
            "--color-secondary" => "#f4f2ed",
            "--color-accent" => "#d4af37",
            "--color-text" => "#333333",
            "--font-family-heading" => "'Playfair Display', serif",
            "--font-family-base" => "'Inter', sans-serif",
            "--border-radius" => "8px"
        ];

        // Custom overrides for specific themes if needed
        if (str_contains($themeKey, 'modern')) {
            $defaults["--color-primary"] = "#1e88e5";
            $defaults["--border-radius"] = "12px";
            $defaults["--font-family-heading"] = "'Outfit', sans-serif";
        }

        if (str_contains($themeKey, 'luxury')) {
            $defaults["--color-primary"] = "#1a1a1a";
            $defaults["--color-accent"] = "#c5a059";
            $defaults["--font-family-heading"] = "'Playfair Display', serif";
        }

        return $defaults;
    }
}
