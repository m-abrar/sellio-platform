<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MobileCheckoutHandoffTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_receives_a_short_lived_signed_checkout_handoff(): void
    {
        $buyer = User::factory()->create();

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/v1/checkout/handoff')
            ->assertOk();

        $url = $response->json('data.url');
        $this->assertIsString($url);
        $this->assertStringContainsString('/mobile/checkout/handoff/', $url);
        $this->assertStringContainsString('signature=', $url);

        $path = parse_url($url, PHP_URL_PATH) . '?' . parse_url($url, PHP_URL_QUERY);
        $this->get($path)
            ->assertRedirect(route('checkout.index'));

        $this->assertAuthenticatedAs($buyer);
        $this->assertSame('sellio://payment-return', session('mobile_checkout_return_url'));
    }
}
