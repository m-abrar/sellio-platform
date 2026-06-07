<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class PlatformUrlVerificationTest extends TestCase
{
    use InteractsWithAdmin;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedAdminContext();
    }

    public function test_admin_can_verify_platform_url_via_ajax(): void
    {
        Http::fake(fn () => Http::response('OK', 200));

        $this->actingAsSuperAdmin()
            ->postJson(route('admin.settings.verify.platform-url'), [
                'field' => 'url_user',
                'url' => 'https://buyer.example.com',
            ])
            ->assertOk()
            ->assertJson([
                'field' => 'url_user',
                'connected' => true,
            ]);
    }

    public function test_platform_url_verification_requires_valid_field(): void
    {
        $this->actingAsSuperAdmin()
            ->postJson(route('admin.settings.verify.platform-url'), [
                'field' => 'invalid_field',
                'url' => 'https://buyer.example.com',
            ])
            ->assertUnprocessable();
    }
}
