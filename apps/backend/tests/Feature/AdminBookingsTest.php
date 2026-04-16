<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminBookingsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure role exists for actingAs
        if (!Role::where('name', 'super-admin')->exists()) {
            Role::create(['name' => 'super-admin']);
        }
    }

    public function test_admin_bookings_properties_route()
    {
        $user = User::factory()->create();
        $user->assignRole('super-admin');

        echo "\n--- Hitting /dashboard/admin/bookings/properties ---\n";
        
        $response = $this->actingAs($user)
                         ->get('/dashboard/admin/bookings/properties');

        $response->assertStatus(200);
        
        $status = $response->viewData('status');
        $type = $response->viewData('type');
        $bookings = $response->viewData('bookings');

        echo "View Status Variable: " . $status . "\n";
        echo "View Type Variable: " . $type . "\n";
        echo "View Bookings Total: " . ($bookings ? $bookings->total() : 'NULL') . "\n";
    }
}
