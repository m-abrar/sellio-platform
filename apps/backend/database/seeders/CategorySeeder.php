<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class CategorySeeder
 *
 * Seeds the hierarchical category taxonomy across all marketplace modules
 * (Property, Auto, Event, Job, Service, Classified, Product, Blog) with
 * recursive parent-child nesting and module-specific flags.
 */
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $moduleCategories = [
            'is_property' => [
                'Residential' => ['fas fa-home', [
                    'Apartments' => 'fas fa-building-user',
                    'Houses' => 'fas fa-house',
                    'Villas' => 'fas fa-hotel',
                ]],
                'Commercial' => ['fas fa-building', [
                    'Offices' => 'fas fa-briefcase',
                    'Retail' => 'fas fa-store',
                ]],
                'Land' => ['fas fa-tree-city', []]
            ],
            'is_auto' => [
                'Cars' => ['fas fa-car', [
                    'SUV / Crossover' => 'fas fa-car-side',
                    'Sedan' => 'fas fa-car',
                ]],
                'Motorcycle' => ['fas fa-motorcycle', []],
            ],
            'is_event' => [
                'Entertainment' => ['fas fa-ticket', [
                    'Concert' => 'fas fa-microphone-alt',
                    'Festival' => 'fas fa-fire-burner',
                ]],
            ],
            'is_job' => [
                'Technology' => ['fas fa-laptop-code', [
                    'IT' => 'fas fa-code',
                ]]
            ],
            'is_service' => [
                'Maintenance' => ['fas fa-trowel-bricks', [
                    'Cleaning' => 'fas fa-soap',
                    'Repair' => 'fas fa-screwdriver-wrench',
                ]]
            ],
            'is_classified' => [
                'Electronics' => ['fas fa-mobile-alt', []],
                'Home & Garden' => ['fas fa-couch', []],
            ],
            'is_product' => [
                'General Store' => ['fas fa-cart-shopping', [
                    'Health & Beauty' => ['fas fa-heart-pulse', [
                        'Skincare' => 'fas fa-sparkles',
                        'Makeup' => 'fas fa-eye-dropper',
                        'Fragrance' => 'fas fa-wind',
                    ]],
                    'Toys & Hobbies' => ['fas fa-puzzle-piece', [
                        'Board Games' => 'fas fa-chess-board',
                        'Action Figures' => 'fas fa-robot',
                    ]],
                    'Groceries' => 'fas fa-basket-shopping',
                ]],
                'Parts' => ['fas fa-gears', [
                    'Automotive Parts' => 'fas fa-car-battery',
                ]]
            ],
            'is_blog' => [
                'Lifestyle' => ['fas fa-mug-hot', [
                    'Travel' => ['fas fa-plane-departure', [
                        'Solo Travel' => 'fas fa-user-plane',
                        'Luxury Travel' => 'fas fa-gem',
                    ]],
                    'News' => 'fas fa-newspaper',
                ]],
                'Work' => ['fas fa-briefcase', [
                    'Technology' => ['fas fa-microchip', [
                        'AI & ML' => 'fas fa-brain',
                        'Web Dev' => 'fas fa-code',
                    ]],
                ]]
            ],
        ];

        $this->command->line("🏗️ Seeding Hierarchical Categories...");

        foreach ($moduleCategories as $moduleFlag => $categories) {
            $this->seedRecursive($categories, $moduleFlag);
        }

        $this->command->info('✅ Category Seeding finished.');
    }

    /**
     * Recursive function to seed categories at any depth
     */
    private function seedRecursive(array $categories, string $moduleFlag, ?int $parentId = null): void
    {
        foreach ($categories as $title => $data) {
            // Determine Icon and Children
            // Case 1: Title => 'icon-string' (No children)
            // Case 2: Title => ['icon-string', [children]] (Has children)
            $icon = is_array($data) ? $data[0] : $data;
            $children = (is_array($data) && isset($data[1])) ? $data[1] : [];

            $id = DB::table('categories')->insertGetId(
                $this->prepareData($title, $icon, $moduleFlag, $parentId)
            );

            if (!empty($children)) {
                $this->seedRecursive($children, $moduleFlag, $id);
            }
        }
    }

    private function prepareData($title, $icon, $activeFlag, $parentId = null): array
    {
        $flags = [
            'is_property' => false, 'is_event' => false, 'is_job' => false, 
            'is_auto' => false, 'is_service' => false, 'is_classified' => false, 
            'is_product' => false, 'is_blog' => false,
        ];

        $flags[$activeFlag] = true;

        $colors = ['#1e4d4e', '#3949ab', '#ff7043', '#0891b2', '#059669', '#d4af37'];

        return array_merge([
            'parent_id'    => $parentId,
            'title'        => $title,
            'slug'         => Str::slug($title) . '-' . Str::random(5),
            'icon'         => $icon,
            'color'        => collect($colors)->random(),
            'description'  => "Category for " . str_replace('is_', '', $activeFlag) . ": $title",
            'status'       => 'active',
            'admin_note'   => 'System default category.',
            'is_premium'   => false,
            'is_published' => true,
            'created_at'   => now(),
            'updated_at'   => now(),
        ], $flags);
    }
}