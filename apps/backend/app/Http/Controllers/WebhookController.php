<?php

namespace App\Http\Controllers;

use App\Events\PaymentFailed;
use App\Exceptions\WebhookSignatureException;
use Exception;
use App\Models\EventBooking;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentGateway;
use App\Models\Plan;
use App\Models\PropertyBooking;
use App\Models\User;
use App\Services\CheckoutService;
use App\Services\EventBookingService;
use App\Services\GatewayManager;
use App\Services\PropertyService;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class WebhookController
 * Serves as the global entry point for asynchronous event notifications from third-party gateways.
 * Implements strict signature verification and standardized response protocols to manage the event lifecycle.
 */
class WebhookController extends Controller
{
    /**
     * Handle incoming webhook payloads and delegate to specialized gateway services.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\GatewayManager  $manager
     * @param  string  $gatewaySlug
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, GatewayManager $manager, string $gatewaySlug): JsonResponse
    {
        $gateway = PaymentGateway::where('slug', $gatewaySlug)->where('is_active', true)->first();

        if (!$gateway) {
            Log::warning("Inactive or invalid webhook gateway targeted: {$gatewaySlug}");
            return response()->json(['error' => 'Gateway not configured'], Response::HTTP_NOT_FOUND); 
        }
        
        try {
            $service = $manager->resolve($gateway);
            
            // Delegate entire processing and signature verification to the specialized service
            $result = $service->handleWebhook($request); 
            
            if (!empty($result['subscription_user_id']) && !empty($result['subscription_plan_id'])) {
                $user = User::find($result['subscription_user_id']);
                $plan = Plan::find($result['subscription_plan_id']);

                if ($user && $plan) {
                    if (($result['payment_status'] ?? null) === 'failed') {
                        PaymentFailed::dispatch(
                            $user,
                            $plan,
                            null,
                            $result['message'] ?? __('Subscription payment failed.')
                        );
                        Log::warning("Webhook recorded failed partner subscription payment for user {$user->id} on plan {$plan->id} via {$gatewaySlug}");
                    } else {
                        app(SubscriptionService::class)->subscribe($user, $plan);
                        Log::info("Webhook activated partner subscription for user {$user->id} on plan {$plan->id} via {$gatewaySlug}");
                    }
                }
            }

            if (!empty($result['property_booking_id']) && isset($result['payment_status']) && $result['payment_status'] === 'paid') {
                $booking = PropertyBooking::find($result['property_booking_id']);

                if ($booking) {
                    app(PropertyService::class)->recordBookingPayment(
                        $booking,
                        $gatewaySlug,
                        (float) $booking->total_price,
                        Payment::STATUS_COMPLETED,
                        $result['reference'] ?? null,
                        $result['message'] ?? 'Property booking payment confirmed via webhook.'
                    );

                    if ($booking->status !== PropertyBooking::STATUS_CONFIRMED) {
                        app(PropertyService::class)->confirmBookingPayment($booking);
                        Log::info("Webhook confirmed property booking {$booking->id} via {$gatewaySlug}");
                    }
                }
            }

            if (!empty($result['event_booking_id']) && isset($result['payment_status']) && $result['payment_status'] === 'paid') {
                $booking = EventBooking::find($result['event_booking_id']);

                if ($booking) {
                    $amount = round((float) $booking->total_price * 1.05, 2);

                    app(EventBookingService::class)->recordBookingPayment(
                        $booking,
                        $gatewaySlug,
                        $amount,
                        Payment::STATUS_COMPLETED,
                        $result['reference'] ?? null,
                        $result['message'] ?? 'Event booking payment confirmed via webhook.'
                    );

                    if ($booking->status !== EventBooking::STATUS_CONFIRMED) {
                        app(EventBookingService::class)->finalizePayment(
                            $booking,
                            $gatewaySlug,
                            $result['reference'] ?? null,
                            $amount
                        );
                        Log::info("Webhook confirmed event booking {$booking->id} via {$gatewaySlug}");
                    }
                }
            }

            // AUTOMATED FULFILLMENT: Update the corresponding Order if identified
            if (!empty($result['order_id']) && isset($result['payment_status']) && $result['payment_status'] === 'paid') {
                $order = Order::find($result['order_id']);
                if ($order) {
                    app(CheckoutService::class)->recordOrderPayment(
                        $order,
                        $gatewaySlug,
                        (float) $order->total_amount,
                        Payment::STATUS_COMPLETED,
                        $result['reference'] ?? null,
                        $result['message'] ?? 'Product order payment confirmed via webhook.'
                    );

                    if ($order->payment_status !== 'paid') {
                        $order->update([
                            'payment_status' => 'paid',
                            'status'         => 'processing',
                            'notes'          => trim(($order->notes ? $order->notes . "\n" : '') . '[Webhook] ' . ($result['message'] ?? 'Payment confirmed via webhook.')),
                        ]);
                        Log::info("Webhook fulfilled Order: {$order->order_number} via {$gatewaySlug}");
                    }
                }
            }

            Log::info("Webhook processed for {$gatewaySlug}: " . ($result['message'] ?? 'Success'));

            return response()->json([
                'status'  => 'success', 
                'message' => $result['message'] ?? 'Event Received'
            ], Response::HTTP_OK);

        } catch (WebhookSignatureException $e) {
            Log::error("Webhook signature verification failed for {$gatewaySlug}: " . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], Response::HTTP_BAD_REQUEST);

        } catch (Exception $e) {
            Log::error("Webhook processing error for {$gatewaySlug}: " . $e->getMessage(), [
                'exception' => get_class($e)
            ]);
            
            // Return 200 OK even on internal failure to stop provider retries if logs are captured.
            return response()->json(['error' => 'Internal processing error'], Response::HTTP_OK);
        }
    }
}
