<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterwaveGatewayService implements PaymentGatewayService
{
    protected array $config;
    private const BASE_URL = 'https://api.flutterwave.com/v3';

    public function __construct(array $config)
    {
        if (empty($config['secret_key'])) {
            throw new Exception('Flutterwave secret_key is required.');
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
        $reference = 'FLW-' . uniqid();

        try {
            $response = $this->http()->post(self::BASE_URL . '/payments', [
                'tx_ref'       => $reference,
                'amount'       => $amount,
                'currency'     => $currency,
                'redirect_url' => $returnUrl,
                'meta'         => $metadata,
                'customer'     => ['email' => $metadata['customer_email'] ?? 'customer@example.com'],
            ]);

            if ($response->failed()) {
                $error = $response->json('message') ?? $response->status();
                Log::error('Flutterwave payment initialization failed.', ['error' => $error]);
                return ['status' => 'error', 'reference' => null, 'message' => 'Flutterwave error: ' . $error];
            }

            $link = $response->json('data.link');
            Log::info('Flutterwave payment link created.', ['reference' => $reference]);

            return [
                'status'       => 'pending_auth',
                'reference'    => $reference,
                'redirect_url' => $link,
                'message'      => 'Redirect to Flutterwave checkout.',
            ];
        } catch (Exception $e) {
            Log::error('Flutterwave charge exception.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    // $paymentIntentId is the Flutterwave numeric transaction ID
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        try {
            $response = $this->http()->get(self::BASE_URL . '/transactions/' . $paymentIntentId . '/verify');

            if ($response->failed()) {
                return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => 'Failed to verify Flutterwave transaction.'];
            }

            $data   = $response->json('data') ?? [];
            $status = $data['status'] ?? 'failed';

            if ($status === 'successful') {
                return ['status' => 'successful', 'reference' => (string) ($data['id'] ?? $paymentIntentId), 'message' => 'Payment successful.', 'details' => $data];
            }

            return ['status' => 'failed', 'reference' => $paymentIntentId, 'message' => 'Payment status: ' . $status, 'details' => $data];
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => $e->getMessage()];
        }
    }

    public function refund(string $transactionId, float $amount): array
    {
        try {
            $response = $this->http()->post(self::BASE_URL . '/transactions/' . $transactionId . '/refund', [
                'amount' => $amount,
            ]);

            if ($response->failed()) {
                $error = $response->json('message') ?? $response->status();
                return ['status' => 'error', 'reference' => null, 'message' => 'Flutterwave refund failed: ' . $error];
            }

            $data = $response->json('data') ?? [];
            return ['status' => 'refunded', 'reference' => (string) ($data['id'] ?? $transactionId), 'message' => 'Refund initiated via Flutterwave.'];
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    public function getFrontendConfig(): array
    {
        return ['public_key' => $this->config['public_key'] ?? null];
    }

    public function handleWebhook(Request $request): array
    {
        $secretHash = $this->config['webhook_secret_hash'] ?? null;
        if (!$secretHash) {
            throw new Exception('Flutterwave webhook_secret_hash is missing from configuration.');
        }

        $signature = $request->header('verif-hash');
        if (!hash_equals($secretHash, $signature ?? '')) {
            throw new WebhookSignatureException('Flutterwave webhook signature mismatch.');
        }

        $data      = $request->json()->all();
        $eventType = $data['event'] ?? 'unknown';

        Log::notice('Flutterwave webhook received.', ['event' => $eventType]);

        if ($eventType === 'charge.completed') {
            $txData = $data['data'] ?? [];
            $status = $txData['status'] ?? 'failed';
            $paid   = $status === 'successful';

            return [
                'status'         => $paid ? 'processed' : 'failed',
                'payment_status' => $paid ? 'paid' : 'failed',
                'reference'      => (string) ($txData['id'] ?? null),
                'order_id'       => $txData['tx_ref'] ?? null,
                'message'        => 'Charge completed event handled.',
            ];
        }

        return ['status' => 'ignored', 'message' => "Event {$eventType} acknowledged but not processed."];
    }
}
