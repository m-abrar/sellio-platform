<?php

namespace App\Services;

use App\Models\PaymentGateway;
use Illuminate\Support\Facades\Log;

class StripeCheckoutConfigService
{
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
