<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Services\MenuService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MenuController extends Controller
{
    /**
     * Display a listing of all Menu Locations.
     */
    public function index(Request $request, $theme=null)
    {
        // Fetch all existing Menu Locations, ordered by theme and location key.
        $menus = Menu::orderBy('theme_key')
            ->when($request->theme, fn($q, $theme) => $q->where('theme_key', $theme)) 
            ->orderBy('location_key')
            ->get();
            
        // Fetch all unique theme keys (for display/filtering)
        $themeKeys = Menu::select('theme_key')->distinct()->pluck('theme_key');

        return view('admin.menu.index', [
            'menus' => $menus,
            'themeKeys' => $themeKeys,
        ]);
    }
    
    /**
     * Show the form for editing the items of a specific Menu Location.
     */
    public function edit(Menu $menu)
    {
        // Load all menu items, eager load children, and only select top-level items (parent_id = null)
        $items = $menu->items()
            ->whereNull('parent_id')
            ->with('children')
            ->get();
            
        return view('admin.menu.edit', [
            'menu' => $menu,
            'items' => $items, // Top-level items including nested children
        ]);
    }

    /**
     * Handle the bulk update of the menu item structure (order, parent, creation, deletion).
     */
    public function updateStructure(Request $request, Menu $menu, MenuService $menuService)
    {
        $request->validate([
            // FIX: Validate as string, as the hidden field sends a JSON string.
            'menu_structure' => 'nullable|string', 
            // For new items submitted via separate fields
            'new_items' => 'nullable|array',
            'new_items.*.title' => 'required_with:new_items.*.url|string|max:255',
            'new_items.*.url' => 'required_with:new_items.*.title|string|max:255',
        ]);
        
        // Use a transaction for safety
        DB::beginTransaction();

        try {
            // --- 1. Process New Items (Created at root level initially) ---
            if ($request->has('new_items')) {
                foreach ($request->new_items as $newItem) {
                    if (!empty($newItem['title']) && !empty($newItem['url'])) {
                        // Create new item at the root level 
                        MenuItem::create([
                            'menu_id' => $menu->id,
                            'title' => $newItem['title'],
                            'url' => $newItem['url'],
                            'order' => 9999, // Will be fixed by processNestedItems if included in structure
                        ]);
                    }
                }
            }

            // --- 2. Process Structure Update (Order and Parent) ---
            $menuStructure = [];
            if ($request->filled('menu_structure')) {
                // FIX: Decode the JSON string into a PHP array
                $decodedStructure = json_decode($request->menu_structure, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($decodedStructure)) {
                    $menuStructure = $decodedStructure;
                } else {
                    DB::rollBack();
                    return redirect()->back()->with('error', 'Error decoding menu structure data. Please try again.');
                }
            }
            
            if (!empty($menuStructure)) {
                // NOTE: This logic is ready for nested arrays, but client-side JS must provide the nesting.
                $this->processNestedItems($menuStructure, $menu->id);
            }

            // --- 3. Clean up cache ---
            $menuService->forgetCache($menu);
            
            DB::commit();

            return redirect()->back()->with('success', 'Menu structure updated successfully!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error and return with an error message
            return redirect()->back()->with('error', 'Failed to update menu structure: ' . $e->getMessage());
        }
    }
    
    /**
     * Recursively updates item parent and order based on the submitted structure.
     */
    protected function processNestedItems(array $items, int $menuId, int $parentId = null): void
    {
        foreach ($items as $index => $itemData) {
            // Item ID is crucial here. Skip if it's a client-side new item ID (e.g., 'new-0')
            if (Str::startsWith($itemData['id'], 'new-')) {
                // We assume new items have been created prior to this and should have a real ID
                continue; 
            }
            
            $itemId = (int) $itemData['id']; 
            
            // Find the item
            $item = MenuItem::find($itemId);

            if ($item) {
                // Update order and parent ID
                $item->update([
                    'order' => $index + 1, // 1-based index for order
                    'parent_id' => $parentId,
                ]);
                
                // Recursively process children if they exist
                if (isset($itemData['children']) && is_array($itemData['children'])) {
                    $this->processNestedItems($itemData['children'], $menuId, $itemId);
                }
            }
        }
    }

    /**
     * Update a specific MenuItem's title and URL.
     */
    public function updateItem(Request $request, MenuItem $item, MenuService $menuService)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|string|max:255',
        ]);

        $item->update([
            'title' => $request->title,
            'url' => $request->url,
        ]);

        $menuService->forgetCache($item->menu);

        // Return a JSON response for the AJAX call
        return response()->json(['success' => true, 'message' => 'Menu item updated successfully!']);
    }

    /**
     * Delete a specific MenuItem.
     */
    public function deleteItem(MenuItem $item, MenuService $menuService)
    {
        $menu = $item->menu;
        
        // Deletes children automatically via cascade defined in migration (assumed)
        $item->delete(); 

        $menuService->forgetCache($menu);

        return redirect()->back()->with('success', 'Menu item deleted successfully!');
    }
}
