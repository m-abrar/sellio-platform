<?php

namespace Tests\Feature\Admin;

use App\Models\Menu;
use App\Models\MenuItem;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminMenuOperationsTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_add_menu_item_via_structure_sync(): void
    {
        $menu = Menu::firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.menu.update_structure', $menu), [
            'new_items' => [
                ['title' => 'CRUD Menu Link', 'url' => '/crud-menu-link'],
            ],
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('menu_items', [
            'menu_id' => $menu->id,
            'title' => 'CRUD Menu Link',
            'url' => '/crud-menu-link',
        ]);
    }

    public function test_admin_can_reorder_top_level_menu_items(): void
    {
        $menu = Menu::firstOrFail();

        $first = MenuItem::create([
            'menu_id' => $menu->id,
            'title' => 'Reorder Alpha',
            'url' => '/reorder-alpha',
            'order' => 1,
            'status' => 'active',
        ]);
        $second = MenuItem::create([
            'menu_id' => $menu->id,
            'title' => 'Reorder Beta',
            'url' => '/reorder-beta',
            'order' => 2,
            'status' => 'active',
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.menu.update_structure', $menu), [
            'menu_structure' => json_encode([
                ['id' => $second->id, 'children' => []],
                ['id' => $first->id, 'children' => []],
            ]),
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('menu_items', [
            'id' => $second->id,
            'order' => 1,
        ]);
        $this->assertDatabaseHas('menu_items', [
            'id' => $first->id,
            'order' => 2,
        ]);
    }

    public function test_admin_can_update_and_delete_menu_item(): void
    {
        $menu = Menu::firstOrFail();
        $item = MenuItem::create([
            'menu_id' => $menu->id,
            'title' => 'Disposable Menu Item',
            'url' => '/disposable-menu-item',
            'order' => 99,
            'status' => 'active',
        ]);

        $this->actingAsSuperAdmin()->put(route('admin.menu.update_item', $item), [
            'title' => 'Updated Menu Item',
            'url' => '/updated-menu-item',
        ])->assertOk()->assertJson(['success' => true]);

        $this->assertDatabaseHas('menu_items', [
            'id' => $item->id,
            'title' => 'Updated Menu Item',
            'url' => '/updated-menu-item',
        ]);

        $this->actingAsSuperAdmin()
            ->from(route('admin.menu.edit', $menu))
            ->delete(route('admin.menu.delete_item', $item))
            ->assertRedirect(route('admin.menu.edit', $menu))
            ->assertSessionHas('success');

        $this->assertNull(MenuItem::find($item->id));
    }
}
