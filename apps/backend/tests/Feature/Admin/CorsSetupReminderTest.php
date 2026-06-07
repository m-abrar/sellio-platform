<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Services\Admin\PlatformUrlVerificationService;
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
            ->assertSee(__('Platform URLs need your attention'), false)
            ->assertSee(__('Open Settings → General'), false);
    }

    public function test_admin_dashboard_hides_cors_setup_reminder_when_urls_are_configured(): void
    {
        $verification = app(PlatformUrlVerificationService::class);

        foreach ([
            'url_frontend' => 'https://storefront.mystore.io',
            'url_admin' => 'https://storefront.mystore.io/admin',
            'url_partner' => 'https://seller-panel.mystore.io',
            'url_user' => 'https://buyer-panel.mystore.io',
        ] as $field => $url) {
            Setting::set($field, $url);
            $verification->markConnected($field, $url);
        }

        $this->actingAsSuperAdmin()
            ->get(route('admin.welcome'))
            ->assertOk()
            ->assertDontSee(__('Platform URLs need your attention'), false);
    }
}
