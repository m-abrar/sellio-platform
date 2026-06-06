<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BuyerPasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_buyer_can_update_password_with_valid_current_password(): void
    {
        $buyer = User::factory()->create([
            'password' => Hash::make('old-password-123'),
        ]);

        $this->actingAs($buyer, 'sanctum')
            ->putJson('/api/v1/auth/profile/password', [
                'current_password' => 'old-password-123',
                'password' => 'new-password-456',
                'password_confirmation' => 'new-password-456',
            ])
            ->assertOk()
            ->assertJsonPath('message', 'Password updated successfully');

        $buyer->refresh();
        $this->assertTrue(Hash::check('new-password-456', $buyer->password));
    }

    public function test_buyer_password_update_rejects_invalid_current_password(): void
    {
        $buyer = User::factory()->create([
            'password' => Hash::make('old-password-123'),
        ]);

        $this->actingAs($buyer, 'sanctum')
            ->putJson('/api/v1/auth/profile/password', [
                'current_password' => 'wrong-password',
                'password' => 'new-password-456',
                'password_confirmation' => 'new-password-456',
            ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'The provided current password does not match our records.');
    }
}
