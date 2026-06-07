<?php

namespace Tests\Feature;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class CorsSettingsTest extends TestCase
{
    use InteractsWithAdmin;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedAdminContext();
    }

    public function test_admin_can_save_cors_settings_and_api_allows_configured_origin(): void
    {
        Setting::set('url_frontend', 'https://storefront.example.com');
        Setting::set('url_partner', 'https://seller-panel.example.com');
        Setting::set('url_user', 'https://buyer-panel.example.com');
        Setting::set('cors_allowed_origins', 'https://staging.example.com');

        $this->actingAsSuperAdmin()->post(route('admin.settings.update.group', 'general'), [
            'site_name' => 'Sellio QA Platform',
            'site_tagline' => 'Updated QA tagline',
            'default_language' => 'en',
            'timezone' => 'UTC',
            'currency_code' => 'USD',
            'url_frontend' => 'https://storefront.example.com',
            'url_partner' => 'https://seller-panel.example.com',
            'url_user' => 'https://buyer-panel.example.com',
            'cors_allowed_origins' => "https://staging.example.com\nhttps://preview.example.com",
        ])->assertRedirect();

        $this->assertDatabaseHas('settings', [
            'key' => 'cors_allowed_origins',
            'value' => "https://staging.example.com\nhttps://preview.example.com",
        ]);

        $response = $this->withHeaders([
            'Origin' => 'https://seller-panel.example.com',
            'Access-Control-Request-Method' => 'GET',
        ])->options('/api/themes');

        $response->assertHeader('Access-Control-Allow-Origin', 'https://seller-panel.example.com');
    }
}
