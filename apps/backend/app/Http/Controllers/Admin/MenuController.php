<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateMenuItemRequest;
use App\Http\Requests\Admin\UpdateMenuStructureRequest;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $selectedTheme = $request->query('theme') ?: $request->route('theme');

        $menus = Menu::withCount([
                'items',
                'items as top_level_items_count' => fn ($query) => $query->whereNull('parent_id'),
            ])
            ->when($selectedTheme, fn ($query) => $query->where('theme_key', $selectedTheme))
            ->orderBy('theme_key')
            ->orderBy('location_key')
            ->get();
            
        $themeKeys = Menu::select('theme_key')->distinct()->orderBy('theme_key')->pluck('theme_key');

        return view('admin.menu.index', [
            'menus'         => $menus,
            'themeKeys'     => $themeKeys,
            'selectedTheme' => $selectedTheme,
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
            ->active()
            ->with('childrenRecursive')
            ->get();
            
        return view('admin.menu.edit', [
            'menu'          => $menu,
            'items'         => $items,
            'moduleOptions' => MenuService::moduleOptions(),
        ]);
    }

    /**
     * Synchronize the menu structure, managing creation, ordering, and nested relationships.
     */
    public function updateStructure(UpdateMenuStructureRequest $request, Menu $menu, MenuService $menuService): RedirectResponse
    {
        try {
            $menuService->updateStructure($menu, $request->validated());

            return redirect()->back()->with('success', __('Menu structure updated successfully!'));
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update menu structure: :error', ['error' => $e->getMessage()]));
        }
    }
    

    /**
     * Update the descriptive metadata for a specific menu item.
     */
    public function updateItem(UpdateMenuItemRequest $request, MenuItem $item, MenuService $menuService): JsonResponse
    {
        $item->update($request->validated());

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
