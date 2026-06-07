<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\Admin\StorageLinkReminderService;
use App\Services\StorageLinkService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorageLinkReminderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_returns_null_for_guest_users(): void
    {
        $this->assertNull(app(StorageLinkReminderService::class)->getReminder());
    }

    public function test_returns_reminder_for_admin_when_storage_link_is_missing(): void
    {
        if (app(StorageLinkService::class)->linksAreHealthy()) {
            $this->markTestSkipped('public/storage is already linked in this environment.');
        }

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $reminder = app(StorageLinkReminderService::class)->getReminder();

        $this->assertNotNull($reminder);
        $this->assertSame(__('Storage link required'), $reminder['title']);
        $this->assertStringContainsString('/admin/system/maintenance', $reminder['maintenance_url']);
        $this->assertNotEmpty($reminder['issues']);
    }

    public function test_returns_null_when_storage_link_is_healthy(): void
    {
        app(StorageLinkService::class)->ensureLinks();

        if (! app(StorageLinkService::class)->linksAreHealthy()) {
            $this->markTestSkipped('Unable to create a healthy storage link in this environment.');
        }

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $this->assertNull(app(StorageLinkReminderService::class)->getReminder());
    }
}
