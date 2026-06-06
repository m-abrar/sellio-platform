<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithAdmin;
use Tests\Concerns\InteractsWithPartnerApi;
use Tests\TestCase;

class AdminImpersonateTest extends TestCase
{
    use InteractsWithAdmin;
    use InteractsWithPartnerApi;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedAdminContext();
    }

    public function test_impersonating_partner_redirects_to_partner_dashboard_url(): void
    {
        Setting::set('url_partner', 'http://localhost:5173/dashboard');
        $partner = $this->createPartner();

        $this->actingAsSuperAdmin()
            ->get(route('admin.users.impersonate', $partner))
            ->assertRedirect(route('dashboard'));

        $this->actingAs($partner)
            ->get(route('dashboard'))
            ->assertRedirect('http://localhost:5173/dashboard');
    }

    public function test_impersonating_buyer_redirects_to_buyer_dashboard_url(): void
    {
        Role::firstOrCreate(['name' => 'user']);
        Setting::set('url_user', 'http://localhost:3003/');

        $buyer = User::factory()->create();
        $buyer->assignRole('user');

        $this->actingAsSuperAdmin()
            ->get(route('admin.users.impersonate', $buyer))
            ->assertRedirect(route('dashboard'));

        $this->actingAs($buyer)
            ->get(route('dashboard'))
            ->assertRedirect('http://localhost:3003/');
    }

    public function test_impersonating_admin_stays_on_laravel_admin_dashboard(): void
    {
        Role::firstOrCreate(['name' => 'admin']);

        $otherAdmin = User::factory()->create();
        $otherAdmin->assignRole('admin');

        $this->actingAsSuperAdmin()
            ->get(route('admin.users.impersonate', $otherAdmin))
            ->assertRedirect(route('dashboard'));

        $this->actingAs($otherAdmin)
            ->get(route('dashboard'))
            ->assertRedirect(route('admin.welcome'));
    }
}
