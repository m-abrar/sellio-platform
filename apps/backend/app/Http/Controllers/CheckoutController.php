<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\GatewayManager;
use App\Services\StripeCheckoutConfigService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
     * @param  \App\Services\CartService  $cartService
     * @return \Illuminate\View\View
     */
    public function showCheckout(
        GatewayManager $manager,
        CartService $cartService,
        StripeCheckoutConfigService $stripeCheckoutConfig
    ): View|RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', __('Please sign in to complete checkout.'));
        }

        // Secure Price Retrieval: Fetch current active cart and calculate total on the server.
        $cart = $cartService->getOrCreateCart();

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', __('Your cart is empty.'));
        }

        $checkoutGateways = $stripeCheckoutConfig->resolveCheckoutGateways($manager, 'product_checkout');

        $orderData = [
            'amount'      => $cart->calculateTotal(),
            'currency'    => 'USD',
            'id'          => $cart->id,
            'description' => __('Marketplace Purchase - Order #:id', ['id' => $cart->id]),
        ];

        return view('frontend.products.checkout', [
            'cart'             => $cart,
            'orderData'        => $orderData,
            'checkoutGateways' => $checkoutGateways,
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
        // Track whether the order was created so the catch knows where to redirect.
        // After process() runs the cart is deleted, so we must never redirect back
        // to checkout.index once $order is set (doing so creates an empty cart and
        // shows "Your cart is empty" on the next page).
        $order = null;

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

            if (!$token && $gatewaySlug !== 'manual') {
                return redirect()->route('checkout.index')->with('error', __('Payment details are required.'));
            }

            // 1. Persist the Order and delete the cart (no going back after this point)
            $order = $checkoutService->process($cart, $request->validated(), $gatewaySlug);

            $returnUrl = route('checkout.confirm', ['gateway' => $gatewaySlug, 'order' => $order->order_number], true);

            // 2. Execute Charge
            $result = $service->charge($order->total_amount, $token ?? '', $returnUrl, [
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

                return redirect()->route('checkout.order.success', ['order' => $order->order_number])->with([
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

            // Manual / bank-transfer: pending_auth with no redirect — store proof, await admin
            if ($result['status'] === 'pending_auth') {
                $checkoutService->recordOrderPayment(
                    $order,
                    $gatewaySlug,
                    (float) $order->total_amount,
                    Payment::STATUS_PENDING,
                    $result['reference'] ?? null,
                    $result['message'] ?? 'Awaiting bank transfer verification.'
                );

                if ($request->hasFile('proof_file')) {
                    try {
                        $path = $request->file('proof_file')->store('payment-proofs', 'public');
                        $order->payments()->orderBy('id', 'desc')->first()?->update(['proof_file' => $path]);
                    } catch (\Throwable $fe) {
                        Log::warning("Proof file storage failed for order {$order->order_number}: " . $fe->getMessage());
                    }
                }

                return redirect()->route('checkout.order.pending', ['order' => $order->order_number]);
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
                return redirect()->route('checkout.order.pending', ['order' => $order->order_number])
                                 ->with('error', $result['message']);
            }

            return redirect()->route('checkout.order.pending', ['order' => $order->order_number])
                             ->with('info', $result['message'] ?? 'Payment status unhandled.');

        } catch (Exception $e) {
            Log::critical("Checkout Error [{$gatewaySlug}]: " . $e->getMessage());

            // If the order was already created the cart is gone — send to the pending
            // page for this order rather than back to checkout.
            if ($order !== null) {
                return redirect()->route('checkout.order.pending', ['order' => $order->order_number])
                                 ->with('warning', __('Your order was placed but payment recording encountered an issue. Our team will review it.'));
            }

            return redirect()->route('checkout.index')->with('error', __('A severe error occurred during payment. Please contact support.'));
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
    public function confirmPayment(Request $request, GatewayManager $manager, CheckoutService $checkoutService, string $gatewaySlug, Order $order): RedirectResponse
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

                return redirect()->route('checkout.order.success', ['order' => $order->order_number])->with([
                    'success'   => $result['message'] ?? 'Payment confirmed successfully.',
                    'reference' => $paymentIntentId,
                ]);
            }
            
            $order->update(['status' => 'cancelled', 'payment_status' => 'failed', 'notes' => $result['message'] ?? 'Payment failed during 3DS confirmation.']);
            Log::warning("3DS Confirmation Failed for order {$order->order_number}, intent: {$paymentIntentId}.");
            return redirect()->route('checkout.index')->with('error', $result['message'] ?? 'Payment confirmation failed.');

        } catch (Exception $e) {
            Log::critical("Payment confirmation error for order {$order->order_number}: " . $e->getMessage());
            return redirect()->route('checkout.index')->with('error', 'A confirmation error occurred. Please try again.');
        }
    }

    /**
     * Display the order success confirmation view.
     */
    public function showSuccess(Order $order): View|RedirectResponse
    {
        if (Auth::id() !== $order->user_id) {
            abort(403);
        }

        return view('frontend.products.success', [
            'order'     => $order,
            'reference' => session('reference', $order->payments()->latest()->value('transaction_id') ?? 'N/A'),
            'message'   => session('success', __('Your order was placed successfully.')),
        ]);
    }

    /**
     * Display the pending bank transfer confirmation page for a specific order.
     */
    public function showPending(Order $order): View|RedirectResponse
    {
        if (Auth::id() !== $order->user_id) {
            abort(403);
        }

        $payment = $order->payments()->where('payment_method', 'manual')->latest()->first();

        return view('frontend.products.pending', [
            'order'   => $order,
            'payment' => $payment,
        ]);
    }
}
