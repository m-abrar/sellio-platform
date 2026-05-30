<?php

namespace Tests\Feature\Admin;

use App\Models\Page;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminPageCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_page(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.pages.store'), [
            'title' => 'CRUD Test Page',
            'slug' => 'crud-test-page',
            'status' => Page::STATUS_ACTIVE,
        ])->assertRedirect();

        $page = Page::where('slug', 'crud-test-page')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.pages.update', $page), [
            'title' => 'Updated CRUD Page',
            'slug' => 'crud-test-page',
            'status' => Page::STATUS_ACTIVE,
        ])->assertRedirect(route('admin.pages.index'));

        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'Updated CRUD Page',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.pages.destroy', $page))
            ->assertRedirect(route('admin.pages.index'));

        $this->assertNull(Page::find($page->id));
    }
}
