<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException; // Needed for handleWebhook contract
use Illuminate\Support\Facades\Log;
// NOTE: We will assume a conceptual, modern PayPal SDK for the client setup (e.g., srmklive/paypal or a custom wrapper)
use Illuminate\Support\Facades\Config;
use Srmklive\PayPal\Services\PayPal as PayPalClient; // Conceptual SDK use

class PaypalGatewayService implements PaymentGatewayService
{
    protected array $config;
    protected PayPalClient $client; // The actual PayPal SDK client (Conceptual)

    /**
     * Initializes the PayPal gateway service with configuration and client setup.
     * @param array $config The decrypted configuration array (live or sandbox).
     */
    public function __construct(array $config)
    {
        Log::info('PaypalGatewayService initialization started.');
        $this->config = $config;
        
        if (empty($this->config['client_id']) || empty($this->config['client_secret'])) {
            Log::critical('PayPal client_id or client_secret is missing from configuration!');
            throw new \Exception("PayPal API keys are missing from configuration.");
        }
        
        // --- REAL IMPLEMENTATION: Instantiate the PayPal Client ---
        try {
            // NOTE: In a real Laravel app, you might configure the SDK globally, 
            // but here we configure it specifically per service instance.
            
            // This assumes the SDK client uses the config values directly:
            $this->client = new PayPalClient([
                'mode' => $this->config['mode'] ?? 'sandbox', 
                'sandbox' => [
                    'client_id' => $this->config['client_id'],
                    'client_secret' => $this->config['client_secret'],
                ],
                'live' => [
                    'client_id' => $this->config['client_id'],
                    'client_secret' => $this->config['client_secret'],
                ],
                'currency' => $this->config['currency'] ?? 'USD',
            ]);
            
            Log::info('PayPal Client initialized successfully.', ['mode' => $this->config['mode'] ?? 'N/A']);

        } catch (\Exception $e) {
            Log::critical('Failed to initialize PayPal client.', ['error' => $e->getMessage()]);
            throw new \Exception("PayPal SDK initialization failed: " . $e->getMessage());
        }
    }

    /**
     * Executes a payment charge using the PayPal API (usually creating an Order).
     * @param string $token is typically the return URL from the client-side Order creation.
     */
    public function charge(float $amount, string $token, string $returnUrl): array
    {
        $currency = $this->config['currency'] ?? 'USD';
        Log::info('Attempting PayPal charge (Create Order).', [
            'amount' => $amount, 
            'currency' => $currency, 
            'returnUrl' => $returnUrl
        ]);

        try {
            // 1. Create the PayPal Order
            // $token is not used in the initial backend call for PayPal, 
            // the client-side script handles the Order approval.
            
            $order = $this->client->createOrder([
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'amount' => [
                            'currency_code' => $currency,
                            'value' => number_format($amount, 2, '.', ''),
                        ],
                    ],
                ],
                'application_context' => [
                    'return_url' => $returnUrl, // Required for success redirect
                    'cancel_url' => route('checkout.show', ['error' => 'paypal_cancelled']), // Example cancel redirect
                ],
            ]);
            
            Log::info('PayPal Order created successfully.', ['order_id' => $order['id'], 'status' => $order['status']]);

            // 2. Find the redirect link for the user to approve the payment
            $redirectLink = collect($order['links'])
                            ->where('rel', 'approve')
                            ->first()['href'] ?? null;

            if ($redirectLink) {
                // PayPal always requires a redirect to their site for user approval
                Log::notice('PayPal requires user approval redirect.', ['order_id' => $order['id']]);
                return [
                    'status' => 'pending_auth', 
                    'reference' => $order['id'], 
                    'redirect_url' => $redirectLink,
                    'message' => 'Redirect to PayPal for approval.'
                ];
            }

