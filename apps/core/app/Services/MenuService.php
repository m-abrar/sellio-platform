<?php

namespace App\Services;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Facades\{Cache, Route, Config};
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class MenuService
{
    /**
     * Use nullable string to prevent TypeErrors during early boot or CLI tasks.
     */
    protected ?string $activeApp;
    protected string $currentPath;

    public function __construct(Request $request)
    {
        // 1. Resolve active app with a reliable fallback
        $this->activeApp = $request->get('app_key') 
            ?? $request->appKey 
            ?? Config::get('app.default_app', 'default');

        // 2. Normalize current path for comparison
        $this->currentPath = trim($request->path(), '/'); 
    }

    /**
     * Retrieves the menu structure for an application location.
     */
    public function get(string $locationKey): Collection
    {
        $cacheKey = $this->generateCacheKey($locationKey);

        // Retrieve structured items (Safe to cache forever)
        $items = Cache::rememberForever($cacheKey, function () use ($locationKey) {
            
            $menu = Menu::firstOrCreate([
                'app_key' => $this->activeApp,
                'location_key' => $locationKey,
            ], [
                'title' => Str::of($locationKey)->replace('_', ' ')->title() . ' Menu',
            ]);
            
            $items = $menu->items()
                ->whereNull('parent_id')
                ->with('children') 
                ->get();

            $this->resolveUrlsRecursively($items);

            return $items;
        });

        // 3. Dynamic State: Determine 'active' class on every request
        // Clone to avoid polluting the cached Eloquent models in memory
        $items = clone $items;
        $this->setActiveStateRecursively($items);
        
        return $items;
    }

    /**
     * Resolves URLs and Routes. 
     * Refactored for cleaner logic and marketplace standards.
     */
    protected function resolveUrlsRecursively(Collection $items): void
    {
        foreach ($items as $item) {
            if ($item->url && is_string($item->url)) {
                $url = $item->url;

                // Only process internal links
                if (!Str::contains($url, '://') && !Str::startsWith($url, '//')) {
                    $cleanPath = trim($url, '/');
                    $routeName = str_replace('/', '.', $cleanPath);
                    
                    if (Route::has($routeName)) {
                        $item->url = route($routeName);
                    } elseif (Route::has($routeName . '.index')) {
                        $item->url = route($routeName . '.index');
                    } else {
                        $item->url = url($url); 
                    }
                }
            }

            if ($item->children->isNotEmpty()) {
                $this->resolveUrlsRecursively($item->children);
            }
        }
    }
    
    /**
     * Performance-optimized active state checker
     */
    protected function setActiveStateRecursively(Collection $items): void
    {
        foreach ($items as $item) {
            $item->is_active = false;
            
            $itemPath = trim(parse_url($item->url, PHP_URL_PATH), '/');

            if ($itemPath === $this->currentPath) {
                $item->is_active = true;
            } elseif ($itemPath !== '' && Str::startsWith($this->currentPath, $itemPath . '/')) {
                // Catches sub-pages (e.g. /blog/my-post makes /blog active)
                $item->is_active = true;
            }

            if ($item->children->isNotEmpty()) {
                $this->setActiveStateRecursively($item->children);
            }
        }
    }

    
    /**
     * Retrieves the human-readable name of the Menu associated with a location key.
     * @param string $locationKey The unique identifier for the menu slot (e.g., 'main_header').
     * @param string|null $defaultName An optional fallback name if the menu is created on the fly.
     * @return string The human-readable menu name.
     */
    public function getMenuName(string $locationKey, ?string $defaultName = null): string
    {
        $cacheKey = $this->generateMenuNameCacheKey($locationKey);
        // Determine the name to use if the record needs to be created
        $defaultName = $defaultName ?? Str::of($locationKey)->replace('_', ' ')->title().' Menu';

        // Retrieve the name from cache or generate and store forever
        return Cache::rememberForever($cacheKey, function () use ($locationKey, $defaultName) {
            
            // Find the parent Menu Location record, or create it if not found
            $menu = Menu::firstOrCreate([
                'app_key' => $this->activeApp,
                'location_key' => $locationKey,
            ], [
                // Use the provided default name or the generated one
                'title' => $defaultName,
            ]);

            return $menu->title;
        });
    }

    /**
     * Retrieves all Menu locations for the currently active theme.
     * @return Collection|Menu[] A collection of Menu models.
     */
    public function getMenusList(): Collection
    {
        $cacheKey = $this->generateMenusListCacheKey();

        return Cache::rememberForever($cacheKey, function () {
            // Fetch all menus that belong to the active application
            return Menu::where('app_key', $this->activeApp)
                ->orderBy('title')
                ->get();
        });
    }

    public function forgetCache(Menu $menu): void
    {
        // Forget the menu items cache
        Cache::forget($this->generateCacheKey($menu->location_key));
        // Forget the menu name cache
        Cache::forget($this->generateMenuNameCacheKey($menu->location_key));
        // Forget the general menu list cache for this theme
        Cache::forget($this->generateMenusListCacheKey());
    }
    
    // Alias to easily clear cache by location key (useful after CRUD operations)
    public function forgetCacheByLocation(string $locationKey): void
    {
        // Forget the menu items cache
        Cache::forget($this->generateCacheKey($locationKey));
        // Forget the menu name cache
        Cache::forget($this->generateMenuNameCacheKey($locationKey));
        // Forget the general menu list cache for this theme
        Cache::forget($this->generateMenusListCacheKey());
    }

    protected function generateCacheKey(string $locationKey): string
    {
        return "menu.{$this->activeApp}.{$locationKey}"; // Cache key for menu items
    }
    
    protected function generateMenuNameCacheKey(string $locationKey): string
    {
        return "menu.name.{$this->activeApp}.{$locationKey}"; // Cache key for menu name
    }

    protected function generateMenusListCacheKey(): string
    {
        return "menu.list.{$this->activeApp}"; // Cache key for the list of all menus in this app
    }
}
