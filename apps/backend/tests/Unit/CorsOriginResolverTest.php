<?php

namespace Tests\Unit;

use App\Models\Setting;
use App\Services\CorsOriginResolver;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CorsOriginResolverTest extends TestCase
{
    use RefreshDatabase;

    public function test_normalizes_urls_to_origins(): void
    {
        $resolver = app(CorsOriginResolver::class);

        $this->assertSame('https://seller-panel.example.com', $resolver->normalizeOrigin('https://seller-panel.example.com/dashboard'));
        $this->assertSame('http://localhost:5173', $resolver->normalizeOrigin('http://localhost:5173/'));
        $this->assertSame('https://buyer-panel.example.com', $resolver->normalizeOrigin('buyer-panel.example.com'));
    }

    public function test_resolves_origins_from_admin_settings(): void
    {
        Setting::set('url_frontend', 'https://storefront.example.com/shop');
        Setting::set('url_partner', 'https://seller-panel.example.com/app');
        Setting::set('url_user', 'https://buyer-panel.example.com');
        Setting::set('cors_allowed_origins', "https://staging.example.com\nhttps://preview.example.com,");

        $origins = app(CorsOriginResolver::class)->resolve();

        $this->assertContains('https://storefront.example.com', $origins);
        $this->assertContains('https://seller-panel.example.com', $origins);
        $this->assertContains('https://buyer-panel.example.com', $origins);
        $this->assertContains('https://staging.example.com', $origins);
        $this->assertContains('https://preview.example.com', $origins);
    }
}
