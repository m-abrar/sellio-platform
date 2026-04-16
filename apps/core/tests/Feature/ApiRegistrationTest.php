<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Spatie\Permission\Models\Role;

class ApiRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles for testing
        Role::create(['name' => 'user']);
        Role::create(['name' => 'partner']);
    }

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'user',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'access_token',
                     'token_type',
                     'user' => ['id', 'name', 'email', 'roles']
                 ]);

        $this->assertDatabaseHas('users', ['email' => 'testuser@example.com']);
        $user = User::where('email', 'testuser@example.com')->first();
        $this->assertTrue($user->hasRole('user'));
        $this->assertTrue($user->is_buyer);
    }

    public function test_partner_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test Partner',
            'email' => 'testpartner@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'partner',
        ]);

        $response->assertStatus(201);
        $user = User::where('email', 'testpartner@example.com')->first();
        $this->assertTrue($user->hasRole('partner'));
        $this->assertFalse($user->is_buyer);
    }

    public function test_registration_validation_fails()
    {
        $response = $this->postJson('/api/register', []); // Empty

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password', 'role']);
    }
}
