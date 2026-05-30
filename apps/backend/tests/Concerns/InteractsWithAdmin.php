<?php

namespace Tests\Concerns;

use App\Models\User;
use Database\Seeders\AdminTestSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

trait InteractsWithAdmin
{
    use RefreshDatabase;

    protected User $admin;

    protected function seedAdminContext(): void
    {
        $this->seed(AdminTestSeeder::class);

        $this->admin = User::where('email', 'admin@sellio-platform.test')->firstOrFail();
    }

    protected function actingAsSuperAdmin(): static
    {
        return $this->actingAs($this->admin);
    }

    protected function ensureRole(string $name): Role
    {
        return Role::firstOrCreate(['name' => $name]);
    }
}
