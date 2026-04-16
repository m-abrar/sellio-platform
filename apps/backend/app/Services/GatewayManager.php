<?php

// app/Services/GatewayManager.php

namespace App\Services;

use App\Models\PaymentGateway;
use App\Contracts\PaymentGatewayService;
use Illuminate\Container\Container;

class GatewayManager
{
    /**
     * Dynamically resolves and initializes the correct payment service.
     */
    public function resolve(PaymentGateway $gateway): PaymentGatewayService
    {
        $className = $gateway->class_name; 
        $config = $gateway->active_config; // Accesses the JSON config via model accessor

        // Basic validation and instantiation using the container's makeWith
        if (!class_exists($className)) {
            throw new \Exception("Gateway class not found: {$className}");
        }

        // The container handles dependency injection, passing the config to the constructor
        return Container::getInstance()->makeWith($className, ['config' => $config]);
    }
}
