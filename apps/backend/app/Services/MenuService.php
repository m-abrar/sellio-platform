<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache, Config, Route};
use Illuminate\Support\Str;

class MenuService
{
    public const GLOBAL_FALLBACK_THEME = 'unifieds_default';

    public const MENU_LOCATIONS = [
        'utility_topbar',
        'main_header',
        'mobile_nav',
        'utility_header',
        'action_buttons',
        'secondary_nav',
        'footer_column_1',
        'footer_column_2',
        'footer_column_3',
        'footer_column_4',
        'footer_bottom_bar',
        'social_footer',
    ];

    /** @deprecated Use footer_column_1..4 — kept for legacy cache keys during migration */
    public const LEGACY_MENU_LOCATIONS = [
        'company_footer',
        'support_footer',
        'resources_footer',
        'settings_footer',
    ];

    protected ?string $activeTheme;
    protected string $currentPath;

    public function __construct(Request $request)
    {
        $this->activeTheme = $this->resolveThemeKey(
            $request->header('X-Theme-Key')
                ?? $request->get('theme_key')
                ?? $request->themeKey
        );

        $this->currentPath = trim($request->path(), '/');
    }

    /**
     * Headless API: fetch a single menu location for a theme.
     */
    public function getForApi(string $locationKey, ?string $themeKey = null): array
    {
        return $this->getStructure($locationKey, $themeKey ?? $this->activeTheme, false);
    }

    /**
     * Headless API: fetch multiple menu locations in one call.
     *
     * @param  array<int, string>  $locationKeys
     */
    public function getForApiBatch(array $locationKeys, ?string $themeKey = null): array
    {
        $themeKey = $themeKey ?? $this->activeTheme;
        $result = [];

        foreach ($locationKeys as $locationKey) {
            $result[$locationKey] = $this->getStructure($locationKey, $themeKey, false);
        }

        return $result;
    }

    /**
     * Blade / legacy helper: returns top-level MenuItem models with active state.
     */
    public function get(string $locationKey): Collection
    {
        $structure = $this->getStructure($locationKey, $this->activeTheme, true);
        $items = $this->hydrateItemsFromStructure($structure['items']);
        $this->setActiveStateRecursively($items);

        return $items;
    }

    public function getMenuName(string $locationKey, ?string $defaultName = null): string
    {
        $structure = $this->getStructure($locationKey, $this->activeTheme, false);

        return $structure['title']
            ?? $defaultName
            ?? Str::of($locationKey)->replace('_', ' ')->title() . ' Menu';
    }

    public function getMenusList(): Collection
    {
        $cacheKey = "menu.list.{$this->activeTheme}";

        return Cache::rememberForever($cacheKey, function () {
            return Menu::where('theme_key', $this->activeTheme)
                ->where('status', 'active')
                ->orderBy('title')
                ->get();
        });
    }

    public function forgetCache(Menu $menu): void
    {
        foreach ($this->resolveThemeKeys($menu->theme_key) as $themeKey) {
            Cache::forget($this->generateStructureCacheKey($themeKey, $menu->location_key));
        }

        Cache::forget("menu.list.{$menu->theme_key}");
        Cache::forget("menu.list.{$this->activeTheme}");
    }

    public function forgetCacheByLocation(string $locationKey): void
    {
        foreach ($this->resolveThemeKeys($this->activeTheme) as $themeKey) {
            Cache::forget($this->generateStructureCacheKey($themeKey, $locationKey));
        }

        Cache::forget("menu.list.{$this->activeTheme}");
    }

    public function updateStructure(Menu $menu, array $data): void
    {
        \Illuminate\Support\Facades\DB::transaction(function () use ($menu, $data) {
            if (! empty($data['new_items'])) {
                foreach ($data['new_items'] as $newItem) {
                    if (! empty($newItem['title']) && ! empty($newItem['url'])) {
                        MenuItem::create([
                            'menu_id' => $menu->id,
                            'title'   => $newItem['title'],
                            'url'     => $newItem['url'],
                            'order'   => 9999,
                            'status'  => 'active',
                        ]);
                    }
                }
            }

            $menuStructure = [];
            if (! empty($data['menu_structure'])) {
                $decoded = json_decode($data['menu_structure'], true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $menuStructure = $decoded;
                }
            }

            if (! empty($menuStructure)) {
                $this->processNestedItems($menuStructure, $menu->id);
            }

            $this->forgetCache($menu);
        });
    }

    protected function getStructure(string $locationKey, string $themeKey, bool $resolveLaravelRoutes): array
    {
        $cacheKey = $this->generateStructureCacheKey($themeKey, $locationKey);

        $structure = Cache::rememberForever($cacheKey, function () use ($locationKey, $themeKey) {
            return $this->buildStructure($locationKey, $themeKey);
        });

        if ($resolveLaravelRoutes) {
            $structure = $this->resolveUrlsInStructure($structure);
        }

        return $structure;
    }

