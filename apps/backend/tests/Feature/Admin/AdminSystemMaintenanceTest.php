<?php

namespace Tests\Feature\Admin;

use App\Jobs\RegenerateMediaJob;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminSystemMaintenanceTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_view_system_maintenance_and_status_pages(): void
    {
        $this->actingAsSuperAdmin()->get(route('admin.system.maintenance'))
            ->assertOk()
            ->assertSee('System Maintenance', false);

        $this->actingAsSuperAdmin()->get(route('admin.system.status'))
            ->assertOk()
            ->assertSee('PHP Version', false);
    }

    public function test_admin_can_clear_application_cache(): void
    {
        Cache::put('admin-maintenance-test-key', 'cached-value', 60);

        $this->actingAsSuperAdmin()
            ->from(route('admin.system.maintenance'))
            ->post(route('admin.system.cache.clear'))
            ->assertRedirect(route('admin.system.maintenance'))
            ->assertSessionHas('success');

        $this->assertNull(Cache::get('admin-maintenance-test-key'));
    }

    public function test_admin_can_clear_config_route_and_view_caches(): void
    {
        $this->actingAsSuperAdmin()
            ->from(route('admin.system.maintenance'))
            ->post(route('admin.system.config.clear'))
            ->assertRedirect(route('admin.system.maintenance'))
            ->assertSessionHas('success');

        $this->actingAsSuperAdmin()
            ->from(route('admin.system.maintenance'))
            ->post(route('admin.system.route.clear'))
            ->assertRedirect(route('admin.system.maintenance'))
            ->assertSessionHas('success');

        $this->actingAsSuperAdmin()
            ->from(route('admin.system.maintenance'))
            ->post(route('admin.system.view.clear'))
            ->assertRedirect(route('admin.system.maintenance'))
            ->assertSessionHas('success');
    }

    public function test_admin_can_queue_media_regeneration(): void
    {
        Queue::fake();

        $this->actingAsSuperAdmin()
            ->from(route('admin.system.maintenance'))
            ->post(route('admin.system.media.regenerate'))
            ->assertRedirect(route('admin.system.maintenance'))
            ->assertSessionHas('success');

        Queue::assertPushed(RegenerateMediaJob::class);
    }

    public function test_admin_can_run_optimize_action(): void
    {
        $this->actingAsSuperAdmin()
            ->from(route('admin.system.maintenance'))
            ->post(route('admin.system.optimize'))
            ->assertRedirect()
            ->assertSessionHas('success');
    }
}
