<?php

namespace Tests\Unit;

use App\Models\Setting;
use App\Services\Admin\PlatformUrlVerificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PlatformUrlVerificationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected PlatformUrlVerificationService $service;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(PlatformUrlVerificationService::class);
    }

    public function test_verify_marks_url_connected_when_endpoint_responds(): void
    {
        Http::fake(fn () => Http::response('OK', 200));

        $result = $this->service->verify('url_partner', 'https://seller.example.com');

        $this->assertTrue($result['connected']);
        $this->assertTrue($this->service->isConnected('url_partner', 'https://seller.example.com/'));
        $this->assertSame('1', Setting::get('url_partner_verified'));
        $this->assertSame('https://seller.example.com', Setting::get('url_partner_verified_url'));
    }

    public function test_verify_marks_url_disconnected_when_endpoint_fails(): void
    {
        Http::fake(fn () => Http::response('Not Found', 404));

        $result = $this->service->verify('url_partner', 'https://seller.example.com');

        $this->assertFalse($result['connected']);
        $this->assertFalse($this->service->isConnected('url_partner', 'https://seller.example.com'));
        $this->assertSame('0', Setting::get('url_partner_verified'));
    }

    public function test_sync_verification_on_save_clears_status_when_url_changes(): void
    {
        $this->service->markConnected('url_user', 'https://buyer.example.com');
        Setting::set('url_user', 'https://buyer.example.com');

        $this->service->syncVerificationOnSave('url_user', 'https://new-buyer.example.com');
        Setting::set('url_user', 'https://new-buyer.example.com');

        $this->assertFalse($this->service->isConnected('url_user', 'https://new-buyer.example.com'));
        $this->assertSame('0', Setting::get('url_user_verified'));
    }
}