    protected function buildStructure(string $locationKey, string $themeKey): array
    {
        foreach ($this->resolveThemeKeys($themeKey) as $index => $candidateTheme) {
            $menu = Menu::query()
                ->where('theme_key', $candidateTheme)
                ->where('location_key', $locationKey)
                ->where('status', 'active')
                ->first();

            if (! $menu) {
                continue;
            }

            $items = $menu->items()
                ->whereNull('parent_id')
                ->active()
                ->with('childrenRecursive')
                ->orderBy('order')
                ->get();

            $itemTree = $this->mapItemsToDto($items);

            if (! empty($itemTree) || $index === 0) {
                return [
                    'location_key' => $locationKey,
                    'title'        => $menu->title,
                    'source'       => $this->resolveSource($candidateTheme, $themeKey),
                    'items'        => ! empty($itemTree) ? $itemTree : $this->fallbackItems($locationKey, $themeKey),
                ];
            }
        }

        return [
            'location_key' => $locationKey,
            'title'        => Str::of($locationKey)->replace('_', ' ')->title() . ' Menu',
            'source'       => 'fallback',
            'items'        => $this->fallbackItems($locationKey, $themeKey),
        ];
    }

    protected function mapItemsToDto(Collection $items): array
    {
        return $items
            ->map(fn (MenuItem $item) => $this->toItemDto($item))
            ->filter()
            ->values()
            ->all();
    }

    protected function toItemDto(MenuItem $item): ?array
    {
        if ($item->module && ! module_enabled($item->module)) {
            return null;
        }

        $children = $item->relationLoaded('childrenRecursive')
            ? collect($item->childrenRecursive)
                ->map(fn (MenuItem $child) => $this->toItemDto($child))
                ->filter()
                ->values()
                ->all()
            : [];

        return [
            'id'       => $item->id,
            'title'    => $item->title,
            'url'      => $this->normalizeUrl($item->url),
            'target'   => Str::startsWith($item->url, ['http://', 'https://', '//']) ? '_blank' : '_self',
            'children' => $children,
        ];
    }

