<?php

namespace Tests\Feature;

use App\Models\GatewayCredential;
use App\Models\PaymentGateway;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
