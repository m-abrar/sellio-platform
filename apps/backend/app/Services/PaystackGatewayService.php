<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackGatewayService implements PaymentGatewayService
{
    protected array $config;
    private const BASE_URL = 'https://api.paystack.co';

    public function __construct(array $config)
    {
        if (empty($config['secret_key'])) {
            throw new Exception('Paystack secret_key is required.');
        }
        $this->config = $config;
    }

    private function http()
    {
        return Http::withToken($this->config['secret_key'])
            ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
            ->acceptJson();
    }

    public function charge(float $amount, string $token, string $returnUrl, array $metadata = []): array
    {
        $currency  = $this->config['currency'] ?? 'NGN';
        $amountKobo = (int) round($amount * 100);
        $reference  = 'PSK-' . uniqid();

        try {
            $response = $this->http()->post(self::BASE_URL . '/transaction/initialize', [
                'email'        => $metadata['customer_email'] ?? 'customer@example.com',
                'amount'       => $amountKobo,
                'currency'     => $currency,
                'reference'    => $reference,
                'callback_url' => $returnUrl,
                'metadata'     => $metadata,
            ]);

            if ($response->failed() || !$response->json('status')) {
                $error = $response->json('message') ?? $response->status();
                Log::error('Paystack transaction initialization failed.', ['error' => $error]);
                return ['status' => 'error', 'reference' => null, 'message' => 'Paystack error: ' . $error];
            }

            $data = $response->json('data');
            Log::info('Paystack transaction initialized.', ['reference' => $reference]);

            return [
                'status'       => 'pending_auth',
                'reference'    => $reference,
                'redirect_url' => $data['authorization_url'] ?? null,
                'message'      => 'Redirect to Paystack checkout.',
            ];
        } catch (Exception $e) {
            Log::error('Paystack charge exception.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    // $paymentIntentId is the Paystack transaction reference
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        try {
            $response = $this->http()->get(self::BASE_URL . '/transaction/verify/' . $paymentIntentId);

            if ($response->failed() || !$response->json('status')) {
                $error = $response->json('message') ?? 'Verification failed.';
                return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => $error];
            }

            $data   = $response->json('data');
            $status = $data['status'] ?? 'failed';

            if ($status === 'success') {
                return ['status' => 'successful', 'reference' => $paymentIntentId, 'message' => 'Payment successful.', 'details' => $data];
            }

            return ['status' => 'failed', 'reference' => $paymentIntentId, 'message' => 'Payment status: ' . $status, 'details' => $data];
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => $e->getMessage()];
        }
    }

    public function refund(string $transactionId, float $amount): array
    {
        $amountKobo = (int) round($amount * 100);

        try {
            $response = $this->http()->post(self::BASE_URL . '/refund', [
                'transaction' => $transactionId,
                'amount'      => $amountKobo,
            ]);

            if ($response->failed() || !$response->json('status')) {
                $error = $response->json('message') ?? $response->status();
                return ['status' => 'error', 'reference' => null, 'message' => 'Paystack refund failed: ' . $error];
            }

            $data = $response->json('data');
            return ['status' => 'refunded', 'reference' => (string) ($data['id'] ?? $transactionId), 'message' => 'Refund initiated via Paystack.'];
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    public function getFrontendConfig(): array
    {
        return ['public_key' => $this->config['public_key'] ?? null];
    }

    // Paystack signs with HMAC-SHA512 of the raw body using the secret key
    public function handleWebhook(Request $request): array
    {
        $payload   = $request->getContent();
        $signature = $request->header('X-Paystack-Signature');
        $expected  = hash_hmac('sha512', $payload, $this->config['secret_key']);

        if (!hash_equals($expected, $signature ?? '')) {
            throw new WebhookSignatureException('Paystack webhook signature mismatch.');
        }

        $data      = $request->json()->all();
        $eventType = $data['event'] ?? 'unknown';

        Log::notice('Paystack webhook received.', ['event' => $eventType]);

        if ($eventType === 'charge.success') {
            $txData = $data['data'] ?? [];
            return [
                'status'         => 'processed',
                'payment_status' => 'paid',
                'reference'      => $txData['reference'] ?? null,
                'order_id'       => $txData['metadata']['order_id'] ?? null,
                'message'        => 'Payment successful.',
            ];
        }

        return ['status' => 'ignored', 'message' => "Event {$eventType} acknowledged but not processed."];
    }
}
