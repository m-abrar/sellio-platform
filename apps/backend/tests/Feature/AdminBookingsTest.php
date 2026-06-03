<?php

namespace Tests\Feature;

use Tests\TestCase;
use Tests\Concerns\InteractsWithAdmin;

class AdminBookingsTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedAdminContext();
    }

    public function test_admin_bookings_properties_route()
    {
        $response = $this->actingAsSuperAdmin()
                         ->get(route('admin.bookings.properties'));

        $response->assertStatus(200);
        
        $status = $response->viewData('status');
        $bookings = $response->viewData('bookings');
        $properties = $response->viewData('properties');

        $this->assertSame('all', $status);
        $this->assertNotNull($bookings);
        $this->assertNotNull($properties);
    }
}
