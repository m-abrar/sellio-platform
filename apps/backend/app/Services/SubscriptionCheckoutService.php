<?php

namespace App\Services;

use App\Models\PaymentGateway;
use App\Models\Plan;
use App\Models\User;

class SubscriptionCheckoutService
{
    public function __construct(
        protected GatewayManager $gatewayManager,
    ) {
    }

    public function isStripeCheckoutAvailable(): bool
    {
        return $this->activeStripeGateway() !== null;
    }

    public function createCheckoutSession(User $user, Plan $plan): string
    {
        if ($plan->price <= 0) {
            throw new \InvalidArgumentException('Free plans do not require Stripe checkout.');
        }

        $gateway = $this->activeStripeGateway();

        if (!$gateway) {
            throw new \RuntimeException('Stripe is not configured for subscription checkout.');
        }

        $service = $this->gatewayManager->resolve($gateway);

        if (!method_exists($service, 'createSubscriptionCheckoutSession')) {
            throw new \RuntimeException('Stripe subscription checkout is unavailable.');
        }

        $sellerAppUrl = rtrim((string) config('app.seller_app_url', config('app.url')), '/');

        return $service->createSubscriptionCheckoutSession(
            $user,
            $plan,
            "{$sellerAppUrl}/dashboard/memberships?subscription=success",
            "{$sellerAppUrl}/dashboard/memberships?subscription=cancelled",
        );
    }

    protected function activeStripeGateway(): ?PaymentGateway
    {
        $gateway = PaymentGateway::query()
            ->where('slug', 'stripe')
            ->where('is_active', true)
            ->with('credentials')
            ->first();

        if (!$gateway) {
            return null;
        }

        $config = $gateway->active_config ?? [];

        return !empty($config['secret_key']) ? $gateway : null;
    }
}
