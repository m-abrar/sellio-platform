<?php

namespace Database\Seeders;

use App\Models\Theme;
use App\Services\MenuService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Preparing to seed menu items for all themes...');

        $now = Carbon::now()->toDateTimeString();
        $rows = [];

        foreach (Theme::orderBy('order')->get() as $theme) {
            $menuIds = DB::table('menus')
                ->where('theme_key', $theme->theme_key)
                ->pluck('id', 'location_key');

            if ($menuIds->isEmpty()) {
                continue;
            }

            foreach ($this->headerItemsForTheme($theme->theme_key) as $item) {
                $rows[] = [
                    'menu_id'    => $menuIds['main_header'],
                    'title'      => $item['title'],
                    'url'        => $item['url'],
                    'module'     => $item['module'],
                    'parent_id'  => null,
                    'order'      => $item['order'],
                    'status'     => 'active',
                    'admin_note' => 'Seeded navigation link.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            foreach ($this->footerItemsForLocation('company_footer') as $index => $item) {
                $rows[] = $this->footerRow($menuIds['company_footer'], $item, $index + 1, $now);
            }

            foreach ($this->footerItemsForLocation('support_footer') as $index => $item) {
                $rows[] = $this->footerRow($menuIds['support_footer'], $item, $index + 1, $now);
            }

            foreach ($this->footerItemsForLocation('resources_footer') as $index => $item) {
                $rows[] = $this->footerRow($menuIds['resources_footer'], $item, $index + 1, $now);
            }

            foreach ($this->footerItemsForLocation('social_footer') as $index => $item) {
                $rows[] = $this->footerRow($menuIds['social_footer'], $item, $index + 1, $now);
            }
        }

        DB::table('menu_items')->delete();

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('menu_items')->insert($chunk);
        }

        $this->command->info('✅ Menu item seeding complete (' . count($rows) . ' links).');
    }

    /**
     * @return array<int, array{title: string, url: string, order: int, module: ?string}>
     */
    protected function headerItemsForTheme(string $themeKey): array
    {
        if ($themeKey === 'properties_classic') {
            return [
                ['title' => 'COLLECTION', 'url' => '/explore', 'order' => 1, 'module' => 'properties'],
                ['title' => 'AGENTS', 'url' => '/explore', 'order' => 2, 'module' => 'properties'],
                ['title' => 'PROVENANCE', 'url' => '/explore', 'order' => 3, 'module' => 'properties'],
                ['title' => 'REGISTRY', 'url' => '/cart', 'order' => 4, 'module' => 'properties'],
            ];
        }

        if ($themeKey === 'unifieds_default') {
            return [
                ['title' => 'Registry', 'url' => '/', 'order' => 1, 'module' => null],
                ['title' => 'Features', 'url' => '/explore', 'order' => 2, 'module' => null],
                ['title' => 'Analytics', 'url' => '/explore', 'order' => 3, 'module' => null],
                ['title' => 'Enterprise', 'url' => '/explore', 'order' => 4, 'module' => null],
            ];
        }

        $vertical = $this->resolveVertical($themeKey);

        return match ($vertical) {
            'properties' => [
                ['title' => 'Explore', 'url' => '/explore', 'order' => 1, 'module' => 'properties'],
                ['title' => 'Cart', 'url' => '/cart', 'order' => 2, 'module' => 'properties'],
            ],
            'autos' => [
                ['title' => 'Inventory', 'url' => '/explore', 'order' => 1, 'module' => 'autos'],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => 'autos'],
            ],
            'events' => [
                ['title' => 'Events', 'url' => '/explore', 'order' => 1, 'module' => 'events'],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => 'events'],
            ],
            'jobs' => [
                ['title' => 'Jobs', 'url' => '/explore', 'order' => 1, 'module' => 'jobs'],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => 'jobs'],
            ],
            'services' => [
                ['title' => 'Services', 'url' => '/explore', 'order' => 1, 'module' => 'services'],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => 'services'],
            ],
            'classifieds' => [
                ['title' => 'Listings', 'url' => '/explore', 'order' => 1, 'module' => 'classifieds'],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => 'classifieds'],
            ],
            'ecommerce' => [
                ['title' => 'Shop', 'url' => '/explore', 'order' => 1, 'module' => 'products'],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => 'products'],
            ],
            default => [
                ['title' => 'Home', 'url' => '/', 'order' => 1, 'module' => null],
                ['title' => 'Explore', 'url' => '/explore', 'order' => 2, 'module' => null],
                ['title' => 'Shop', 'url' => '/explore', 'order' => 3, 'module' => 'products'],
            ],
        };
    }

    /**
     * @return array<int, array{title: string, url: string}>
     */
    protected function footerItemsForLocation(string $locationKey): array
    {
        return match ($locationKey) {
            'company_footer' => [
                ['title' => 'About', 'url' => '#'],
                ['title' => 'Careers', 'url' => '#'],
                ['title' => 'Press', 'url' => '#'],
            ],
            'support_footer' => [
                ['title' => 'Help Center', 'url' => '#'],
                ['title' => 'Contact Support', 'url' => '#'],
                ['title' => 'System Status', 'url' => '#'],
            ],
            'resources_footer' => [
                ['title' => 'Documentation', 'url' => '#'],
                ['title' => 'Terms of Service', 'url' => '#'],
                ['title' => 'Privacy Policy', 'url' => '#'],
            ],
            'social_footer' => [
                ['title' => 'Facebook', 'url' => '#'],
                ['title' => 'Instagram', 'url' => '#'],
                ['title' => 'X', 'url' => '#'],
            ],
            default => [],
        };
    }

    protected function footerRow(int $menuId, array $item, int $order, string $now): array
    {
        return [
            'menu_id'    => $menuId,
            'title'      => $item['title'],
            'url'        => $item['url'],
            'module'     => null,
            'parent_id'  => null,
            'order'      => $order,
            'status'     => 'active',
            'admin_note' => 'Seeded footer link.',
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }

    protected function resolveVertical(string $themeKey): ?string
    {
        if (str_starts_with($themeKey, 'unifieds_')) {
            return 'unifieds';
        }

        if (! str_contains($themeKey, '_')) {
            return null;
        }

        return explode('_', $themeKey, 2)[0];
    }
}
