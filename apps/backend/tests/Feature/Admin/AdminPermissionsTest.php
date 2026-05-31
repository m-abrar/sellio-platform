<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminPermissionsTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('admin.welcome'))
            ->assertRedirect(route('login'));
    }

    public function test_partner_cannot_access_admin_dashboard(): void
    {
        $partner = User::where('email', 'partner@test.test')->firstOrFail();

        $this->actingAs($partner)
            ->get(route('admin.welcome'))
            ->assertForbidden();
    }

    public function test_moderator_can_access_categories_but_not_users(): void
    {
        $moderator = User::factory()->create(['email' => 'limited-admin@test.test']);
        $moderator->assignRole(Role::where('name', 'moderator')->firstOrFail());

        $this->actingAs($moderator)
            ->get(route('admin.categories.index'))
            ->assertOk();

        $this->actingAs($moderator)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_moderator_cannot_manage_menus(): void
    {
        $moderator = User::factory()->create(['email' => 'menu-denied@test.test']);
        $moderator->assignRole(Role::where('name', 'moderator')->firstOrFail());

        $this->actingAs($moderator)
            ->get(route('admin.menu.index'))
            ->assertForbidden();
    }

    public function test_super_admin_can_access_users_and_menus(): void
    {
        $this->actingAsSuperAdmin()
            ->get(route('admin.users.index'))
            ->assertOk();

        $this->actingAsSuperAdmin()
            ->get(route('admin.menu.index'))
            ->assertOk();
    }

    public function test_limited_admin_with_single_permission_can_access_allowed_module_only(): void
    {
        Role::where('name', 'admin')->firstOrFail()->syncPermissions(['manage-product']);

        $limitedAdmin = User::factory()->create([
            'email' => 'limited-product-admin@test.test',
            'is_admin' => true,
        ]);
        $limitedAdmin->assignRole('admin');

        $this->actingAs($limitedAdmin)
            ->get(route('admin.products.index'))
            ->assertOk();

        $this->actingAs($limitedAdmin)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_standard_user_cannot_access_admin_dashboard(): void
    {
        $buyer = User::factory()->create(['email' => 'buyer-user@test.test']);
        $buyer->assignRole(Role::where('name', 'user')->firstOrFail());

        $this->actingAs($buyer)
            ->get(route('admin.welcome'))
            ->assertForbidden();
    }
}
