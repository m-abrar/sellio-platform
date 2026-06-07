<?php

namespace Tests\Unit;

use App\Models\Setting;
use App\Models\User;
use App\Services\Admin\CorsSetupReminderService;
use App\Services\Admin\PlatformUrlVerificationService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CorsSetupReminderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    public function test_returns_null_for_guest_users(): void
    {
        $this->assertNull(app(CorsSetupReminderService::class)->getReminder());
    }

    public function test_returns_issues_when_portal_urls_are_missing(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $reminder = app(CorsSetupReminderService::class)->getReminder();

        $this->assertNotNull($reminder);
        $this->assertCount(4, $reminder['issues']);
        $this->assertStringContainsString('general', $reminder['settings_url']);
    }

    public function test_returns_null_when_production_urls_are_configured(): void
    {
        $this->seedVerifiedPlatformUrls([
            'url_frontend' => 'https://storefront.mystore.io',
            'url_admin' => 'https://storefront.mystore.io/admin',
            'url_partner' => 'https://seller-panel.mystore.io',
            'url_user' => 'https://buyer-panel.mystore.io',
        ]);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $this->assertNull(app(CorsSetupReminderService::class)->getReminder());
    }

    public function test_flags_placeholder_domains(): void
    {
        Setting::set('url_frontend', 'https://marketplace.yourdomain.com');
        Setting::set('url_partner', 'https://seller-panel.example.com');
        Setting::set('url_user', 'https://buyer-panel.example.com');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $reminder = app(CorsSetupReminderService::class)->getReminder();

        $this->assertNotNull($reminder);
        $this->assertSame('url_frontend', $reminder['issues'][0]['field']);
        $this->assertSame(__('Still a placeholder domain'), $reminder['issues'][0]['detail']);
    }

    /**
     * @param array<string, string> $urls
     */
    protected function seedVerifiedPlatformUrls(array $urls): void
    {
        $verification = app(PlatformUrlVerificationService::class);

        foreach ($urls as $field => $url) {
            Setting::set($field, $url);
            $verification->markConnected($field, $url);
        }
    }
}
