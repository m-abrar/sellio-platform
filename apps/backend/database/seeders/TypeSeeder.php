<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Seeds the 'types' table with default, critical listing types
 * required for various modules including the Shop (is_product).
 */
class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('🏷️ Starting Type Seeder...');
        }

        $types = [
            // --- PROPERTY TYPES ---
            [
                'title' => 'Luxury',
                'icon' => 'fas fa-gem',
                'is_property' => true,
                'is_auto' => true,
            ],
            [
                'title' => 'Duplex',
                'icon' => 'fas fa-house-user',
                'is_property' => true,
            ],
            [
                'title' => 'Triplex',
                'icon' => 'fas fa-building',
                'is_property' => true,
            ],
            [
                'title' => 'Apartment/Flat',
                'icon' => 'fas fa-city',
                'is_property' => true,
            ],
            [
                'title' => 'Single-Family Home',
                'icon' => 'fas fa-home',
                'is_property' => true,
            ],

            // --- EVENT TYPES ---
            [
                'title' => 'In Person',
                'icon' => 'fas fa-handshake',
                'is_event' => true,
            ],
            [
                'title' => 'Virtual/Webinar',
                'icon' => 'fas fa-chalkboard-teacher',
                'is_event' => true,
            ],
            [
                'title' => 'Conference/Expo',
                'icon' => 'fas fa-users',
                'is_event' => true,
            ],

            // --- JOB TYPES ---
            [
                'title' => 'Full-Time',
                'icon' => 'fas fa-briefcase',
                'is_job' => true,
            ],
            [
                'title' => 'Part-Time',
                'icon' => 'fas fa-clock',
                'is_job' => true,
            ],
            [
                'title' => 'Internship',
                'icon' => 'fas fa-graduation-cap',
                'is_job' => true,
            ],
            [
                'title' => 'Contract',
                'icon' => 'fas fa-file-signature',
                'is_job' => true,
            ],

            // --- AUTO TYPES ---
            [
                'title' => 'Electric (EV)',
                'icon' => 'fas fa-bolt',
                'is_auto' => true,
            ],
            [
                'title' => 'Plug-in Hybrid (PHEV)',
                'icon' => 'fas fa-plug',
                'is_auto' => true,
            ],
            [
                'title' => 'Classic / Vintage',
                'icon' => 'fas fa-certificate',
                'is_auto' => true,
            ],

            // --- SERVICE TYPES ---
            [
                'title' => 'Freelancer',
                'icon' => 'fas fa-laptop-code',
                'is_service' => true,
            ],
            [
                'title' => 'Trade Service',
                'icon' => 'fas fa-tools',
                'is_service' => true,
            ],

            // --- CLASSIFIEDS TYPES ---
            [
                'title' => 'For Sale',
                'icon' => 'fas fa-tag',
                'is_classified' => true,
            ],
            [
                'title' => 'Trade/Exchange',
                'icon' => 'fas fa-sync-alt',
                'is_classified' => true,
            ],

            // --- PRODUCT / SHOP TYPES (New) ---
            [
                'title' => 'Brand New',
                'icon' => 'fas fa-box',
                'is_product' => true,
            ],
            [
                'title' => 'Refurbished',
                'icon' => 'fas fa-recycle',
                'is_product' => true,
            ],
            [
                'title' => 'Handmade',
                'icon' => 'fas fa-hand-holding-heart',
                'is_product' => true,
            ],
            [
                'title' => 'Digital Download',
                'icon' => 'fas fa-download',
                'is_product' => true,
            ],

            // --- BLOG TYPES (New) ---
            [
                'title' => 'Article',
                'icon' => 'fas fa-file-alt',
                'is_blog' => true,
            ],
            [
                'title' => 'Video Post',
                'icon' => 'fas fa-play-circle',
                'is_blog' => true,
            ],
            [
                'title' => 'Infographic',
                'icon' => 'fas fa-chart-pie',
                'is_blog' => true,
            ],
            [
                'title' => 'Case Study',
                'icon' => 'fas fa-microscope',
                'is_blog' => true,
            ],

            // --- UNIVERSAL FALLBACK TYPE ---
            [
                'title' => 'Other',
                'icon' => 'fas fa-ellipsis-h',
                'is_property' => true,
                'is_event' => true,
                'is_job' => true,
                'is_auto' => true,
                'is_service' => true,
                'is_classified' => true,
                'is_product' => true,
                'is_blog' => true,
            ],
        ];

        $count = 0;
        foreach ($types as $type) {
            $inserted = DB::table('types')->insertOrIgnore([
                'title' => $type['title'],
                'slug' => Str::slug($type['title']),
                'icon' => $type['icon'],

                // Module Flags
                'is_property' => $type['is_property'] ?? false,
                'is_event' => $type['is_event'] ?? false,
                'is_job' => $type['is_job'] ?? false,
                'is_auto' => $type['is_auto'] ?? false,
                'is_service' => $type['is_service'] ?? false,
                'is_classified' => $type['is_classified'] ?? false,
                'is_product' => $type['is_product'] ?? false,
                'is_blog' => $type['is_blog'] ?? false,

                'is_published' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($inserted) {
                $count++;
            }
        }

        if ($this->command) {
            $this->command->info("   Inserted/Updated {$count} listing types.");
            $this->command->info('--- 🏁 Type Seeding Complete ---');
        }
    }
}