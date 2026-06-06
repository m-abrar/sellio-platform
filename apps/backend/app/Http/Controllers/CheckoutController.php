<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use App\Models\Payment;
use App\Services\GatewayManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Http\Requests\StoreOrderRequest;
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
    public function showCheckout(GatewayManager $manager, CartService $cartService): View|RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', __('Please sign in to complete checkout.'));
        }

        // Secure Price Retrieval: Fetch current active cart and calculate total on the server.
        $cart = $cartService->getOrCreateCart();

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', __('Your cart is empty.'));
        }

        $stripePublishableKey = null;
        $stripeGateway = PaymentGateway::query()
            ->where('slug', 'stripe')
            ->where('is_active', true)
            ->with(['credentials', 'blueprints'])
            ->first();

        if ($stripeGateway) {
            try {
                $stripePublishableKey = $manager->resolve($stripeGateway)->getFrontendConfig()['publishable_key'] ?? null;
            } catch (\Exception $e) {
                Log::error("Failed to load Stripe checkout config: " . $e->getMessage());
            }
        }

        $orderData = [
            'amount'      => $cart->calculateTotal(),
            'currency'    => 'USD',
            'id'          => $cart->id,
            'description' => __('Marketplace Purchase - Order #:id', ['id' => $cart->id]),
        ];

        return view('frontend.products.checkout', [
            'cart' => $cart,
            'orderData' => $orderData,
            'stripePublishableKey' => $stripePublishableKey,
        ]);
    }

    /**
     * Process the initial payment charge request.
     *
     * @param  \App\Http\Requests\StoreOrderRequest  $request
     * @param  \App\Services\GatewayManager  $manager
     * @param  \App\Services\CheckoutService  $checkoutService
     * @param  string  $gatewaySlug
     * @return \Illuminate\Http\RedirectResponse
     */
    public function processPayment(StoreOrderRequest $request, GatewayManager $manager, CheckoutService $checkoutService, string $gatewaySlug): RedirectResponse
    {
        try {
            if (!Auth::check()) {
                return redirect()->route('login')->with('error', __('Please sign in to complete checkout.'));
            }

            $gateway = PaymentGateway::where('slug', $gatewaySlug)->where('is_active', true)->firstOrFail();
            $service = $manager->resolve($gateway);

            // SECURITY: Recalculate amount from the source of truth (Cart)
            $cart = app(CartService::class)->getOrCreateCart();
            
            if ($cart->items->isEmpty()) {
                return redirect()->route('cart.index')->with('error', __('Your cart is empty.'));
            }

            $token = $request->input('payment_token') ?? $request->input('stripeToken') ?? $request->input('paymentToken');

            if (!$token) {
                return redirect()->route('checkout.index')->with('error', __('Stripe payment details are required.'));
            }

            // 1. Persist the Order before charging (Pendings state)
            $order = $checkoutService->process($cart, $request->validated(), $gatewaySlug);
            
            $returnUrl = route('checkout.confirm', ['gateway' => $gatewaySlug, 'order' => $order->id], true);
            
            // 2. Execute Charge
            $result = $service->charge($order->total_amount, $token, $returnUrl, [
                'purpose'      => 'product_order',
                'order_id'     => $order->id,
                'order_number' => $order->order_number,
                'user_id'      => (string) $order->user_id,
                'description'  => __('Payment for Order #:num', ['num' => $order->order_number]),
            ]); 

            // 3. Handle Result
            if ($result['status'] === 'successful') {
                $checkoutService->recordOrderPayment(
                    $order,
                    $gatewaySlug,
                    (float) $order->total_amount,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? null,
                    $result['message'] ?? 'Product order payment completed.'
                );

                $order->update(['payment_status' => 'paid', 'status' => 'processing']);
                Log::info("Payment successful via {$gatewaySlug}. Order: {$order->order_number}");
                
                return redirect()->route('checkout.order.success')->with([
                    'success'   => $result['message'],
                    'reference' => $result['reference'],
                ]);
            } 
            
            if ($result['status'] === 'pending_auth' && !empty($result['redirect_url'])) {
                $checkoutService->recordOrderPayment(
                    $order,
                    $gatewaySlug,
                    (float) $order->total_amount,
                    Payment::STATUS_PENDING,
                    $result['reference'] ?? null,
                    $result['message'] ?? 'Product order payment requires authentication.'
                );

                return redirect($result['redirect_url']); 
            } 

            if ($result['status'] === 'failed' || $result['status'] === 'error') {
                $checkoutService->recordOrderPayment(
                    $order,
                    $gatewaySlug,
                    (float) $order->total_amount,
                    Payment::STATUS_FAILED,
                    $result['reference'] ?? null,
                    $result['message'] ?? 'Product order payment failed.'
                );

                $order->update(['status' => 'cancelled', 'payment_status' => 'failed', 'notes' => $result['message']]);
                Log::warning("Payment failed for order {$order->order_number}: " . $result['message']);
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
     * @param  \App\Models\Order  $order
     * @param  string  $gatewaySlug
     * @return \Illuminate\Http\RedirectResponse
     */
    public function confirmPayment(Request $request, GatewayManager $manager, CheckoutService $checkoutService, string $gatewaySlug, \App\Models\Order $order): RedirectResponse
    {
        if (!Auth::check() || Auth::id() !== $order->user_id) {
            abort(403, __('Unauthorized access.'));
        }

        $paymentIntentId = $request->get('payment_intent') ?? $request->get('token');

        if (!$paymentIntentId) {
            Log::error("Payment confirmation failed for order {$order->order_number}: Missing intent/token ID.");
            return redirect()->route('checkout.index')->with('error', 'Payment confirmation failed: Missing transaction ID.');
        }
        
        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->firstOrFail();
            $service = $manager->resolve($gateway);

            $result = $service->retrieveIntentStatus($paymentIntentId);

            if ($result['status'] === 'successful') {
                $checkoutService->recordOrderPayment(
                    $order,
                    $gatewaySlug,
                    (float) $order->total_amount,
                    Payment::STATUS_COMPLETED,
                    $result['reference'] ?? $paymentIntentId,
                    $result['message'] ?? 'Product order payment confirmed.'
                );

                $order->update(['payment_status' => 'paid', 'status' => 'processing']);
                Log::notice("3DS Confirmation Success for order {$order->order_number}, intent: {$paymentIntentId}");

                return redirect()->route('checkout.order.success')->with([
                    'success'   => $result['message'] ?? 'Payment confirmed successfully.',
                    'reference' => $paymentIntentId,
                ]);
            }
            
            $order->update(['status' => 'cancelled', 'payment_status' => 'failed', 'notes' => $result['message'] ?? 'Payment failed during 3DS confirmation.']);
            Log::warning("3DS Confirmation Failed for order {$order->order_number}, intent: {$paymentIntentId}.");
            return redirect()->route('checkout.index')->with('error', $result['message'] ?? 'Payment confirmation failed.');

        } catch (\Exception $e) {
            Log::critical("Payment confirmation error for order {$order->order_number}: " . $e->getMessage());
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
        
        return view('frontend.products.success', [
            'reference' => $reference,
            'message'   => $message,
        ]);
    }
}
