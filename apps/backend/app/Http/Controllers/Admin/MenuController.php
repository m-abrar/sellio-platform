<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class MenuController
 * Orchestrates the administrative management of navigation structures, coordinating 
 * recursive menu items, theme-specific locations, and structural cache invalidation.
 */
class MenuController extends Controller
{
    /**
     * Display a listing of all registered Menu Locations across themes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $menus = Menu::orderBy('theme_key')
            ->when($request->query('theme'), fn($q, $theme) => $q->where('theme_key', $theme)) 
            ->orderBy('location_key')
            ->get();
            
        $themeKeys = Menu::select('theme_key')->distinct()->pluck('theme_key');

        return view('admin.menu.index', [
            'menus'     => $menus,
            'themeKeys' => $themeKeys,
        ]);
    }
    
    /**
     * Show the interface for managing a specific menu location's hierarchical items.
     *
     * @param  \App\Models\Menu  $menu
     * @return \Illuminate\View\View
     */
    public function edit(Menu $menu): View
    {
        $items = $menu->items()
            ->whereNull('parent_id')
            ->with('children')
            ->get();
            
        return view('admin.menu.edit', [
            'menu'  => $menu,
            'items' => $items,
        ]);
    }

    /**
     * Synchronize the menu structure, managing creation, ordering, and nested relationships.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Menu  $menu
     * @param  \App\Services\MenuService  $menuService
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStructure(Request $request, Menu $menu, MenuService $menuService): RedirectResponse
    {
        $request->validate([
            'menu_structure'      => 'nullable|string', 
            'new_items'           => 'nullable|array',
            'new_items.*.title'   => 'required_with:new_items.*.url|string|max:255',
            'new_items.*.url'     => 'required_with:new_items.*.title|string|max:255',
        ]);
        
        DB::beginTransaction();

        try {
            // Phase 1: Initialize New Standalone Items
            if ($request->has('new_items')) {
                foreach ($request->new_items as $newItem) {
                    if (!empty($newItem['title']) && !empty($newItem['url'])) {
                        MenuItem::create([
                            'menu_id' => $menu->id,
                            'title'   => $newItem['title'],
                            'url'     => $newItem['url'],
                            'order'   => 9999,
                        ]);
                    }
                }
            }

            // Phase 2: Re-align Hierarchical Structure
            $menuStructure = [];
            if ($request->filled('menu_structure')) {
                $decodedStructure = json_decode($request->input('menu_structure'), true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($decodedStructure)) {
                    $menuStructure = $decodedStructure;
                } else {
                    DB::rollBack();
                    return redirect()->back()->with('error', __('Error decoding menu structure data.'));
                }
            }
            
            if (!empty($menuStructure)) {
                $this->processNestedItems($menuStructure, $menu->id);
            }

            // Phase 3: Cache Invalidation
            $menuService->forgetCache($menu);
            
            DB::commit();

            return redirect()->back()->with('success', __('Menu structure updated successfully!'));
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', __('Failed to update menu structure: :error', ['error' => $e->getMessage()]));
        }
    }
    
    /**
     * Recursively update item hierarchy and display order based on the provided tree structure.
     *
     * @param  array  $items
     * @param  int  $menuId
     * @param  int|null  $parentId
     * @return void
     */
    protected function processNestedItems(array $items, int $menuId, ?int $parentId = null): void
    {
        foreach ($items as $index => $itemData) {
            // Filter out temporary client-side IDs
            if (Str::startsWith($itemData['id'], 'new-')) {
                continue; 
            }
            
            $item = MenuItem::find((int) $itemData['id']);

            if ($item) {
                $item->update([
                    'order'     => $index + 1,
                    'parent_id' => $parentId,
                ]);
                
                if (isset($itemData['children']) && is_array($itemData['children'])) {
                    $this->processNestedItems($itemData['children'], $menuId, $item->id);
                }
            }
        }
    }

    /**
     * Update the descriptive metadata for a specific menu item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MenuItem  $item
     * @param  \App\Services\MenuService  $menuService
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateItem(Request $request, MenuItem $item, MenuService $menuService): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url'   => 'required|string|max:255',
        ]);

        $item->update([
            'title' => $request->input('title'),
            'url'   => $request->input('url'),
        ]);

        $menuService->forgetCache($item->menu);

        return response()->json([
            'success' => true, 
            'message' => __('Menu item updated successfully!')
        ]);
    }

    /**
     * Remove a menu item and trigger hierarchical cache invalidation.
     *
     * @param  \App\Models\MenuItem  $item
     * @param  \App\Services\MenuService  $menuService
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteItem(MenuItem $item, MenuService $menuService): RedirectResponse
    {
        $menu = $item->menu;
        $item->delete(); 

        $menuService->forgetCache($menu);

        return redirect()->back()->with('success', __('Menu item deleted successfully!'));
    }
}
