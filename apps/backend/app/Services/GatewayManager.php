<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Models\PaymentGateway;
use Exception;
use Illuminate\Container\Container;

class GatewayManager
{
    /**
     * Map of allowed gateway identifiers to their respective service classes.
     */
    protected array $gatewayMap = [
        'stripe'       => StripeGatewayService::class,
        'paypal'       => PaypalGatewayService::class,
        'razorpay'     => RazorpayGatewayService::class,
        'flutterwave'  => FlutterwaveGatewayService::class,
        'mollie'       => MollieGatewayService::class,
        'paystack'     => PaystackGatewayService::class,
    ];

    /**
     * Resolves and initializes the correct payment service using a secure whitelist.
     */
    public function resolve(PaymentGateway $gateway): PaymentGatewayService
    {
        $key = $gateway->slug; // Using 'slug' as the unique identifier
        
        if (!isset($this->gatewayMap[$key])) {
            throw new Exception("Unsupported or unauthorized gateway: {$key}");
        }

        $className = $this->gatewayMap[$key];
        $config = $gateway->active_config;

        return Container::getInstance()->makeWith($className, ['config' => $config]);
    }
}
