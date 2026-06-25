<?php

namespace App\Services;

use App\Models\PaymentGateway;
use Illuminate\Support\Facades\Log;

class StripeCheckoutConfigService
{
    /**
     * Returns all active gateways with their frontend configs for the checkout UI.
     */
    public function resolveCheckoutGateways(GatewayManager $manager, string $context = 'checkout'): array
    {
        $gateways = PaymentGateway::query()
            ->where('is_active', true)
            ->with('credentials')
            ->orderBy('sort_order')
            ->get();

        $result = [];
        foreach ($gateways as $gateway) {
            try {
                $result[] = [
                    'slug'   => $gateway->slug,
                    'title'  => $gateway->title,
                    'config' => $manager->resolve($gateway)->getFrontendConfig(),
                ];
            } catch (\Exception $e) {
                Log::warning("Could not load gateway [{$gateway->slug}] for checkout.", [
                    'context' => $context,
                    'error'   => $e->getMessage(),
                ]);
            }
        }

        return $result;
    }

    public function resolvePublishableKey(GatewayManager $manager, string $context = 'checkout'): ?string
    {
        $stripeGateway = PaymentGateway::query()
            ->where('slug', 'stripe')
            ->where('is_active', true)
            ->with('credentials')
            ->first();

        if (!$stripeGateway) {
            return null;
        }

        try {
            return $manager->resolve($stripeGateway)->getFrontendConfig()['publishable_key'] ?? null;
        } catch (\Exception $e) {
            Log::warning('Unable to load Stripe frontend config.', [
                'context' => $context,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
