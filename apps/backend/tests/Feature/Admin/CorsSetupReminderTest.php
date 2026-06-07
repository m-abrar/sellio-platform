<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class CorsSetupReminderTest extends TestCase
{
    use InteractsWithAdmin;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedAdminContext();
    }

    public function test_admin_dashboard_shows_cors_setup_reminder_when_urls_are_missing(): void
    {
        $this->actingAsSuperAdmin()
            ->get(route('admin.welcome'))
            ->assertOk()
            ->assertSee(__('API CORS setup required'), false)
            ->assertSee(__('Open Settings → General'), false);
    }

    public function test_admin_dashboard_hides_cors_setup_reminder_when_urls_are_configured(): void
    {
        Setting::set('url_frontend', 'https://storefront.mystore.io');
        Setting::set('url_partner', 'https://seller-panel.mystore.io');
        Setting::set('url_user', 'https://buyer-panel.mystore.io');

        $this->actingAsSuperAdmin()
            ->get(route('admin.welcome'))
            ->assertOk()
            ->assertDontSee(__('API CORS setup required'), false);
    }
}
