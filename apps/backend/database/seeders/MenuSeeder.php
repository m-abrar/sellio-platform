<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Services\MenuService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Preparing to seed menus for all themes...');

        $now = Carbon::now()->toDateTimeString();
        $menus = [];

        foreach (Theme::orderBy('order')->get() as $theme) {
            foreach (MenuService::MENU_LOCATIONS as $locationKey) {
                $menus[] = [
                    'theme_key'    => $theme->theme_key,
                    'location_key' => $locationKey,
                    'title'        => $this->locationTitle($locationKey),
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

        $this->command->info('✅ Menu seeding complete for ' . Theme::count() . ' themes.');
    }

    protected function locationTitle(string $locationKey): string
    {
        return match ($locationKey) {
            'main_header'      => 'Main Header Menu',
            'social_footer'    => 'Social Footer Menu',
            'company_footer'   => 'Company',
            'support_footer'   => 'Support',
            'resources_footer' => 'Resources',
            'settings_footer'  => 'Settings',
            default            => ucwords(str_replace('_', ' ', $locationKey)),
        };
    }
}