    protected function normalizeUrl(?string $url): string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return '#';
        }

        if (Str::startsWith($url, ['http://', 'https://', '//', '#'])) {
            return $url;
        }

        return Str::startsWith($url, '/') ? $url : '/' . $url;
    }

    protected function resolveUrlsInStructure(array $structure): array
    {
        $structure['items'] = $this->resolveUrlsRecursively($structure['items']);

        return $structure;
    }

    protected function resolveUrlsRecursively(array $items): array
    {
        foreach ($items as &$item) {
            $url = $item['url'] ?? '#';

            if ($url !== '#' && ! Str::contains($url, '://') && ! Str::startsWith($url, '//')) {
                $cleanPath = trim($url, '/');
                $routeName = str_replace('/', '.', $cleanPath);

                if (Route::has($routeName)) {
                    $item['url'] = route($routeName);
                } elseif (Route::has($routeName . '.index')) {
                    $item['url'] = route($routeName . '.index');
                } else {
                    $item['url'] = url($url);
                }
            }

            if (! empty($item['children'])) {
                $item['children'] = $this->resolveUrlsRecursively($item['children']);
            }
        }

        return $items;
    }

    protected function hydrateItemsFromStructure(array $items): Collection
    {
        $models = array_map(function (array $item) {
            $model = new MenuItem([
                'id'    => $item['id'] ?? null,
                'title' => $item['title'],
                'url'   => $item['url'],
            ]);

            if (! empty($item['children'])) {
                $model->setRelation('children', $this->hydrateItemsFromStructure($item['children']));
            } else {
                $model->setRelation('children', new Collection());
            }

            return $model;
        }, $items);

        return new Collection($models);
    }

    protected function setActiveStateRecursively(Collection $items): void
    {
        foreach ($items as $item) {
            $item->is_active = false;

            $itemPath = trim(parse_url($item->url, PHP_URL_PATH) ?? '', '/');

            if ($itemPath === $this->currentPath) {
                $item->is_active = true;
            } elseif ($itemPath !== '' && Str::startsWith($this->currentPath, $itemPath . '/')) {
                $item->is_active = true;
            }

            if ($item->children->isNotEmpty()) {
                $this->setActiveStateRecursively($item->children);
            }
        }
    }

    protected function processNestedItems(array $items, int $menuId, ?int $parentId = null): void
    {
        foreach ($items as $index => $itemData) {
            if (isset($itemData['id']) && ! Str::startsWith($itemData['id'], 'new-')) {
                MenuItem::where('id', $itemData['id'])
                    ->where('menu_id', $menuId)
                    ->update([
                        'order'     => $index + 1,
                        'parent_id' => $parentId,
                    ]);

                if (! empty($itemData['children'])) {
                    $this->processNestedItems($itemData['children'], $menuId, (int) $itemData['id']);
                }
            }
        }
    }

    protected function resolveThemeKey(?string $requestedTheme): string
    {
        if ($requestedTheme) {
            $themeExists = Cache::remember("theme_exists.{$requestedTheme}", 3600, function () use ($requestedTheme) {
                return \App\Models\Theme::where('theme_key', $requestedTheme)->exists();
            });

            if ($themeExists) {
                return $requestedTheme;
            }
        }

        return \App\Models\Theme::where('is_active', 1)->value('theme_key')
            ?? Config::get('app.default_theme', self::GLOBAL_FALLBACK_THEME);
    }

    /**
     * @return array<int, string>
     */
    protected function resolveThemeKeys(string $themeKey): array
    {
        $keys = [$themeKey];

        if (str_contains($themeKey, '_')) {
            [$prefix] = explode('_', $themeKey, 2);
            $verticalDefault = "{$prefix}_default";

            if ($verticalDefault !== $themeKey) {
                $keys[] = $verticalDefault;
            }
        }

        if ($themeKey !== self::GLOBAL_FALLBACK_THEME) {
            $keys[] = self::GLOBAL_FALLBACK_THEME;
        }

        return array_values(array_unique($keys));
    }

    protected function resolveSource(string $resolvedTheme, string $requestedTheme): string
    {
        if ($resolvedTheme === $requestedTheme) {
            return 'theme';
        }

        if (str_contains($resolvedTheme, '_') && str_starts_with($requestedTheme, explode('_', $resolvedTheme, 2)[0] . '_')) {
            return 'vertical';
        }

        return $resolvedTheme === self::GLOBAL_FALLBACK_THEME ? 'global' : 'fallback';
    }

    protected function fallbackItems(string $locationKey, string $themeKey): array
    {
        if ($locationKey !== 'main_header') {
            return $this->fallbackFooterItems($locationKey);
        }

        $vertical = $this->resolveVertical($themeKey);

        return match ($vertical) {
            'properties'   => $this->dtoLinks(['Explore' => '/explore', 'Cart' => '/cart']),
            'autos'        => $this->dtoLinks(['Inventory' => '/explore', 'Explore' => '/explore']),
            'events'       => $this->dtoLinks(['Events' => '/explore']),
            'jobs'         => $this->dtoLinks(['Jobs' => '/explore']),
            'services'     => $this->dtoLinks(['Services' => '/explore']),
            'classifieds'  => $this->dtoLinks(['Listings' => '/explore']),
            'ecommerce'    => $this->dtoLinks(['Shop' => '/explore', 'Explore' => '/explore']),
            default        => $this->dtoLinks(['Home' => '/', 'Explore' => '/explore', 'Shop' => '/explore']),
        };
    }

    protected function fallbackFooterItems(string $locationKey): array
    {
        return match ($locationKey) {
            'social_footer'      => $this->dtoLinks(['Instagram' => '#', 'LinkedIn' => '#', 'X' => '#']),
            'footer_bottom_bar'  => $this->dtoLinks(['Privacy' => '#', 'Terms' => '#']),
            'footer_column_1',
            'footer_column_2',
            'footer_column_3',
            'footer_column_4'    => $this->dtoLinks(['About' => '#', 'Contact' => '#']),
            'company_footer'     => $this->dtoLinks(['About' => '#', 'Careers' => '#', 'Press' => '#']),
            'support_footer'     => $this->dtoLinks(['Help Center' => '#', 'Contact' => '#', 'Status' => '#']),
            'resources_footer'   => $this->dtoLinks(['Documentation' => '#', 'Terms' => '#', 'Privacy' => '#']),
            'settings_footer'    => $this->dtoLinks(['Language' => '#', 'Region' => '#']),
            default              => [],
        };
    }

    /**
     * @param  array<string, string>  $links
     */
    protected function dtoLinks(array $links): array
    {
        $order = 1;
        $items = [];

        foreach ($links as $title => $url) {
            $items[] = [
                'id'       => null,
                'title'    => $title,
                'url'      => $url,
                'target'   => Str::startsWith($url, ['http://', 'https://']) ? '_blank' : '_self',
                'children' => [],
            ];
            $order++;
        }

        return $items;
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

    protected function generateStructureCacheKey(string $themeKey, string $locationKey): string
    {
        return "menu.structure.{$themeKey}.{$locationKey}";
    }
}
