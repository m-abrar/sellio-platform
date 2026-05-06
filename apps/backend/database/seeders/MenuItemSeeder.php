<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds for the 'menu_items' table.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('Preparing to seed default menu items...');

        $now = Carbon::now()->toDateTimeString();

        // 1. Fetch the IDs of all necessary menus based on their unique location_key
        $menus = DB::table('menus')
            ->whereIn('location_key', ['main_header', 'company_footer', 'support_footer', 'resources_footer'])
            ->pluck('id', 'location_key')
            ->toArray();

        // Check if all required menus were found
        if (count($menus) !== 4) {
            $this->command->error('❌ One or more required menus were not found. Ensure MenuSeeder ran successfully.');
            return;
        }

        // 2. Define the menu items, referencing the menu IDs dynamically
        $baseMenuItems = [
            // --- Items for 'Main Header Menu' (menu_id: 1 in SQL dump) ---
            // Corresponds to location_key: main_header
            ['menu_id' => $menus['main_header'], 'title' => 'Properties', 'url' => '/properties', 'parent_id' => null, 'order' => 1, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            ['menu_id' => $menus['main_header'], 'title' => 'Autos', 'url' => '/autos', 'parent_id' => null, 'order' => 2, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            ['menu_id' => $menus['main_header'], 'title' => 'Events', 'url' => '/events', 'parent_id' => null, 'order' => 3, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            ['menu_id' => $menus['main_header'], 'title' => 'Jobs', 'url' => '/jobs', 'parent_id' => null, 'order' => 4, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            ['menu_id' => $menus['main_header'], 'title' => 'Services', 'url' => '/services', 'parent_id' => null, 'order' => 5, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            ['menu_id' => $menus['main_header'], 'title' => 'Classifieds', 'url' => '/classifieds', 'parent_id' => null, 'order' => 6, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            ['menu_id' => $menus['main_header'], 'title' => 'Shop', 'url' => '/products', 'parent_id' => null, 'order' => 7, 'status' => 'active', 'admin_note' => 'Main navigation link.'],
            
            // --- Items for 'Company' Menu (menu_id: 3 in SQL dump) ---
            // Corresponds to location_key: company_footer
            ['menu_id' => $menus['company_footer'], 'title' => 'About', 'url' => '#', 'parent_id' => null, 'order' => 1, 'status' => 'active', 'admin_note' => 'Footer link.'],
            ['menu_id' => $menus['company_footer'], 'title' => 'Careers', 'url' => '#', 'parent_id' => null, 'order' => 2, 'status' => 'active', 'admin_note' => 'Footer link.'],
            ['menu_id' => $menus['company_footer'], 'title' => 'Press', 'url' => '#', 'parent_id' => null, 'order' => 3, 'status' => 'active', 'admin_note' => 'Footer link.'],
            
            // --- Items for 'Support' Menu (menu_id: 4 in SQL dump) ---
            // Corresponds to location_key: support_footer
            ['menu_id' => $menus['support_footer'], 'title' => 'Documentation', 'url' => '#', 'parent_id' => null, 'order' => 1, 'status' => 'active', 'admin_note' => 'Footer link.'],
            ['menu_id' => $menus['support_footer'], 'title' => 'System Status', 'url' => '#', 'parent_id' => null, 'order' => 2, 'status' => 'active', 'admin_note' => 'Footer link.'],
            ['menu_id' => $menus['support_footer'], 'title' => 'Pricing', 'url' => '#', 'parent_id' => null, 'order' => 3, 'status' => 'active', 'admin_note' => 'Footer link.'],

            // --- Items for 'Resources' Menu (menu_id: 5 in SQL dump) ---
            // Corresponds to location_key: resources_footer
            ['menu_id' => $menus['resources_footer'], 'title' => 'Help Center', 'url' => '#', 'parent_id' => null, 'order' => 1, 'status' => 'active', 'admin_note' => 'Footer link.'],
            ['menu_id' => $menus['resources_footer'], 'title' => 'Contact Support', 'url' => '#', 'parent_id' => null, 'order' => 2, 'status' => 'active', 'admin_note' => 'Footer link.'],
            ['menu_id' => $menus['resources_footer'], 'title' => 'Terms of Service', 'url' => '#', 'parent_id' => null, 'order' => 3, 'status' => 'active', 'admin_note' => 'Footer link.'],
        ];

        // 3. Prepare data for insertion (adding timestamps)
        $menuItems = [];
        foreach ($baseMenuItems as $item) {
            $menuItems[] = array_merge($item, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command->info('Inserting ' . count($menuItems) . ' menu items...');

        // 4. Execute the database insertion
        DB::table('menu_items')->insertOrIgnore($menuItems);

        $this->command->info('✅ Menu Item seeding complete! All menu link data applied.');
    }
}