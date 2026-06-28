<?php

namespace Tests\Feature;

use App\Models\PushToken;
use App\Models\User;
use App\Services\ExpoPushService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MobilePushTokenApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_register_and_remove_an_expo_push_token(): void
    {
        $buyer = User::factory()->create();
        $token = 'ExponentPushToken[test-device-token]';

        $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/dashboard/user/notifications/push-token', [
                'token' => $token,
                'platform' => 'android',
                'device_name' => 'Test Phone',
            ])
            ->assertOk();

        $this->assertDatabaseHas('push_tokens', ['user_id' => $buyer->id, 'token' => $token]);

        $this->actingAs($buyer, 'sanctum')
            ->deleteJson('/api/dashboard/user/notifications/push-token', ['token' => $token])
            ->assertOk();

        $this->assertDatabaseMissing('push_tokens', ['token' => $token]);
    }

    public function test_expo_push_service_sends_registered_tokens(): void
    {
        Http::fake(['exp.host/*' => Http::response(['data' => [['status' => 'ok']]])]);
        $buyer = User::factory()->create();
        PushToken::create([
            'user_id' => $buyer->id,
            'token' => 'ExponentPushToken[test-delivery-token]',
            'platform' => 'android',
        ]);

        app(ExpoPushService::class)->send($buyer, [
            'title' => 'New message',
            'message' => 'A seller replied.',
            'route' => '/messages',
            'type' => 'message',
        ]);

        Http::assertSent(fn ($request) => $request->url() === config('services.expo_push.endpoint')
            && $request[0]['to'] === 'ExponentPushToken[test-delivery-token]');
    }
}
