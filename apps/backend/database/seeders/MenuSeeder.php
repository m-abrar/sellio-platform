<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds for the 'menus' table.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('Preparing to seed default menus...');

        $now = Carbon::now()->toDateTimeString();

        // Data for the 'menus' table
        $baseMenus = [
            // Note: Removed the 'id' field as it is auto-incremented
            ['theme_key' => 'unifieds_default', 'location_key' => 'main_header', 'title' => 'Main Header Menu'],
            ['theme_key' => 'unifieds_default', 'location_key' => 'social_footer', 'title' => 'Social Footer Menu'],
            ['theme_key' => 'unifieds_default', 'location_key' => 'company_footer', 'title' => 'Company'],
            ['theme_key' => 'unifieds_default', 'location_key' => 'support_footer', 'title' => 'Support'],
            ['theme_key' => 'unifieds_default', 'location_key' => 'resources_footer', 'title' => 'Resources'],
            ['theme_key' => 'unifieds_default', 'location_key' => 'settings_footer', 'title' => 'Settings'],
        ];

        $menus = [];
        foreach ($baseMenus as $menu) {
            $menus[] = array_merge($menu, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->command->info('Inserting ' . count($menus) . ' menus...');

        // Use insertOrIgnore to prevent data duplication if run multiple times
        DB::table('menus')->insertOrIgnore($menus);

        $this->command->info('✅ Menu seeding complete!');
    }
}
