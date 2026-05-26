<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminBarHttpSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_bar_status_works_after_web_login(): void
    {
        Role::firstOrCreate(['name' => 'admin']);

        $admin = User::factory()->create([
            'email' => 'admin-bar@test.test',
            'password' => bcrypt('secret123'),
        ]);
        $admin->assignRole('admin');

        $this->post('/login', [
            'email' => 'admin-bar@test.test',
            'password' => 'secret123',
        ])->assertRedirect();

        $response = $this->getJson('/admin-bar/status');

        $response->assertOk()
            ->assertJsonPath('authenticated', true)
            ->assertJsonPath('user.email', 'admin-bar@test.test');
    }
}
