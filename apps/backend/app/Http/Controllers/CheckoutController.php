<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use App\Services\GatewayManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Class CheckoutController
 * Orchestrates the multi-gateway checkout process, payment initiation, and 3D Secure confirmation.
 */
class CheckoutController extends Controller
{
    /**
     * Display the checkout interface with all active payment gateway configurations.
     *
     * @param  \App\Services\GatewayManager  $manager
     * @return \Illuminate\View\View
     */
    public function showCheckout(GatewayManager $manager): View
    {
        $activeGateways = PaymentGateway::where('is_active', true)
            ->with(['credentials', 'blueprints'])
            ->get();
        
        $frontendConfigs = [];

        foreach ($activeGateways as $gateway) {
            try {
                $service = $manager->resolve($gateway);
                $frontendConfigs[$gateway->slug] = $service->getFrontendConfig();
            } catch (\Exception $e) {
                Log::error("Failed to load gateway service for {$gateway->slug}: " . $e->getMessage());
                continue; 
            }
        }
        
        // Mock order data - In production, this should be retrieved from a Cart or PendingOrder model.
        $orderData = [
            'amount'      => rand(10, 50),
            'currency'    => 'USD',
            'id'          => rand(1000, 5000),
            'description' => 'Marketplace Purchase',
        ];

        return view('checkout', [
            'activeGateways'  => $activeGateways,
            'frontendConfigs' => $frontendConfigs,
            'orderData'       => $orderData,
        ]);
    }

    /**
     * Process the initial payment charge request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\GatewayManager  $manager
     * @param  string  $gatewaySlug
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processPayment(Request $request, GatewayManager $manager, string $gatewaySlug): RedirectResponse
    {
        $returnUrl = route('checkout.confirm', ['gateway' => $gatewaySlug], true);
        
        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->firstOrFail();
            $service = $manager->resolve($gateway);

            $token = $request->input('stripeToken') ?? $request->input('paymentToken');
            $amount = $request->input('amount') ?? 1.00;
            
            $result = $service->charge($amount, $token, $returnUrl); 

            // Handle successful instant charge
            if ($result['status'] === 'successful') {
                Log::info("Payment successful via {$gatewaySlug}. Ref: {$result['reference']}");
                
                return redirect()->route('order.success')->with([
                    'success'   => $result['message'],
                    'reference' => $result['reference'],
                ]);
            } 
            
            // Handle 3D Secure / SCA redirection
            if ($result['status'] === 'pending_auth' && !empty($result['redirect_url'])) {
                return redirect($result['redirect_url']); 
            } 

            // Handle failed or erroneous response
            if ($result['status'] === 'failed' || $result['status'] === 'error') {
                Log::warning("Payment failed via {$gatewaySlug}: " . $result['message']);
                return redirect()->route('checkout.index')->with('error', $result['message']);
            }
            
            return redirect()->route('checkout.index')->with('info', $result['message'] ?? 'Payment status unhandled.');

        } catch (\Exception $e) {
            Log::critical("Critical Checkout Error [{$gatewaySlug}]: " . $e->getMessage());
            return redirect()->route('checkout.index')->with('error', 'A severe error occurred during payment. Please contact support.');
        }
    }

    /**
     * Handle the asynchronous confirmation return from 3D Secure / SCA providers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\GatewayManager  $manager
     * @param  string  $gatewaySlug
     * @return \Illuminate\Http\RedirectResponse
     */
    public function confirmPayment(Request $request, GatewayManager $manager, string $gatewaySlug): RedirectResponse
    {
        $paymentIntentId = $request->get('payment_intent');

        if (!$paymentIntentId) {
            Log::error('Payment confirmation failed: Missing payment_intent ID.');
            return redirect()->route('checkout.index')->with('error', 'Payment confirmation failed: Missing intent ID.');
        }
        
        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->firstOrFail();
            $service = $manager->resolve($gateway);

            $result = $service->retrieveIntentStatus($paymentIntentId);

            if ($result['status'] === 'successful') {
                Log::notice("3DS Confirmation Success for intent: {$paymentIntentId}");

                return redirect()->route('order.success')->with([
                    'success'   => $result['message'] ?? 'Payment confirmed successfully.',
                    'reference' => $paymentIntentId,
                ]);
            }
            
            Log::warning("3DS Confirmation Failed for intent: {$paymentIntentId}. Status: " . ($result['status'] ?? 'N/A'));
            return redirect()->route('checkout.index')->with('error', $result['message'] ?? 'Payment confirmation failed.');

        } catch (\Exception $e) {
            Log::critical("Payment confirmation error for intent {$paymentIntentId}: " . $e->getMessage());
            return redirect()->route('checkout.index')->with('error', 'A confirmation error occurred. Please try again.');
        }
    }

    /**
     * Display the order success confirmation view.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function showSuccess(Request $request): View
    {
        $reference = $request->session()->get('reference', 'N/A');
        $message = $request->session()->get('success', 'Your order was placed successfully.');
        
        return view('success', [
            'reference' => $reference,
            'message'   => $message,
        ]);
    }
}
