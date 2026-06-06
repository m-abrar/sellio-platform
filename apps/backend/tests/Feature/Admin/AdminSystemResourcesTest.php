<?php

namespace Tests\Feature\Admin;

use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Subscription;
use Spatie\Permission\Models\Permission;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminSystemResourcesTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_and_delete_permission(): void
    {
        $this->actingAsSuperAdmin()->post(route('admin.permissions.store'), [
            'name' => 'crud-test-permission',
        ])->assertRedirect(route('admin.permissions.index'));

        $permission = Permission::where('name', 'crud-test-permission')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.permissions.update', $permission), [
            'name' => 'updated-crud-permission',
        ])->assertRedirect(route('admin.permissions.index'));

        $this->assertDatabaseHas('permissions', [
            'id' => $permission->id,
            'name' => 'updated-crud-permission',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.permissions.destroy', $permission))
            ->assertRedirect(route('admin.permissions.index'));

        $this->assertNull(Permission::find($permission->id));
    }

    public function test_admin_can_update_sandbox_gateway_without_live_credentials(): void
    {
        $gateway = PaymentGateway::where('slug', 'stripe')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.payment-gateways.update', $gateway), [
            'mode' => 'sandbox',
            'is_active' => '1',
            'sandbox_config' => [
                'secret_key' => 'sk_test_sandbox_only',
                'publishable_key' => 'pk_test_sandbox_only',
                'currency' => 'USD',
            ],
        ])->assertRedirect(route('admin.payment-gateways.index'));

        $credentials = $gateway->credentials()->firstOrFail()->refresh();
        $this->assertSame('pk_test_sandbox_only', $credentials->sandbox_config['publishable_key']);
    }

    public function test_admin_can_update_payment_gateway_configuration(): void
    {
        $gateway = PaymentGateway::where('slug', 'stripe')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.payment-gateways.update', $gateway), [
            'mode' => 'sandbox',
            'is_active' => '1',
            'sandbox_config' => [
                'secret_key' => 'sk_test_crud_gateway',
                'publishable_key' => 'pk_test_crud_gateway',
                'currency' => 'USD',
            ],
            'live_config' => [
                'secret_key' => 'sk_live_crud_gateway',
                'publishable_key' => 'pk_live_crud_gateway',
                'currency' => 'USD',
            ],
        ])->assertRedirect(route('admin.payment-gateways.index'));

        $gateway->refresh();

        $this->assertTrue($gateway->is_active);
        $this->assertSame(PaymentGateway::MODE_SANDBOX, $gateway->mode);

        $credentials = $gateway->credentials()->firstOrFail();
        $this->assertSame('USD', $credentials->sandbox_config['currency']);
        $this->assertSame('pk_test_crud_gateway', $credentials->sandbox_config['publishable_key']);
    }

    public function test_admin_can_view_reports_hub_and_analytical_pages(): void
    {
        $subscription = Subscription::firstOrFail();

        Payment::create([
            'user_id' => $this->admin->id,
            'payable_type' => Subscription::class,
            'payable_id' => $subscription->id,
            'amount' => 49.99,
            'currency' => 'USD',
            'payment_method' => 'stripe',
            'status' => Payment::STATUS_COMPLETED,
            'paid_at' => now(),
        ]);

        $property = Property::firstOrFail();
        PropertyBooking::create([
            'user_id' => $this->admin->id,
            'property_id' => $property->id,
            'full_name' => 'Reports Test Guest',
            'email' => 'reports-guest@test.test',
            'phone' => '+1 555 0606',
            'check_in_date' => now()->subWeek()->toDateString(),
            'check_out_date' => now()->subDays(3)->toDateString(),
            'guests' => 2,
            'total_price' => 299.00,
            'status' => PropertyBooking::STATUS_CONFIRMED,
        ]);

        $dateRange = [
            'start_date' => now()->subMonth()->toDateString(),
            'end_date' => now()->toDateString(),
        ];

        $this->actingAsSuperAdmin()->get(route('admin.reports.index'))
            ->assertOk()
            ->assertSee('Report', false);

        $this->actingAsSuperAdmin()->get(route('admin.reports.payments', $dateRange))
            ->assertOk()
            ->assertSee('Revenue', false);

        $this->actingAsSuperAdmin()->get(route('admin.reports.bookings', $dateRange))
            ->assertOk()
            ->assertSee('Booking', false);

        $this->actingAsSuperAdmin()->get(route('admin.reports.properties', $dateRange))
            ->assertOk()
            ->assertSee('Occupancy', false);
    }
}
