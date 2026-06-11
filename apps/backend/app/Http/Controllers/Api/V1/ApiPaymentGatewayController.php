<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Services\GatewayManager;
use App\Services\StripeCheckoutConfigService;
use Exception;
use Illuminate\Http\JsonResponse;

class ApiPaymentGatewayController extends Controller
{
    public function index(
        GatewayManager $manager,
        StripeCheckoutConfigService $stripeCheckoutConfig
    ): JsonResponse {
        $gateways = PaymentGateway::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $payload = $gateways->map(function (PaymentGateway $gateway) use ($manager, $stripeCheckoutConfig) {
            $entry = [
                'slug'  => $gateway->slug,
                'title' => $gateway->title,
                'mode'  => $gateway->mode,
            ];

            if ($gateway->slug === 'stripe') {
                $entry['frontend_config'] = [
                    'publishable_key' => $stripeCheckoutConfig->resolvePublishableKey($manager, 'product_checkout'),
                ];
            } else {
                try {
                    $entry['frontend_config'] = $manager->resolve($gateway)->getFrontendConfig();
                } catch (Exception) {
                    $entry['frontend_config'] = [];
                }
            }

            return $entry;
        });

        return $this->successResponse($payload->values());
    }
}
