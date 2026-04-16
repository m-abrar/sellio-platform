<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GatewayManager; // Your custom Manager
use App\Models\PaymentGateway;    // Your Gateway Model
use Illuminate\Support\Facades\Log; // Added for explicit Log facade use

class CheckoutController extends Controller
{
    /**
     * Displays the checkout view, loading configurations for all active gateways.
     */
    public function showCheckout(GatewayManager $manager)
    {
        Log::info('Starting showCheckout process.');

        $activeGateways = PaymentGateway::where('is_active', true)
            ->with(['credentials', 'blueprints'])
            ->get();
        
        Log::debug('Active Gateways retrieved:', ['count' => $activeGateways->count(), 'slugs' => $activeGateways->pluck('slug')->toArray()]);

        $frontendConfigs = [];

        foreach ($activeGateways as $gateway) {
            Log::info("Attempting to process gateway: {$gateway->slug}");

            // Log a snippet of the decrypted config
            Log::debug("Gateway {$gateway->slug} active_config (first few keys):", array_intersect_key((array)$gateway->active_config, array_flip(['publishable_key', 'mode'])));


            try {
                // 2. Resolve the concrete service instance using your Manager
                $service = $manager->resolve($gateway);
                
                // 3. Get the frontend-specific configuration (keys)
                $config = $service->getFrontendConfig();
                Log::debug("Gateway {$gateway->slug} frontend config resolved.", $config);

                $frontendConfigs[$gateway->slug] = $config;

                // Log a success message for this gateway
                Log::info("Successfully loaded service and frontend config for {$gateway->slug}");

            } catch (\Exception $e) {
                // Log and skip any misconfigured/broken gateway services
                Log::error("Failed to load gateway service for {$gateway->slug}. Error: " . $e->getMessage());
                // It's helpful to know the exact file and line where the service crashed
                Log::error("Exception trace: {$e->getFile()} on line {$e->getLine()}");
                
                continue; 
            }
        }
        
        // --- DEBUG POINT 4: Final output check (non-interrupting) ---
        // Log the final configuration array being sent to the Blade view
        Log::debug('Frontend Configs ready to be passed to view:', $frontendConfigs);
        
        // Example dynamic order data (Replace with your actual order/invoice data)
        $orderData = [
            'amount' => rand(10,50),
            'currency' => 'USD',
            'id' => rand(1000, 5000),
            'description' => 'Testing gateway',
        ];
        
        Log::debug('Order Data being passed to view:', $orderData);

        return view('checkout', [
            'activeGateways' => $activeGateways,
            'frontendConfigs' => $frontendConfigs,
            'orderData' => $orderData,
        ]);
    }


