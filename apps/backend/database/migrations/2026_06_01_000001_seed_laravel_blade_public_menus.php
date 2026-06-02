<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('menus') || ! Schema::hasTable('menu_items')) {
            return;
        }

        $scope = Config::get('content.blade_scope', 'laravel_blade');
        $now = now();
        $hasModuleColumn = Schema::hasColumn('menu_items', 'module');

        $menus = [
            'main_header'     => ['title' => 'Main Header', 'items' => [
                ['Home', '/', null],
                ['Properties', '/properties', 'properties'],
                ['Autos', '/autos', 'autos'],
                ['Products', '/products', 'products'],
                ['Services', '/services', 'services'],
                ['Jobs', '/jobs', 'jobs'],
                ['Events', '/events', 'events'],
                ['Classifieds', '/classifieds', 'classifieds'],
                ['Blog', '/blogs', 'blogs'],
            ]],
            'footer_column_1' => ['title' => 'Explore', 'items' => [
                ['Properties', '/properties', 'properties'],
                ['Autos', '/autos', 'autos'],
                ['Products', '/products', 'products'],
                ['Services', '/services', 'services'],
            ]],
            'footer_column_2' => ['title' => 'More', 'items' => [
                ['Jobs', '/jobs', 'jobs'],
                ['Events', '/events', 'events'],
                ['Classifieds', '/classifieds', 'classifieds'],
                ['Blog', '/blogs', 'blogs'],
            ]],
            'footer_column_3' => ['title' => 'Company', 'items' => [
                ['About', '/about', null],
                ['Contact', '/contact', null],
            ]],
            'footer_column_4' => ['title' => 'Support', 'items' => [
                ['Help Center', '/support', null],
                ['Terms', '/terms', null],
                ['Privacy', '/privacy', null],
            ]],
            'social_footer'   => ['title' => 'Social Footer', 'items' => [
                ['Instagram', '#', null],
                ['LinkedIn', '#', null],
                ['X', '#', null],
            ]],
        ];

        foreach ($menus as $locationKey => $menuData) {
            $menu = DB::table('menus')
                ->where('theme_key', $scope)
                ->where('location_key', $locationKey)
                ->first();

            if ($menu) {
                DB::table('menus')
                    ->where('id', $menu->id)
                    ->update([
                        'title' => $menuData['title'],
                        'status' => 'active',
                        'is_system' => true,
                        'updated_at' => $now,
                    ]);
            } else {
                $menuId = DB::table('menus')->insertGetId([
                    'theme_key' => $scope,
                    'location_key' => $locationKey,
                    'title' => $menuData['title'],
                    'status' => 'active',
                    'is_system' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $menu = (object) ['id' => $menuId];
            }

            if (! $menu || DB::table('menu_items')->where('menu_id', $menu->id)->exists()) {
                continue;
            }

            foreach ($menuData['items'] as $index => [$title, $url, $module]) {
                $item = [
                    'menu_id' => $menu->id,
                    'parent_id' => null,
                    'title' => $title,
                    'url' => $url,
                    'order' => $index + 1,
                    'status' => 'active',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if ($hasModuleColumn) {
                    $item['module'] = $module;
                }

                DB::table('menu_items')->insert($item);
            }
        }
    }

    public function down(): void
    {
        // Intentionally preserve menu records because admins may edit them after seeding.
    }
};
