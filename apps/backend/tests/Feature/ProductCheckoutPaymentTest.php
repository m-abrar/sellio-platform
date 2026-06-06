<?php

namespace Tests\Feature;

use App\Contracts\PaymentGatewayService;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Services\GatewayManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Tests\TestCase;

class ProductCheckoutPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Setting::set('built_in_website_status', 'active');
        Setting::set('is_section.products', '1');
        Cache::forget('settings_all');
    }

    public function test_product_checkout_uses_stripe_elements_when_gateway_is_configured(): void
    {
        [$user] = $this->createCartWithProduct();
        $this->createStripeGateway(publishableKey: 'pk_test_product_checkout');

        $this->actingAs($user)
            ->get(route('checkout.index'))
            ->assertOk()
            ->assertSee('https://js.stripe.com/v3/', false)
            ->assertSee('pk_test_product_checkout', false)
            ->assertSee('data-stripe-card-element', false)
            ->assertSee('data-stripe-payment-token', false);
    }

    public function test_product_stripe_payment_creates_paid_order_and_payment_record(): void
    {
        [$user] = $this->createCartWithProduct(unitPrice: 50, quantity: 2);
        $this->createStripeGateway();

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('charge')
            ->once()
            ->withArgs(function (float $amount, string $token, string $returnUrl, array $metadata) {
                return $amount === 100.0
                    && $token === 'pm_card_visa'
                    && str_contains($returnUrl, '/checkout/confirm/stripe/')
                    && ($metadata['purpose'] ?? null) === 'product_order'
                    && !empty($metadata['order_id']);
            })
            ->andReturn([
                'status' => 'successful',
                'reference' => 'pi_product_order_success',
                'message' => 'Payment processed successfully via Stripe.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->post(route('checkout.process', 'stripe'), $this->validCheckoutPayload())
            ->assertRedirect(route('checkout.order.success'));

        $order = Order::query()->firstOrFail();

        $this->assertSame('paid', $order->payment_status);
        $this->assertSame(Order::STATUS_PROCESSING, $order->status);
        $this->assertSame('stripe', $order->payment_method);
        $this->assertSame('100.00', (string) $order->total_amount);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 100,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_product_order_success',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
    }

    public function test_product_stripe_failure_marks_order_failed_and_records_payment(): void
    {
        [$user] = $this->createCartWithProduct(unitPrice: 40, quantity: 1);
        $this->createStripeGateway();

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('charge')
            ->once()
            ->andReturn([
                'status' => 'failed',
                'reference' => 'pi_product_order_failed',
                'message' => 'Stripe reported a charge failure.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->from(route('checkout.index'))
            ->post(route('checkout.process', 'stripe'), $this->validCheckoutPayload())
            ->assertRedirect(route('checkout.index'));

        $order = Order::query()->firstOrFail();

        $this->assertSame('failed', $order->payment_status);
        $this->assertSame(Order::STATUS_CANCELLED, $order->status);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 40,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_product_order_failed',
            'status' => Payment::STATUS_FAILED,
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
    }

    public function test_product_stripe_auth_return_confirms_order_and_records_payment(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => 'unpaid',
            'payment_method' => 'stripe',
            'subtotal' => 55,
            'shipping_cost' => 0,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 55,
        ]);
        $this->createStripeGateway();

        $fakeGateway = Mockery::mock(PaymentGatewayService::class);
        $fakeGateway->shouldReceive('retrieveIntentStatus')
            ->once()
            ->with('pi_product_order_auth')
            ->andReturn([
                'status' => 'successful',
                'reference' => 'pi_product_order_auth',
                'message' => 'Payment confirmed successfully.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeGateway) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeGateway);
        });

        $this->actingAs($user)
            ->get(route('checkout.confirm', ['gateway' => 'stripe', 'order' => $order->id]) . '?payment_intent=pi_product_order_auth')
            ->assertRedirect(route('checkout.order.success'));

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => Order::STATUS_PROCESSING,
            'payment_status' => 'paid',
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 55,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_product_order_auth',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
    }

    public function test_stripe_webhook_payment_intent_succeeded_fulfills_product_order_and_records_payment(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => Order::STATUS_PENDING,
            'payment_status' => 'unpaid',
            'payment_method' => 'stripe',
            'subtotal' => 75,
            'shipping_cost' => 0,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => 75,
        ]);
        $this->createStripeGateway();

        $fakeService = Mockery::mock(PaymentGatewayService::class);
        $fakeService->shouldReceive('handleWebhook')
            ->once()
            ->andReturn([
                'status' => 'processed',
                'order_id' => (string) $order->id,
                'payment_status' => 'paid',
                'reference' => 'pi_product_order_webhook',
                'message' => 'Product order payment completed.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeService) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeService);
        });

        $this->postJson('/webhooks/stripe', ['type' => 'payment_intent.succeeded'])
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => Order::STATUS_PROCESSING,
            'payment_status' => 'paid',
        ]);

        $this->assertDatabaseHas('payments', [
            'user_id' => $user->id,
            'amount' => 75,
            'payment_method' => 'stripe',
            'transaction_id' => 'pi_product_order_webhook',
            'status' => Payment::STATUS_COMPLETED,
            'payable_type' => Order::class,
            'payable_id' => $order->id,
        ]);
    }

    private function createCartWithProduct(float $unitPrice = 50, int $quantity = 1): array
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'base_price' => $unitPrice,
            'sale_price' => null,
            'on_sale' => false,
            'manage_stock' => true,
            'stock_quantity' => 10,
        ]);
        $cart = Cart::create(['user_id' => $user->id]);

        $item = new CartItem([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => $quantity,
            'attribute_ids' => [],
            'addon_ids' => [],
        ]);
        $item->unit_price = $unitPrice;
        $item->save();

        return [$user, $cart, $product];
    }

    private function validCheckoutPayload(array $overrides = []): array
    {
        return array_merge([
            'shipping_name' => 'Ada Lovelace',
            'shipping_address' => '123 Market Street',
            'shipping_city' => 'New York',
            'shipping_state' => 'NY',
            'shipping_zip' => '10001',
            'shipping_country' => 'United States',
            'payment_method' => 'stripe',
            'payment_token' => 'pm_card_visa',
        ], $overrides);
    }

    private function createStripeGateway(string $publishableKey = 'pk_test_product_checkout'): PaymentGateway
    {
        $gateway = PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => \App\Services\StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ]);

        $gateway->credentials()->create([
            'sandbox_config' => [
                'secret_key' => 'sk_test_example',
                'publishable_key' => $publishableKey,
                'webhook_secret' => 'whsec_test_example',
                'currency' => 'USD',
            ],
            'live_config' => [],
        ]);

        return $gateway;
    }
}
