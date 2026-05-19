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
                    'platinum' => 'Properties Platinum',
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
                    'modern' => 'Jobs Modern',
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
                    'elite' => 'Classifieds Elite',
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
        // Global Base Palette
        $defaults = [
            "--color-primary" => "#1e4d4e",
            "--color-secondary" => "#f4f2ed",
            "--color-accent" => "#d4af37",
            "--color-text" => "#333333",
            "--font-family-heading" => "'Inter', sans-serif",
            "--font-family-base" => "'Inter', sans-serif",
            "--border-radius" => "12px",
            "--shadow-premium" => "0 20px 40px rgba(0,0,0,0.1)",
            "--glass-blur" => "12px"
        ];

        // 1. Properties Vertical Overrides
        if (str_contains($themeKey, 'properties_')) {
            if (str_contains($themeKey, 'luxury')) {
                $defaults["--color-primary"] = "#1a1a1a";
                $defaults["--color-accent"] = "#c5a059";
                $defaults["--font-family-heading"] = "'Playfair Display', serif";
                $defaults["--glass-blur"] = "20px";
            } elseif (str_contains($themeKey, 'urban')) {
                $defaults["--color-primary"] = "#718096";
                $defaults["--color-accent"] = "#ed8936";
            } elseif (str_contains($themeKey, 'vacation')) {
                $defaults["--color-primary"] = "#3182ce";
                $defaults["--color-accent"] = "#f6e05e";
            }
        }

        // 2. Autos Vertical Overrides
        if (str_contains($themeKey, 'autos_')) {
            $defaults["--font-family-heading"] = "'Montserrat', sans-serif";
            if (str_contains($themeKey, 'electric')) {
                $defaults["--color-primary"] = "#0a0a0a";
                $defaults["--color-accent"] = "#00e5ff";
                $defaults["--font-family-heading"] = "'Orbitron', sans-serif";
            } elseif (str_contains($themeKey, 'classic')) {
                $defaults["--color-primary"] = "#d32f2f";
                $defaults["--color-accent"] = "#1a202c";
            } elseif (str_contains($themeKey, 'luxury')) {
                $defaults["--color-primary"] = "#000000";
                $defaults["--color-accent"] = "#ffffff";
            }
        }

        // 3. Jobs Vertical Overrides
        if (str_contains($themeKey, 'jobs_')) {
            if (str_contains($themeKey, 'tech')) {
                $defaults["--color-primary"] = "#2b6cb0";
                $defaults["--color-accent"] = "#00ff41";
            } elseif (str_contains($themeKey, 'blue_collar')) {
                $defaults["--color-primary"] = "#1a202c";
                $defaults["--color-accent"] = "#d69e2e";
            }
        }

        // 4. Events Vertical Overrides
        if (str_contains($themeKey, 'events_')) {
            $defaults["--font-family-heading"] = "'Montserrat', sans-serif";
            if (str_contains($themeKey, 'music')) {
                $defaults["--color-primary"] = "#000000";
                $defaults["--color-accent"] = "#ff0080";
            }
        }

        // 5. Modern Modifier Catch-all
        if (str_contains($themeKey, 'modern')) {
            if (!isset($defaults["--font-family-heading"])) {
                $defaults["--font-family-heading"] = "'Outfit', sans-serif";
            }
            $defaults["--border-radius"] = "24px";
        }

        return $defaults;
    }
}
