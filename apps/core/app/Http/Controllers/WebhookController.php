<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GatewayManager;
use App\Models\PaymentGateway;
use Symfony\Component\HttpFoundation\Response; // Use standard Symfony response codes
use Illuminate\Support\Facades\Log; // Added for explicit Log facade use
// NOTE: Assuming your service layer might throw a custom exception for signature failure
// If you don't have this, create it or replace it with a more generic exception.
use App\Exceptions\WebhookSignatureException; 

class WebhookController extends Controller
{
    /**
     * Handles incoming webhook payloads from any payment gateway.
     */
    public function handle(Request $request, GatewayManager $manager, string $gatewaySlug)
    {
        Log::info("Incoming webhook request for gateway: {$gatewaySlug}");

        // 1. Find the corresponding gateway configuration
        $gateway = PaymentGateway::where('slug', $gatewaySlug)->first();

        if (!$gateway || !$gateway->is_active) {
            Log::warning("Webhook gateway not found or inactive.", ['slug' => $gatewaySlug]);
            // Return 404/403 to the sender to stop retries if the gateway doesn't exist/is inactive
            return response()->json(['error' => 'Gateway not configured'], Response::HTTP_NOT_FOUND); 
        }
        
        // Log key headers for debugging signature verification issues
        $headersToLog = array_filter(
            $request->headers->all(), 
            fn($key) => str_starts_with($key, 'x-') || str_contains($key, 'signature'), 
            ARRAY_FILTER_USE_KEY
        );
        Log::debug("Webhook Headers for {$gatewaySlug}:", $headersToLog);
        Log::debug("Webhook Payload (first 500 chars): " . substr(json_encode($request->all()), 0, 500) . '...');


        try {
            // 2. Resolve the specific service instance (e.g., StripeGatewayService)
            $service = $manager->resolve($gateway);
            Log::info("Gateway service resolved successfully: " . get_class($service));
            
            // Try to guess the signature header
            $signature = $request->header('stripe-signature') 
                         ?? $request->header('X-Hub-Signature') 
                         ?? $request->header('X-Webhook-Signature');
            Log::debug("Signature header used: " . ($signature ? 'Present' : 'Missing'));

            // 3. Delegate the handling to the service method
            // CRITICAL: Some services (like Stripe) require the raw request content, not $request->all() for verification
            // If your service uses $request->getContent() for verification, ensure it receives the raw data.
            $result = $service->handleWebhook($request->getContent(), $signature); 
            
            Log::notice("Webhook processed successfully by service.");
            Log::notice(
                [
                    'status' => $result['status'] ?? 'N/A', 
                    'message' => $result['message'] ?? 'No message provided'
                ]
            );
            // 4. Return 200 OK (important!) to acknowledge receipt and prevent retries
            return response()->json(['status' => 'success', 'message' => $result['message']], Response::HTTP_OK);

        } catch (WebhookSignatureException $e) {
            // Log and return 400 Bad Request/401 Unauthorized for signature failures.
            Log::error("Webhook SIGNATURE VERIFICATION FAILED for {$gatewaySlug}.", [
                'error' => $e->getMessage(),
                'code' => Response::HTTP_BAD_REQUEST
            ]);
            return response()->json(['error' => 'Invalid signature or payload'], Response::HTTP_BAD_REQUEST);

        } catch (\Exception $e) {
            // Log the error for internal review.
            Log::error("General Webhook processing error for {$gatewaySlug}: " . $e->getMessage(), [
                'file' => $e->getFile(), 
                'line' => $e->getLine(),
                'exception' => get_class($e)
            ]);
            
            // Return 200 OK for general server errors (5xx) to stop retries.
            return response()->json(['error' => 'Internal server error during webhook processing, issue logged.'], Response::HTTP_OK);
        }
    }
}