            // Fallback for an unhandled status
            Log::error('PayPal Order created but no approval link found.', ['order' => $order]);
            return [
                'status' => 'error', 
                'reference' => $order['id'], 
                'message' => 'PayPal Order created but unable to find approval link.'
            ];

        } catch (\Exception $e) {
            Log::error('PayPal API Error during Order creation.', ['error' => $e->getMessage()]);
            return [
                'status' => 'error',
                'reference' => null,
                'message' => 'PayPal API Error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Retrieves the status of a PayPal Order after user approval redirect.
     */
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        Log::info('Retrieving and CAPTURING PayPal Order status.', ['order_id' => $paymentIntentId]);

        try {
            // CRITICAL STEP: Unlike Stripe's retrieve, PayPal requires a CAPTURE call here
            // to finalize the payment after the user approves it on the PayPal site.
            $capture = $this->client->capturePaymentOrder($paymentIntentId);

            $status = $capture['status'] ?? 'ERROR';
            $captureId = $capture['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;
            
            Log::debug('PayPal Capture response status.', ['order_id' => $paymentIntentId, 'status' => $status, 'capture_id' => $captureId]);

            if ($status === 'COMPLETED') {
                Log::notice('PayPal payment CAPTURE successful.', ['order_id' => $paymentIntentId, 'capture_id' => $captureId]);
                return [
                    'status' => 'successful',
                    'reference' => $captureId,
                    'message' => 'Payment approved and captured successfully.',
                    'details' => $capture,
                ];
            }
            
            Log::warning('PayPal capture failed or is pending.', ['order_id' => $paymentIntentId, 'status' => $status]);
            return [
                'status' => 'failed',
                'reference' => $captureId,
                'message' => 'Payment capture failed or is pending: ' . $status,
                'details' => $capture,
            ];

        } catch (\Exception $e) {
            Log::error('PayPal API Error during CAPTURE.', ['order_id' => $paymentIntentId, 'error' => $e->getMessage()]);
            return [
                'status' => 'error',
                'reference' => null,
                'message' => 'PayPal API Error during capture: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Executes a refund for a previous PayPal transaction (Capture ID).
     */
    public function refund(string $transactionId, float $amount): array
    {
        Log::info('Attempting PayPal refund.', ['capture_id' => $transactionId, 'amount' => $amount]);
        $amountStr = number_format($amount, 2, '.', '');

        try {
            // $transactionId here should be the CAPTURE ID
            $response = $this->client->refundCapture(
                $transactionId, 
                ['amount' => ['currency_code' => $this->config['currency'] ?? 'USD', 'value' => $amountStr]]
            );

            $status = $response['status'] ?? 'ERROR';
            Log::debug('PayPal refund response status.', ['refund_id' => $response['id'] ?? 'N/A', 'status' => $status]);

            if (in_array($status, ['COMPLETED', 'PENDING'])) {
                Log::notice('PayPal refund initiated.', ['refund_id' => $response['id'] ?? 'N/A', 'status' => $status]);
                return [
                    'status' => 'refunded', 
                    'reference' => $response['id'],
                    'message' => 'Refund initiated successfully via PayPal. Status: ' . $status
                ];
            }
            
            Log::error('PayPal refund failed.', ['response' => $response]);
            return [
                'status' => 'failed', 
                'reference' => $response['id'] ?? null,
                'message' => 'PayPal refund failed. Status: ' . $status
            ];

        } catch (\Exception $e) {
            Log::error('PayPal API Error during refund.', ['error' => $e->getMessage()]);
            return [
                'status' => 'error', 
                'reference' => null, 
                'message' => 'PayPal Refund API Error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Retrieves the non-sensitive configuration (Client ID) required for the frontend.
     */
    public function getFrontendConfig(): array
    {
        Log::debug('Retrieving PayPal frontend configuration (client_id).');
        return [
            // PayPal uses the client_id (Publishable Key equivalent) for the JS SDK
            'client_id' => $this->config['client_id'] ?? null,
            'currency' => $this->config['currency'] ?? 'USD', 
            'mode' => $this->config['mode'] ?? 'sandbox',
        ];
    }
    
    /**
     * Handles incoming webhook payloads from PayPal.
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function handleWebhook(\Illuminate\Http\Request $request): array
    {
        Log::info('PayPal webhook processing started.');
        
        $payload = $request->getContent();

        // 1. Verify Webhook Signature
        $webhookId = $this->config['webhook_id'] ?? null;
        if (!$webhookId) {
            Log::critical("PayPal Webhook ID is missing from configuration!");
            throw new \Exception("PayPal Webhook ID is missing. Cannot verify signature.");
        }

        try {
            // --- REAL VERIFICATION CALL ---
            $verify = $this->client->verifyWebHook([
                'transmission_id'   => $request->header('PAYPAL-TRANSMISSION-ID'),
                'transmission_time' => $request->header('PAYPAL-TRANSMISSION-TIME'),
                'cert_url'          => $request->header('PAYPAL-CERT-URL'),
                'auth_algo'         => $request->header('PAYPAL-AUTH-ALGO'),
                'transmission_sig'  => $request->header('PAYPAL-TRANSMISSION-SIG'),
                'webhook_id'        => $webhookId,
                'webhook_event'     => json_decode($payload, true),
            ]);

            if ($verify['status'] !== 'SUCCESS') {
                Log::error('PayPal Webhook signature verification failed.', ['verify_status' => $verify['status'] ?? 'N/A']);
                throw new WebhookSignatureException("PayPal Webhook signature verification failed.");
            }

            Log::debug('PayPal Webhook signature verified successfully.');

            // 2. Process the payload
            $data = json_decode($payload, true);
            $eventType = $data['event_type'] ?? 'unknown';
            $resourceId = $data['resource']['id'] ?? 'N/A';
            
            Log::notice("Processing PayPal event type: {$eventType}", ['resource_id' => $resourceId]);

            if ($eventType === 'PAYMENT.CAPTURE.COMPLETED') {
                // Logic: Mark the order as paid, process the subscription, etc.
                Log::info("Handled 'PAYMENT.CAPTURE.COMPLETED'. Capture ID: {$resourceId}");
                return ['status' => 'processed', 'message' => 'Payment capture completed event handled.'];
            }
            
            if ($eventType === 'CHECKOUT.ORDER.APPROVED') {
                 // This event indicates the user approved the order but is not captured yet (less common in API flow)
                 Log::info("Handled 'CHECKOUT.ORDER.APPROVED'. Order ID: {$resourceId}");
                 return ['status' => 'ignored', 'message' => 'Order approved event acknowledged. Capture handled via redirect.'];
            }
            
            Log::info("PayPal webhook event type acknowledged but not explicitly processed.", ['type' => $eventType]);
            return ['status' => 'ignored', 'message' => "Event type {$eventType} acknowledged but not processed."];

        } catch (WebhookSignatureException $e) {
            // Re-throw the signature exception for the controller to handle the 400 response
            throw $e;
        } catch (\Exception $e) {
            Log::error("PayPal webhook processing failed due to internal error.", ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => 'Internal server error during webhook processing.'];
        }
    }
}
