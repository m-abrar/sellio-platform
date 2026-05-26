<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminBarStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_receives_unauthenticated_status(): void
    {
        $response = $this->getJson('/admin-bar/status');

        $response->assertOk()
            ->assertJson([
                'authenticated' => false,
                'user' => null,
            ]);
    }

    public function test_admin_receives_authenticated_status(): void
    {
        Role::firstOrCreate(['name' => 'admin']);

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->getJson('/admin-bar/status');

        $response->assertOk()
            ->assertJsonPath('authenticated', true)
            ->assertJsonPath('user.email', $admin->email);
    }
}
