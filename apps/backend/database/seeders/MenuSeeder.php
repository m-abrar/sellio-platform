<?php

namespace Database\Seeders;

use App\Models\Theme;
use Database\Seeders\Data\ThemeMenus\ThemeMenuRegistry;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Preparing to seed menus from theme registry...');

        $registry = ThemeMenuRegistry::all();
        $now = Carbon::now()->toDateTimeString();
        $menus = [];

        foreach (Theme::orderBy('order')->get() as $theme) {
            $themeMenus = $registry[$theme->theme_key] ?? [];

            if ($themeMenus === []) {
                $this->command->warn("No registry menus for {$theme->theme_key}");

                continue;
            }

            foreach ($themeMenus as $menuDef) {
                $locationKey = $menuDef['location_key'];

                $menus[] = [
                    'theme_key'    => $theme->theme_key,
                    'location_key' => $locationKey,
                    'title'        => $menuDef['title'],
                    'status'       => 'active',
                    'admin_note'   => "Navigation slot for {$theme->theme_key}.",
                    'is_system'    => $locationKey === 'main_header',
                    'created_at'   => $now,
                    'updated_at'   => $now,
                ];
            }
        }

        DB::table('menus')->upsert(
            $menus,
            ['theme_key', 'location_key'],
            ['title', 'status', 'admin_note', 'is_system', 'updated_at']
        );

        $this->cleanupStaleMenus($registry);

        $this->command->info('✅ Menu seeding complete for ' . Theme::count() . ' themes (' . count($menus) . ' slots).');
    }

    /**
     * @param  array<string, array<int, array{location_key: string, title: string, items: array<int, array<string, mixed>>}>>  $registry
     */
    protected function cleanupStaleMenus(array $registry): void
    {
        foreach (Theme::orderBy('order')->get() as $theme) {
            $allowed = ThemeMenuRegistry::locationKeysForTheme($theme->theme_key);

            if ($allowed === []) {
                continue;
            }

            DB::table('menus')
                ->where('theme_key', $theme->theme_key)
                ->whereNotIn('location_key', $allowed)
                ->delete();
        }
    }
}
