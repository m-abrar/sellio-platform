<?php

namespace Database\Seeders;

use App\Models\Theme;
use Database\Seeders\Data\ThemeMenus\ThemeMenuRegistry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Preparing to seed menu items from theme registry...');

        $registry = ThemeMenuRegistry::all();
        $now = Carbon::now()->toDateTimeString();
        $rows = [];

        foreach (Theme::orderBy('order')->get() as $theme) {
            $themeMenus = $registry[$theme->theme_key] ?? [];

            if ($themeMenus === []) {
                continue;
            }

            $menuIds = DB::table('menus')
                ->where('theme_key', $theme->theme_key)
                ->pluck('id', 'location_key');

            foreach ($themeMenus as $menuDef) {
                $menuId = $menuIds[$menuDef['location_key']] ?? null;

                if ($menuId === null) {
                    $this->command->warn("Missing menu {$menuDef['location_key']} for {$theme->theme_key}");

                    continue;
                }

                foreach ($menuDef['items'] as $item) {
                    $rows[] = [
                        'menu_id'    => $menuId,
                        'title'      => $item['title'],
                        'url'        => $item['url'],
                        'module'     => $item['module'] ?? null,
                        'parent_id'  => null,
                        'order'      => $item['order'],
                        'status'     => 'active',
                        'admin_note' => 'Seeded navigation link.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        DB::table('menu_items')->delete();

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('menu_items')->insert($chunk);
        }

        $this->command->info('✅ Menu item seeding complete (' . count($rows) . ' links).');
    }
}