    /**
     * Processes the initial charge request from the checkout form.
     */
    public function processPayment(Request $request, GatewayManager $manager, string $gatewaySlug)
    {
        Log::info("Starting payment processing for gateway: {$gatewaySlug}");
        Log::debug('Incoming payment request data (sanitized):', $request->except(['_token', 'stripeToken', 'paymentToken']));

        // 1. Define the dedicated GET return route for 3D Secure redirect
        // We use 'checkout.confirm' (the GET route) as the return_url for Stripe.
        $returnUrl = route('checkout.confirm', ['gateway' => $gatewaySlug], true);
        Log::debug("Generated return URL for 3DS/SCA: {$returnUrl}");
        
        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->firstOrFail();
            Log::debug("Gateway model found for slug: {$gatewaySlug}");

            $service = $manager->resolve($gateway);
            Log::debug("Gateway service resolved successfully.");

            // Standardize token retrieval
            $token = $request->input('stripeToken') ?? $request->input('paymentToken');
            $amount = $request->input('amount') ?? 1.00; // Ensure you get the real amount
            
            Log::debug("Payment details: Amount={$amount}, Token present=" . (bool)$token);

            // 2. Call the charge method, passing the returnUrl
            $result = $service->charge($amount, $token, $returnUrl); 
            Log::info("Payment charge method returned result:", $result);


            // 3. Handle the response:
            
            // SUCCESS: Charge was approved instantly (e.g., no 3D Secure required)
            if ($result['status'] === 'successful') {
                // NOTE: Add your Order finalization logic here (e.g., update Order status, dispatch events)
                Log::notice("Payment successful. Redirecting to success page. Reference: {$result['reference']}");
                
                return redirect()->route('order.success')->with([
                    'success' => $result['message'],
                    'reference' => $result['reference'],
                ]);

            } 
            // PENDING_AUTH: 3D Secure is required. Redirect the user to the gateway's URL.
            elseif ($result['status'] === 'pending_auth' && !empty($result['redirect_url'])) {
                
                // Gateway needs the user to authenticate outside of your site.
                Log::notice("Payment requires 3D Secure. Redirecting to: {$result['redirect_url']}");
                return redirect($result['redirect_url']); 

            } 
            // FAILED or ERROR
            elseif ($result['status'] === 'failed' || $result['status'] === 'error') {
                Log::error("Payment failed for order: " . $result['message'], ['gateway' => $gatewaySlug, 'order_id' => $request->order_id ?? 'N/A']);

                return redirect()->route('checkout.index')->with('error', $result['message']);
            }
            
            // Default return for any unhandled status 
            $message = $result['message'] ?? 'Payment is still being processed or status is unhandled.';
            Log::warning("Unhandled payment status: {$result['status']}. Message: {$message}");
            return redirect()->route('checkout.index')->with('info', $message);

        } catch (\Exception $e) {
            Log::critical("Critical Payment Processing Error for {$gatewaySlug}: " . $e->getMessage(), [
                'file' => $e->getFile(), 
                'line' => $e->getLine()
            ]);
            return redirect()->route('checkout.index')->with('error', 'A severe error occurred during payment. Please try again or contact support.');
        }
    }

    /**
     * Handles the redirect back from 3D Secure/SCA verification.
     * Route: GET /checkout/confirm/{gateway}
     */
    public function confirmPayment(Request $request, GatewayManager $manager, string $gatewaySlug)
    {
        Log::info("Starting payment confirmation for gateway: {$gatewaySlug}");
        Log::debug('Incoming confirmation request data:', $request->all());


        // Stripe appends 'payment_intent' and 'payment_intent_client_secret'
        $paymentIntentId = $request->get('payment_intent');

        if (!$paymentIntentId) {
            Log::error('Payment confirmation failed: Missing payment_intent ID in URL.');
            return redirect()->route('checkout.index')->with('error', 'Payment confirmation failed: Missing intent ID.');
        }
        
        Log::debug("Payment Intent ID: {$paymentIntentId}");


        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->firstOrFail();
            $service = $manager->resolve($gateway);
            Log::debug("Gateway service resolved for confirmation.");


            // Call the service method to check the final Payment Intent status
            $result = $service->retrieveIntentStatus($paymentIntentId);
            Log::info("Intent status retrieval result for {$paymentIntentId}:", $result);


            if ($result['status'] === 'successful') {
                // Success: Finalize the order and redirect
                // NOTE: Add your Order finalization logic here. (Must be idempotent!)
                Log::notice("3DS/SCA confirmation successful. Finalizing order for intent: {$paymentIntentId}");

                return redirect()->route('order.success')->with([
                    'success' => $result['message'] ?? 'Payment confirmed successfully.',
                    'reference' => $paymentIntentId,
                ]);
            }
            
            // Handle pending or failed status after 3D secure
            Log::warning("Payment confirmation was not successful.");
            Log::warning("Status: " . $result['status'] ?? 'N/A.');
            Log::warning("Message: " . $result['message'] ?? 'No specific message.');

            return redirect()->route('checkout.index')->with('error', $result['message'] ?? 'Payment confirmation failed. Please try again.');

        } catch (\Exception $e) {
            Log::critical("Payment confirmation error for intent {$paymentIntentId}: " . $e->getMessage(), [
                'file' => $e->getFile(), 
                'line' => $e->getLine()
            ]);
            return redirect()->route('checkout.index')->with('error', 'A confirmation error occurred. Please try again.');
        }
    }


    /**
     * Displays the success page.
     */
    public function showSuccess(Request $request)
    {
        Log::info('Displaying order success page.');

        // Example: Retrieve data passed via the session
        $reference = $request->session()->get('reference', 'N/A');
        $message = $request->session()->get('success', 'Your order was placed successfully.');
        
        Log::debug('Success page data:', ['reference' => $reference, 'message' => $message]);


        return view('success', [
            'reference' => $reference,
            'message' => $message,
        ]);
    }
}
