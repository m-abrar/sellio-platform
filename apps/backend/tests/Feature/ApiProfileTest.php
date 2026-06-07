<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ApiProfileTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        Role::create(['name' => 'user']);
        
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);
        
        $this->user->assignRole('user');
    }

    public function test_can_get_profile()
    {
        $response = $this->actingAs($this->user, 'sanctum')
                         ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => ['id', 'name', 'email', 'roles']
                 ]);
    }

    public function test_can_update_profile()
    {
        $response = $this->actingAs($this->user, 'sanctum')
                         ->putJson('/api/v1/auth/profile', [
                             'name' => 'Updated Name',
                             'phone' => '1234567890',
                             'username' => 'testusername'
                         ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Profile updated successfully']);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name',
            'phone' => '1234567890',
            'username' => 'testusername'
        ]);
    }

    public function test_can_update_password()
    {
        $response = $this->actingAs($this->user, 'sanctum')
                         ->putJson('/api/v1/auth/profile/password', [
                             'current_password' => 'password123',
                             'password' => 'newpassword123',
                             'password_confirmation' => 'newpassword123',
                         ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Password updated successfully']);

        $this->assertTrue(Hash::check('newpassword123', $this->user->fresh()->password));
    }

    public function test_update_password_fails_if_incorrect_current()
    {
        $response = $this->actingAs($this->user, 'sanctum')
                         ->putJson('/api/v1/auth/profile/password', [
                             'current_password' => 'wrongpassword',
                             'password' => 'newpassword123',
                             'password_confirmation' => 'newpassword123',
                         ]);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'The provided current password does not match our records.']);
    }
}
