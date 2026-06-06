<?php

namespace Tests\Feature;

use App\Contracts\PaymentGatewayService;
use App\Models\PaymentGateway;
use App\Models\Plan;
use App\Models\Subscription;
use App\Services\GatewayManager;
use App\Services\SubscriptionCheckoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\Concerns\InteractsWithPartnerApi;
use Tests\TestCase;

class PartnerSubscriptionCheckoutTest extends TestCase
{
    use RefreshDatabase;
    use InteractsWithPartnerApi;

    public function test_partner_subscription_checkout_falls_back_to_direct_subscribe_when_stripe_inactive(): void
    {
        $partner = $this->createPartner(maxListings: null);
        $plan = Plan::create([
            'title' => 'Growth Plan',
            'slug' => 'growth-plan-checkout-test',
            'price' => 39.99,
            'billing_period' => 'monthly',
            'max_listings' => 10,
            'is_active' => true,
        ]);

        $response = $this->actingAs($partner, 'sanctum')
            ->getJson('/api/dashboard/partner/subscriptions/checkout?plan_id=' . $plan->id);

        $response->assertOk()
            ->assertJsonPath('data.checkout_url', null);

        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $partner->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
        ]);
    }

    public function test_subscription_checkout_service_detects_active_stripe_gateway(): void
    {
        PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => \App\Services\StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ])->credentials()->create([
            'sandbox_config' => [
                'secret_key' => 'sk_test_example',
                'publishable_key' => 'pk_test_example',
                'currency' => 'USD',
            ],
            'live_config' => [],
        ]);

        $this->assertTrue(app(\App\Services\SubscriptionCheckoutService::class)->isStripeCheckoutAvailable());
    }

    public function test_partner_checkout_returns_stripe_url_when_gateway_is_active(): void
    {
        $partner = $this->createPartner(maxListings: null);
        $plan = Plan::create([
            'title' => 'Pro Plan',
            'slug' => 'pro-plan-checkout-url-test',
            'price' => 49.99,
            'billing_period' => 'monthly',
            'max_listings' => 25,
            'is_active' => true,
        ]);

        $this->mock(SubscriptionCheckoutService::class, function ($mock) {
            $mock->shouldReceive('isStripeCheckoutAvailable')->once()->andReturn(true);
            $mock->shouldReceive('createCheckoutSession')
                ->once()
                ->andReturn('https://checkout.stripe.com/c/pay/cs_test_partner_subscription');
        });

        $this->actingAs($partner, 'sanctum')
            ->getJson('/api/dashboard/partner/subscriptions/checkout?plan_id=' . $plan->id)
            ->assertOk()
            ->assertJsonPath('data.checkout_url', 'https://checkout.stripe.com/c/pay/cs_test_partner_subscription');

        $this->assertDatabaseMissing('subscriptions', [
            'user_id' => $partner->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
        ]);
    }

    public function test_partner_can_confirm_checkout_session_without_webhook(): void
    {
        $partner = $this->createPartner(maxListings: null);
        $plan = Plan::create([
            'title' => 'Confirm Plan',
            'slug' => 'confirm-plan-checkout-test',
            'price' => 19.99,
            'billing_period' => 'monthly',
            'max_listings' => 5,
            'is_active' => true,
        ]);

        $fakeService = Mockery::mock(\App\Services\StripeGatewayService::class);
        $fakeService->shouldReceive('confirmSubscriptionCheckoutSession')
            ->once()
            ->with('cs_test_confirm_123', Mockery::on(fn ($user) => $user->id === $partner->id))
            ->andReturn([
                'plan_id' => $plan->id,
                'session_id' => 'cs_test_confirm_123',
            ]);

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
                'publishable_key' => 'pk_test_example',
                'currency' => 'USD',
            ],
            'live_config' => [],
        ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeService) {
            $mock->shouldReceive('resolve')->andReturn($fakeService);
        });

        $this->actingAs($partner, 'sanctum')
            ->getJson('/api/dashboard/partner/subscriptions/confirm?session_id=cs_test_confirm_123')
            ->assertOk();

        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $partner->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
        ]);
    }

    public function test_stripe_webhook_checkout_session_completed_activates_subscription(): void
    {
        $partner = $this->createPartner(maxListings: null);
        $plan = Plan::create([
            'title' => 'Webhook Plan',
            'slug' => 'webhook-plan-checkout-test',
            'price' => 29.99,
            'billing_period' => 'monthly',
            'max_listings' => 15,
            'is_active' => true,
        ]);

        PaymentGateway::create([
            'title' => 'Stripe',
            'slug' => 'stripe',
            'class_name' => \App\Services\StripeGatewayService::class,
            'is_active' => true,
            'mode' => PaymentGateway::MODE_SANDBOX,
        ])->credentials()->create([
            'sandbox_config' => [
                'secret_key' => 'sk_test_example',
                'publishable_key' => 'pk_test_example',
                'webhook_secret' => 'whsec_test_example',
                'currency' => 'USD',
            ],
            'live_config' => [],
        ]);

        $fakeService = Mockery::mock(PaymentGatewayService::class);
        $fakeService->shouldReceive('handleWebhook')
            ->once()
            ->andReturn([
                'status' => 'processed',
                'subscription_user_id' => (string) $partner->id,
                'subscription_plan_id' => (string) $plan->id,
                'payment_status' => 'paid',
                'message' => 'Partner subscription checkout completed.',
            ]);

        $this->mock(GatewayManager::class, function ($mock) use ($fakeService) {
            $mock->shouldReceive('resolve')->once()->andReturn($fakeService);
        });

        $this->postJson('/webhooks/stripe', ['type' => 'checkout.session.completed'])
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $partner->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
        ]);
    }
}
