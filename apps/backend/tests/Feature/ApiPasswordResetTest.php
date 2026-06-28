<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use App\Notifications\MobileResetPasswordNotification;

class ApiPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);
    }

    public function test_can_send_reset_link_email()
    {
        $response = $this->postJson('/api/v1/auth/password/email', [
            'email' => 'test@example.com'
        ]);

        $response->assertStatus(200);
    }

    public function test_mobile_reset_request_sends_app_deep_link(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/password/email', [
            'email' => 'test@example.com',
            'client' => 'mobile',
        ]);

        $response->assertOk();

        Notification::assertSentTo(
            $this->user,
            MobileResetPasswordNotification::class,
            function (MobileResetPasswordNotification $notification): bool {
                $url = $notification->toMail($this->user)->actionUrl;

                return str_starts_with($url, 'sellio://reset-password?')
                    && str_contains($url, 'email=test%40example.com')
                    && str_contains($url, 'token=');
            },
        );
    }

    public function test_can_reset_password_with_token()
    {
        // Generate plain token
        $token = Password::broker()->createToken($this->user);

        $response = $this->postJson('/api/v1/auth/password/reset', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);

        $this->assertTrue(Hash::check('newpassword123', $this->user->fresh()->password));
    }

    public function test_reset_password_fails_with_invalid_token()
    {
        $response = $this->postJson('/api/v1/auth/password/reset', [
            'token' => 'invalid-token',
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
    }
}
