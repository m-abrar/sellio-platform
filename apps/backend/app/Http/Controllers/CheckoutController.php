<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use App\Services\GatewayManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\CartService;
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
     * @param  \App\Services\CartService  $cartService
     * @return \Illuminate\View\View
     */
    public function showCheckout(GatewayManager $manager, CartService $cartService): View
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
        
        // Secure Price Retrieval: Fetch current active cart and calculate total on the server.
        $cart = $cartService->getOrCreateCart();
        
        if ($cart->items->isEmpty()) {
             // In a real scenario, we might redirect back to cart
             // return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $orderData = [
            'amount'      => $cart->calculateTotal(),
            'currency'    => 'USD',
            'id'          => $cart->id,
            'description' => __('Marketplace Purchase - Order #:id', ['id' => $cart->id]),
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
            
            // SECURITY: Never take the amount from the request. Recalculate from the source of truth (Cart).
            $cart = app(CartService::class)->getOrCreateCart();
            $amount = $cart->calculateTotal();
            
            if ($amount <= 0) {
                return redirect()->route('cart.index')->with('error', __('Invalid order amount.'));
            }

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
