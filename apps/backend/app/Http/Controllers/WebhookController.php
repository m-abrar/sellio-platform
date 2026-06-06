<?php

namespace App\Http\Controllers;

use App\Exceptions\WebhookSignatureException;
use App\Models\PaymentGateway;
use App\Services\GatewayManager;
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
                $user = \App\Models\User::find($result['subscription_user_id']);
                $plan = \App\Models\Plan::find($result['subscription_plan_id']);

                if ($user && $plan) {
                    app(\App\Services\SubscriptionService::class)->subscribe($user, $plan);
                    Log::info("Webhook activated partner subscription for user {$user->id} on plan {$plan->id} via {$gatewaySlug}");
                }
            }

            // AUTOMATED FULFILLMENT: Update the corresponding Order if identified
            if (!empty($result['order_id']) && isset($result['payment_status']) && $result['payment_status'] === 'paid') {
                $order = \App\Models\Order::find($result['order_id']);
                if ($order && $order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'status'         => 'processing',
                        'notes'          => $order->notes . "\n[Webhook] " . ($result['message'] ?? 'Payment confirmed via webhook.')
                    ]);
                    Log::info("Webhook fulfilled Order: {$order->order_number} via {$gatewaySlug}");
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

        } catch (\Exception $e) {
            Log::error("Webhook processing error for {$gatewaySlug}: " . $e->getMessage(), [
                'exception' => get_class($e)
            ]);
            
            // Return 200 OK even on internal failure to stop provider retries if logs are captured.
            return response()->json(['error' => 'Internal processing error'], Response::HTTP_OK);
        }
    }
}
