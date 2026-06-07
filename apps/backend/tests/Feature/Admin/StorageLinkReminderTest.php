<?php

namespace Tests\Feature\Admin;

use App\Services\StorageLinkService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class StorageLinkReminderTest extends TestCase
{
    use InteractsWithAdmin;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedAdminContext();
    }

    public function test_admin_dashboard_shows_storage_link_reminder_when_symlink_is_missing(): void
    {
        if (app(StorageLinkService::class)->linksAreHealthy()) {
            $this->markTestSkipped('public/storage is already linked in this environment.');
        }

        $this->actingAsSuperAdmin()
            ->get(route('admin.welcome'))
            ->assertOk()
            ->assertSee(__('Storage link required'), false)
            ->assertSee(__('Open System Maintenance'), false);
    }

    public function test_maintenance_page_highlights_fix_storage_link_action_when_symlink_is_missing(): void
    {
        if (app(StorageLinkService::class)->linksAreHealthy()) {
            $this->markTestSkipped('public/storage is already linked in this environment.');
        }

        $this->actingAsSuperAdmin()
            ->get(route('admin.system.maintenance'))
            ->assertOk()
            ->assertSee(__('Fix Storage Link Now'), false)
            ->assertDontSee(__('Open System Maintenance'), false);
    }

    public function test_admin_dashboard_hides_storage_link_reminder_when_symlink_is_healthy(): void
    {
        app(StorageLinkService::class)->ensureLinks();

        if (! app(StorageLinkService::class)->linksAreHealthy()) {
            $this->markTestSkipped('Unable to create a healthy storage link in this environment.');
        }

        $this->actingAsSuperAdmin()
            ->get(route('admin.welcome'))
            ->assertOk()
            ->assertDontSee(__('Storage link required'), false);
    }
}
