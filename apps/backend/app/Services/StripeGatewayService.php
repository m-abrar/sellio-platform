<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException; // Assuming you have this exception
use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\SignatureVerificationException; // Specific Stripe exception for webhooks
use Stripe\Webhook;
use Symfony\Component\HttpFoundation\Response; // Used for webhook response
use Illuminate\Support\Facades\Log;

class StripeGatewayService implements PaymentGatewayService
{
    protected array $config;
    protected StripeClient $client; // The actual Stripe SDK client

    /**
     * Initializes the Stripe client with the decrypted configuration.
     * * @param array $config The decrypted configuration array (live or sandbox).
     */
    public function __construct(array $config)
    {
        Log::info('StripeGatewayService initialization started.');
        $this->config = $config;
        
        // --- REAL IMPLEMENTATION: Use the secret_key to initialize the client ---
        if (empty($this->config['secret_key'])) {
            Log::critical('Stripe Secret Key is missing from configuration!');
            throw new \Exception("Stripe Secret Key is missing from configuration.");
        }
        
        // Initialize the Stripe Client instance
        $this->client = new StripeClient($this->config['secret_key']);
        Log::info('StripeClient initialized successfully.', ['mode' => $this->config['mode'] ?? 'N/A']);
    }


    public function charge(float $amount, string $token, string $returnUrl): array
    {
        $currency = $this->config['currency'] ?? 'usd';
        $amountInCents = round($amount * 100);
        Log::info('Starting Stripe charge attempt.', [
            'amount_float' => $amount, 
            'currency' => $currency, 
            'return_url' => $returnUrl,
            'token_type' => substr($token, 0, 4)
        ]);

        // Determine if the frontend sent an old 'tok_' token or a modern 'pm_' Payment Method ID
        if (substr($token, 0, 4) === 'tok_') {
            $paymentMethodParams = [
                'type' => 'card',
                'card' => ['token' => $token],
            ];
            $paymentMethodId = null; 
        } else {
            $paymentMethodParams = null;
            $paymentMethodId = $token;
        }
        
        try {
            // Build the core Payment Intent request array
            $requestArray = [
                'amount' => $amountInCents,
                'currency' => $currency,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'description' => 'Order payment from your application.',
                
                // CRITICAL: The URL to redirect the user to after external authentication
                'return_url' => $returnUrl, 
            ];

            // Conditionally add payment source based on token type
            if ($paymentMethodId) {
                $requestArray['payment_method'] = $paymentMethodId;
            } elseif ($paymentMethodParams) {
                $requestArray['payment_method_data'] = $paymentMethodParams;
            } else {
                Log::error("Charge failed: Invalid or missing payment token/method ID.", ['token' => $token]);
                throw new \Exception("Invalid or missing payment token/method ID.");
            }
            
            Log::debug('Stripe Payment Intent request array prepared.', ['amount' => $amountInCents, 'has_method' => (bool)($paymentMethodId || $paymentMethodParams)]);

            // --- Send the final request to Stripe ---
            $response = $this->client->paymentIntents->create($requestArray);
            Log::info('Stripe Payment Intent created.', ['id' => $response->id, 'status' => $response->status]);
            
            // ----------------------------------------------------------------------
            // Handle Response
            // ----------------------------------------------------------------------

            if ($response->status === 'succeeded') {
                Log::notice('Charge successful.', ['intent_id' => $response->id]);
                return [
                    'status' => 'successful', 
                    'reference' => $response->id, 
                    'message' => 'Payment processed successfully via Stripe.',
                    'details' => $response->jsonSerialize()
                ];
            }

            // If Stripe needs 3D Secure, it will return this status. 
            if (in_array($response->status, ['requires_action', 'requires_confirmation'])) {
                Log::warning('Charge requires 3D Secure/SCA.', ['intent_id' => $response->id, 'redirect' => $response->next_action->redirect_to_url->url ?? 'N/A']);
                return [
                    'status' => 'pending_auth', 
                    'reference' => $response->id, 
                    // CRITICAL: Return the next action URL for the controller/frontend to redirect to
                    'redirect_url' => $response->next_action->redirect_to_url->url ?? null,
                    'message' => 'Payment requires further authentication (3D Secure).',
                    'details' => $response->jsonSerialize()
                ];
            }

            // Default failure case
            Log::error('Stripe reported a final charge failure.', ['intent_id' => $response->id ?? 'N/A', 'status' => $response->status]);
            return [
                'status' => 'failed',
                'reference' => $response->id ?? null,
                'message' => 'Stripe reported a charge failure.',
                'details' => $response->jsonSerialize()
            ];

        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error during charge execution.', [
                'error_message' => $e->getMessage(),
                'status_code' => $e->getHttpStatus(),
                'error_body' => $e->getJsonBody()
            ]);
            return [
                'status' => 'error',
                'reference' => null,
                'message' => 'Stripe API Error: ' . $e->getMessage(),
                'details' => $e->getJsonBody()
            ];
        } catch (\Exception $e) {
            Log::critical('Unexpected Service Error during charge.', [
                'error_message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return [
                'status' => 'error',
                'reference' => null,
                'message' => 'Service Error: ' . $e->getMessage(),
                'details' => null
            ];
        }
    }

    /**
     * NEW METHOD: Retrieves a Payment Intent to check its final status after a redirect.
     * * @param string $paymentIntentId The ID of the Payment Intent (pi_...).
     * @return array
     */
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        Log::debug('Retrieving payment intent status...', ['payment_intent_id' => $paymentIntentId]);

        try {
            $intent = $this->client->paymentIntents->retrieve($paymentIntentId);

            Log::debug('Stripe payment intent retrieved successfully', [
                'id' => $intent->id,
                'status' => $intent->status,
                'amount' => $intent->amount,
                'currency' => $intent->currency,
            ]);

            if ($intent->status === 'succeeded') {
                Log::info('Payment succeeded for intent', ['intent_id' => $intent->id]);

                return [
                    'status' => 'successful',
                    'reference' => $intent->id,
                    'message' => 'Payment successfully completed after authentication.',
                    'details' => $intent->jsonSerialize(),
                ];
            }

            if ($intent->status === 'requires_payment_method') {
                Log::warning('Payment failed or authentication not completed', [
                    'intent_id' => $intent->id,
                    'status' => $intent->status,
                ]);

                return [
                    'status' => 'failed',
                    'reference' => $intent->id,
                    'message' => 'Payment failed: Authentication required but not completed.',
                    'details' => $intent->jsonSerialize(),
                ];
            }

            Log::info('Payment still pending or requires further action', [
                'intent_id' => $intent->id,
                'status' => $intent->status,
            ]);

            return [
                'status' => 'pending',
                'reference' => $intent->id,
                'message' => 'Payment is still processing or requires further action.',
                'details' => $intent->jsonSerialize(),
            ];

        } catch (ApiErrorException $e) {
            Log::error('Stripe API error during status retrieval', [
                'payment_intent_id' => $paymentIntentId,
                'error_message' => $e->getMessage(),
                'error_body' => $e->getJsonBody(),
            ]);

            return [
                'status' => 'error',
                'reference' => null,
                'message' => 'Stripe API Error during status retrieval: ' . $e->getMessage(),
                'details' => $e->getJsonBody(),
            ];

        } catch (\Exception $e) {
            Log::critical('Unexpected error while retrieving payment intent status', [
                'payment_intent_id' => $paymentIntentId,
                'error_message' => $e->getMessage(),
            ]);

            return [
                'status' => 'error',
                'reference' => null,
                'message' => 'Unexpected error: ' . $e->getMessage(),
                'details' => [],
            ];
        }
    }


    /**
     * Executes a refund for a previous transaction.
     * * @param string $transactionId The Stripe Payment Intent ID or Charge ID.
     * @param float $amount The amount to refund.
     * @return array
     */
    public function refund(string $transactionId, float $amount): array
    {
        $amountInCents = round($amount * 100);
        Log::info('Attempting Stripe refund.', ['transaction_id' => $transactionId, 'amount' => $amount]);
        
        try {
            $response = $this->client->refunds->create([
                'payment_intent' => $transactionId,
                'amount' => $amountInCents,
            ]);
            
            Log::debug('Stripe refund API response.', ['refund_id' => $response->id, 'status' => $response->status]);

            if ($response->status === 'succeeded') {
                Log::notice('Refund successful.', ['refund_id' => $response->id]);
                return [
                    'status' => 'refunded', 
                    'reference' => $response->id, 
                    'message' => 'Refund processed successfully via Stripe.'
                ];
            }
            
            Log::warning('Stripe refund failed.', ['refund_id' => $response->id ?? 'N/A', 'status' => $response->status]);
            return [
                'status' => 'failed', 
                'reference' => $response->id,
                'message' => 'Stripe refund failed.'
            ];

        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error during refund.', [
                'transaction_id' => $transactionId,
                'error_message' => $e->getMessage(),
                'error_body' => $e->getJsonBody()
            ]);
            return [
                'status' => 'error', 
                'reference' => null, 
                'message' => 'Stripe Refund API Error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Retrieves the non-sensitive configuration (Publishable Key) required for the frontend.
     * * @return array
     */
    public function getFrontendConfig(): array
    {
        Log::debug('Retrieving frontend configuration (publishable key).');
        // Return the key that starts with 'pk_'
        return [
            'publishable_key' => $this->config['publishable_key'] ?? null,
        ];
    }

    /**
     * Handles and processes incoming webhook payloads from Stripe.
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function handleWebhook(\Illuminate\Http\Request $request): array
    {
        Log::info('Stripe webhook processing started.');

        $payload   = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        // 1. Retrieve webhook secret from the service configuration
        $webhookSecret = $this->config['webhook_secret'] ?? null;
        
        if (!$webhookSecret) {
            Log::critical("Stripe Webhook Secret is missing! Signature verification impossible.");
            throw new \Exception("Stripe Webhook Secret is missing from configuration. Cannot verify signature.");
        }
        
        if (!$signature) {
             Log::warning("Webhook request missing Stripe-Signature header. Rejecting.");
             throw new WebhookSignatureException("Webhook request missing Stripe-Signature header.");
        }
        
        // --- REAL VERIFICATION ---
        try {
            $event = Webhook::constructEvent($payload, $signature, $webhookSecret);
            Log::debug('Stripe webhook signature verified successfully.');

        } catch (\UnexpectedValueException $e) {
            Log::error("Webhook error: Invalid payload format.", ['error' => $e->getMessage()]);
            throw new WebhookSignatureException("Invalid payload format: " . $e->getMessage()); 
        } catch (SignatureVerificationException $e) {
            Log::error("Webhook error: Invalid signature.", ['error' => $e->getMessage()]);
            throw new WebhookSignatureException("Invalid signature: " . $e->getMessage()); 
        }

        // 3. Process the event type
        $eventType = $event->type;
        $eventData = $event->data->object->jsonSerialize();
        
        Log::notice("Processing Stripe event type: {$eventType}", ['event_id' => $event->id, 'object_id' => $eventData['id'] ?? 'N/A']);

        if ($eventType === 'checkout.session.completed') {
            // Logic: Mark the order as paid, process the subscription, etc.
            Log::info("Handled 'checkout.session.completed'. Payment Status: " . ($eventData['payment_status'] ?? 'N/A'));
            return ['status' => 'processed', 'message' => 'Checkout session completed event handled.'];
        }
        
        if ($eventType === 'invoice.paid') {
            Log::info("Handled 'invoice.paid'. Invoice ID: " . ($eventData['id'] ?? 'N/A'));
            return ['status' => 'processed', 'message' => 'Invoice paid event handled.'];
        }
        
        // Handle other relevant event types (e.g., charge.succeeded, customer.subscription.deleted)
        
        Log::info("Webhook event type acknowledged but not explicitly processed by this handler.", ['type' => $eventType]);
        return ['status' => 'ignored', 'message' => "Event type {$eventType} acknowledged but not processed."];
    }
}
