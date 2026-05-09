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
