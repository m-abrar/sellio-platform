<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MollieGatewayService implements PaymentGatewayService
{
    protected array $config;
    private const BASE_URL = 'https://api.mollie.com/v2';

    public function __construct(array $config)
    {
        if (empty($config['api_key'])) {
            throw new Exception('Mollie api_key is required.');
        }
        $this->config = $config;
    }

    private function http()
    {
        return Http::withToken($this->config['api_key'])
            ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
            ->acceptJson();
    }

    public function charge(float $amount, string $token, string $returnUrl, array $metadata = []): array
    {
        $currency = $this->config['currency'] ?? 'EUR';

        try {
            $body = [
                'amount'      => ['currency' => $currency, 'value' => number_format($amount, 2, '.', '')],
                'description' => $metadata['description'] ?? 'Order payment',
                'redirectUrl' => $returnUrl,
                'metadata'    => $metadata,
            ];

            if (!empty($this->config['webhook_url'])) {
                $body['webhookUrl'] = $this->config['webhook_url'];
            }

            $response = $this->http()->post(self::BASE_URL . '/payments', $body);

            if ($response->failed()) {
                $error = $response->json('detail') ?? $response->status();
                Log::error('Mollie payment creation failed.', ['error' => $error]);
                return ['status' => 'error', 'reference' => null, 'message' => 'Mollie error: ' . $error];
            }

            $payment = $response->json();
            Log::info('Mollie payment created.', ['id' => $payment['id']]);

            return [
                'status'       => 'pending_auth',
                'reference'    => $payment['id'],
                'redirect_url' => $payment['_links']['checkout']['href'] ?? null,
                'message'      => 'Redirect to Mollie checkout.',
            ];
        } catch (Exception $e) {
            Log::error('Mollie charge exception.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    // $paymentIntentId is the Mollie payment ID (tr_...)
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        try {
            $response = $this->http()->get(self::BASE_URL . '/payments/' . $paymentIntentId);

            if ($response->failed()) {
                return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => 'Failed to fetch Mollie payment.'];
            }

            $payment = $response->json();
            $status  = $payment['status'] ?? 'failed';

            return match ($status) {
                'paid'    => ['status' => 'successful', 'reference' => $paymentIntentId, 'message' => 'Payment paid.',    'details' => $payment],
                'open', 'pending' => ['status' => 'pending', 'reference' => $paymentIntentId, 'message' => 'Payment pending.', 'details' => $payment],
                default   => ['status' => 'failed',     'reference' => $paymentIntentId, 'message' => 'Payment status: ' . $status, 'details' => $payment],
            };
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => $e->getMessage()];
        }
    }

    public function refund(string $transactionId, float $amount): array
    {
        $currency = $this->config['currency'] ?? 'EUR';

        try {
            $response = $this->http()->post(self::BASE_URL . '/payments/' . $transactionId . '/refunds', [
                'amount' => ['currency' => $currency, 'value' => number_format($amount, 2, '.', '')],
            ]);

            if ($response->failed()) {
                $error = $response->json('detail') ?? $response->status();
                return ['status' => 'error', 'reference' => null, 'message' => 'Mollie refund failed: ' . $error];
            }

            $refund = $response->json();
            return ['status' => 'refunded', 'reference' => $refund['id'], 'message' => 'Refund initiated via Mollie.'];
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    public function getFrontendConfig(): array
    {
        return ['currency' => $this->config['currency'] ?? 'EUR'];
    }

    // Mollie sends only the payment ID in the POST body — verify by fetching the payment
    public function handleWebhook(Request $request): array
    {
        $paymentId = $request->input('id');
        if (!$paymentId) {
            throw new WebhookSignatureException('Mollie webhook missing payment ID.');
        }

        $result = $this->retrieveIntentStatus($paymentId);
        $status = $result['status'] ?? 'failed';

        Log::notice('Mollie webhook received.', ['payment_id' => $paymentId, 'status' => $status]);

        if ($status === 'successful') {
            $metadata = $result['details']['metadata'] ?? [];
            return [
                'status'         => 'processed',
                'payment_status' => 'paid',
                'reference'      => $paymentId,
                'order_id'       => $metadata['order_id'] ?? null,
                'message'        => 'Payment paid.',
            ];
        }

        if ($status === 'failed') {
            return ['status' => 'failed', 'payment_status' => 'failed', 'reference' => $paymentId, 'message' => 'Payment failed or cancelled.'];
        }

        return ['status' => 'ignored', 'message' => 'Payment in status: ' . ($result['details']['status'] ?? 'unknown')];
    }
}
