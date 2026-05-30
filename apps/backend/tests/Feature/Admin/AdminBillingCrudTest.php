<?php

namespace Tests\Feature\Admin;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Subscription;
use App\Models\SubscriptionQuota;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminBillingCrudTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_can_create_update_renew_and_delete_subscription(): void
    {
        $plan = Plan::where('slug', 'test-plan')->firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.subscriptions.store'), [
            'user_id' => $this->admin->id,
            'plan_id' => $plan->id,
            'title' => 'CRUD Test Subscription',
            'status' => Subscription::STATUS_ACTIVE,
            'starts_at' => now()->subDay()->toDateTimeString(),
            'ends_at' => now()->addWeek()->toDateTimeString(),
        ])->assertRedirect(route('admin.subscriptions.index'));

        $subscription = Subscription::where('title', 'CRUD Test Subscription')->firstOrFail();
        $originalEndsAt = $subscription->ends_at;

        $this->actingAsSuperAdmin()->put(route('admin.subscriptions.update', $subscription), [
            'user_id' => $this->admin->id,
            'plan_id' => $plan->id,
            'title' => 'Updated CRUD Subscription',
            'status' => Subscription::STATUS_ON_TRIAL,
            'starts_at' => now()->subDay()->toDateTimeString(),
            'ends_at' => now()->addWeeks(2)->toDateTimeString(),
        ])->assertRedirect(route('admin.subscriptions.index'));

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'title' => 'Updated CRUD Subscription',
            'status' => Subscription::STATUS_ON_TRIAL,
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.subscriptions.renew', $subscription))
            ->assertRedirect();

        $subscription->refresh();
        $this->assertSame(Subscription::STATUS_ACTIVE, $subscription->status);
        $this->assertTrue($subscription->ends_at->gt($originalEndsAt));

        $this->actingAsSuperAdmin()->delete(route('admin.subscriptions.destroy', $subscription))
            ->assertRedirect(route('admin.subscriptions.index'));

        $this->assertNull(Subscription::find($subscription->id));
    }

    public function test_admin_can_update_and_delete_payment(): void
    {
        $subscription = Subscription::firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.payments.store'), [
            'user_id' => $this->admin->id,
            'payable_id' => $subscription->id,
            'payable_type' => Subscription::class,
            'amount' => 19.99,
            'currency' => 'USD',
            'payment_method' => 'manual',
            'status' => 'pending',
            'transaction_id' => 'TXN-CRUD-001',
        ])->assertRedirect(route('admin.payments.index'));

        $payment = Payment::where('transaction_id', 'TXN-CRUD-001')->firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.payments.update', $payment), [
            'user_id' => $this->admin->id,
            'payable_id' => $subscription->id,
            'payable_type' => Subscription::class,
            'amount' => 29.99,
            'currency' => 'USD',
            'payment_method' => 'bank_transfer',
            'status' => 'completed',
            'transaction_id' => 'TXN-CRUD-001-UPDATED',
        ])->assertRedirect(route('admin.payments.index'));

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'amount' => '29.99',
            'status' => 'completed',
            'transaction_id' => 'TXN-CRUD-001-UPDATED',
        ]);

        $this->actingAsSuperAdmin()->delete(route('admin.payments.destroy', $payment))
            ->assertRedirect(route('admin.payments.index'));

        $this->assertNull(Payment::find($payment->id));
    }

    public function test_admin_can_create_manual_order_and_update_status(): void
    {
        Notification::fake();

        $product = Product::firstOrFail();

        $this->actingAsSuperAdmin()->post(route('admin.product-orders.store'), [
            'user_id' => $this->admin->id,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'unit_price' => 29.99,
                ],
            ],
            'status' => Order::STATUS_PENDING,
            'shipping_name' => 'CRUD Test Buyer',
            'shipping_address' => '123 Test Street',
            'shipping_city' => 'Austin',
            'shipping_zip' => '78701',
            'subtotal' => 59.98,
            'shipping_cost' => 5.00,
            'total_amount' => 64.98,
            'notes' => 'Created by admin order CRUD test.',
        ])->assertRedirect(route('admin.product-orders.index'));

        $order = Order::where('shipping_name', 'CRUD Test Buyer')->firstOrFail();
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.product-orders.update-status', $order), [
            'status' => Order::STATUS_PROCESSING,
            'tracking_number' => 'TRK-CRUD-001',
        ])->assertRedirect();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => Order::STATUS_PROCESSING,
            'tracking_number' => 'TRK-CRUD-001',
        ]);
    }

    public function test_admin_can_bulk_update_order_status(): void
    {
        Notification::fake();

        $orders = Order::factory()->count(2)->create(['status' => Order::STATUS_PENDING]);

        $this->actingAsSuperAdmin()->post(route('admin.product-orders.bulk-update'), [
            'ids' => $orders->pluck('id')->all(),
            'bulk_status' => Order::STATUS_PROCESSING,
        ])->assertRedirect();

        foreach ($orders as $order) {
            $this->assertDatabaseHas('orders', [
                'id' => $order->id,
                'status' => Order::STATUS_PROCESSING,
            ]);
        }
    }

    public function test_admin_can_update_and_reset_subscription_quota(): void
    {
        $quota = SubscriptionQuota::firstOrFail();

        $this->actingAsSuperAdmin()->put(route('admin.subscription-quotas.update', $quota), [
            'listings_used' => 7,
            'featured_used' => 2,
        ])->assertRedirect(route('admin.subscription-quotas.index'));

        $this->assertDatabaseHas('subscription_quotas', [
            'id' => $quota->id,
            'listings_used' => 7,
            'featured_used' => 2,
        ]);

        $this->actingAsSuperAdmin()->post(route('admin.subscription-quotas.reset', $quota))
            ->assertRedirect();

        $this->assertDatabaseHas('subscription_quotas', [
            'id' => $quota->id,
            'listings_used' => 0,
            'featured_used' => 0,
        ]);
    }

    public function test_admin_can_create_update_and_delete_role(): void
    {
        $permissions = Permission::limit(3)->pluck('id')->all();

        $this->actingAsSuperAdmin()->post(route('admin.roles.store'), [
            'name' => 'crud-test-role',
            'permissions' => $permissions,
        ])->assertRedirect(route('admin.roles.index'));

        $role = Role::where('name', 'crud-test-role')->firstOrFail();
        $this->assertCount(3, $role->permissions);

        $updatedPermissions = Permission::limit(2)->pluck('id')->all();

        $this->actingAsSuperAdmin()->put(route('admin.roles.update', $role), [
            'name' => 'updated-crud-role',
            'permissions' => $updatedPermissions,
        ])->assertRedirect(route('admin.roles.index'));

        $role->refresh();
        $this->assertSame('updated-crud-role', $role->name);
        $this->assertCount(2, $role->permissions);

        $this->actingAsSuperAdmin()->delete(route('admin.roles.destroy', $role))
            ->assertRedirect(route('admin.roles.index'));

        $this->assertNull(Role::find($role->id));
    }
}
