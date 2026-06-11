<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\CartResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\GatewayManager;
use App\Services\StripeCheckoutConfigService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApiCheckoutController extends Controller
{
    public function context(
        CartService $cartService,
        GatewayManager $manager,
        StripeCheckoutConfigService $stripeCheckoutConfig
    ): JsonResponse {
        if (!Auth::check()) {
            return $this->errorResponse(__('Please sign in to complete checkout.'), 401);
        }

        $cart = $cartService->getOrCreateCart();
        $cart->load(['items.product.media']);

        if ($cart->items->isEmpty()) {
            return $this->errorResponse(__('Your cart is empty.'), 422);
        }

        $gateways = PaymentGateway::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['slug', 'title', 'mode']);

        return $this->successResponse([
            'cart' => new CartResource($cart),
            'order_preview' => [
                'amount'      => (float) $cart->calculateTotal(),
                'currency'    => 'USD',
                'description' => __('Marketplace Purchase - Order #:id', ['id' => $cart->id]),
            ],
            'gateways' => $gateways,
            'stripe_publishable_key' => $stripeCheckoutConfig->resolvePublishableKey($manager, 'product_checkout'),
        ]);
    }

    public function processPayment(
        StoreOrderRequest $request,
        GatewayManager $manager,
        CheckoutService $checkoutService,
        string $gatewaySlug
    ): JsonResponse {
        if (!Auth::check()) {
            return $this->errorResponse(__('Please sign in to complete checkout.'), 401);
        }

        try {
            $gateway = PaymentGateway::where('slug', $gatewaySlug)->where('is_active', true)->firstOrFail();
            $service = $manager->resolve($gateway);

            $cart = app(CartService::class)->getOrCreateCart();

            if ($cart->items->isEmpty()) {
                return $this->errorResponse(__('Your cart is empty.'), 422);
            }

            $token = $request->input('payment_token')
                ?? $request->input('stripeToken')
                ?? $request->input('paymentToken');

            if (!$token && !in_array($gatewaySlug, ['bank_transfer', 'wallet'], true)) {
                return $this->errorResponse(__('Payment details are required.'), 422);
            }

            $order = $checkoutService->process($cart, $request->validated(), $gatewaySlug);

            if (in_array($gatewaySlug, ['bank_transfer', 'wallet'], true)) {
                $order->update(['status' => 'pending', 'payment_status' => 'pending']);

                return $this->successResponse([
                    'status' => 'pending_manual',
                    'order'  => new OrderResource($order->load('items.product')),
                    'message' => __('Order placed. Complete payment using the selected method.'),
                ], __('Order placed successfully.'), 201);
            }

            $returnUrlBase = $request->input('return_url');
            if ($returnUrlBase) {
                $separator = str_contains($returnUrlBase, '?') ? '&' : '?';
                $returnUrl = $returnUrlBase . $separator . http_build_query([
                    'gateway' => $gatewaySlug,
                    'order' => $order->id,
                ]);
            } else {
                $returnUrl = url('/api/v1/checkout/confirm/' . $gatewaySlug . '/' . $order->id);
            }

            $result = $service->charge($order->total_amount, $token, $returnUrl, [
                'purpose'      => 'product_order',
                'order_id'     => $order->id,
                'order_number' => $order->order_number,
                'user_id'      => (string) $order->user_id,
                'description'  => __('Payment for Order #:num', ['num' => $order->order_number]),
            ]);

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

                return $this->successResponse([
                    'status'    => 'successful',
                    'order'     => new OrderResource($order->load('items.product')),
                    'reference' => $result['reference'] ?? null,
                    'message'   => $result['message'] ?? __('Payment successful.'),
                ], __('Payment successful.'));
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

                return $this->successResponse([
                    'status'       => 'pending_auth',
                    'order'        => new OrderResource($order->load('items.product')),
                    'redirect_url' => $result['redirect_url'],
                    'reference'    => $result['reference'] ?? null,
                ], $result['message'] ?? __('Additional authentication required.'));
            }

            $checkoutService->recordOrderPayment(
                $order,
                $gatewaySlug,
                (float) $order->total_amount,
                Payment::STATUS_FAILED,
                $result['reference'] ?? null,
                $result['message'] ?? 'Product order payment failed.'
            );

            $order->update(['status' => 'cancelled', 'payment_status' => 'failed', 'notes' => $result['message'] ?? null]);

            return $this->errorResponse($result['message'] ?? __('Payment failed.'), 422);
        } catch (Exception $e) {
            Log::critical("API Checkout Error [{$gatewaySlug}]: " . $e->getMessage());

            return $this->errorResponse(__('A severe error occurred during payment. Please contact support.'), 500);
        }
    }

    public function confirmPayment(
        Request $request,
        GatewayManager $manager,
        CheckoutService $checkoutService,
        string $gatewaySlug,
        Order $order
    ): JsonResponse {
        if (!Auth::check() || Auth::id() !== $order->user_id) {
            return $this->errorResponse(__('Unauthorized access.'), 403);
        }

        $paymentIntentId = $request->get('payment_intent') ?? $request->get('token');

        if (!$paymentIntentId) {
            return $this->errorResponse(__('Payment confirmation failed: Missing transaction ID.'), 422);
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

                return $this->successResponse([
                    'status'    => 'successful',
                    'order'     => new OrderResource($order->load('items.product')),
                    'reference' => $result['reference'] ?? $paymentIntentId,
                ], $result['message'] ?? __('Payment confirmed successfully.'));
            }

            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'failed',
                'notes' => $result['message'] ?? 'Payment failed during confirmation.',
            ]);

            return $this->errorResponse($result['message'] ?? __('Payment confirmation failed.'), 422);
        } catch (Exception $e) {
            Log::critical("API payment confirmation error for order {$order->order_number}: " . $e->getMessage());

            return $this->errorResponse(__('A confirmation error occurred. Please try again.'), 500);
        }
    }
}
