<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RazorpayGatewayService implements PaymentGatewayService
{
    protected array $config;
    private const BASE_URL = 'https://api.razorpay.com/v1';

    public function __construct(array $config)
    {
        if (empty($config['key_id']) || empty($config['key_secret'])) {
            throw new Exception('Razorpay key_id and key_secret are required.');
        }
        $this->config = $config;
    }

    private function http()
    {
        return Http::withBasicAuth($this->config['key_id'], $this->config['key_secret'])
            ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
            ->acceptJson();
    }

    public function charge(float $amount, string $token, string $returnUrl, array $metadata = []): array
    {
        $currency     = $this->config['currency'] ?? 'INR';
        $amountPaise  = (int) round($amount * 100);

        try {
            $response = $this->http()->post(self::BASE_URL . '/orders', [
                'amount'   => $amountPaise,
                'currency' => $currency,
                'receipt'  => $metadata['order_id'] ?? ('rcpt_' . uniqid()),
                'notes'    => $metadata,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.description') ?? $response->status();
                Log::error('Razorpay order creation failed.', ['error' => $error]);
                return ['status' => 'error', 'reference' => null, 'message' => 'Razorpay error: ' . $error];
            }

            $order = $response->json();
            Log::info('Razorpay order created.', ['order_id' => $order['id']]);

            return [
                'status'       => 'pending_auth',
                'reference'    => $order['id'],
                'order'        => $order,
                'key_id'       => $this->config['key_id'],
                'redirect_url' => $returnUrl,
                'message'      => 'Redirect to Razorpay checkout.',
            ];
        } catch (Exception $e) {
            Log::error('Razorpay charge exception.', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    // $paymentIntentId is the Razorpay payment_id (pay_...)
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        try {
            $response = $this->http()->get(self::BASE_URL . '/payments/' . $paymentIntentId);

            if ($response->failed()) {
                return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => 'Failed to fetch Razorpay payment.'];
            }

            $payment = $response->json();
            $status  = $payment['status'] ?? 'failed';

            return match ($status) {
                'captured'   => ['status' => 'successful', 'reference' => $paymentIntentId, 'message' => 'Payment captured.',               'details' => $payment],
                'authorized' => ['status' => 'pending',    'reference' => $paymentIntentId, 'message' => 'Authorized, awaiting capture.', 'details' => $payment],
                default      => ['status' => 'failed',     'reference' => $paymentIntentId, 'message' => 'Payment status: ' . $status,     'details' => $payment],
            };
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => $paymentIntentId, 'message' => $e->getMessage()];
        }
    }

    public function refund(string $transactionId, float $amount): array
    {
        $amountPaise = (int) round($amount * 100);

        try {
            $response = $this->http()->post(self::BASE_URL . '/payments/' . $transactionId . '/refund', [
                'amount' => $amountPaise,
            ]);

            if ($response->failed()) {
                $error = $response->json('error.description') ?? $response->status();
                return ['status' => 'error', 'reference' => null, 'message' => 'Razorpay refund failed: ' . $error];
            }

            $refund = $response->json();
            return ['status' => 'refunded', 'reference' => $refund['id'], 'message' => 'Refund initiated via Razorpay.'];
        } catch (Exception $e) {
            return ['status' => 'error', 'reference' => null, 'message' => $e->getMessage()];
        }
    }

    public function getFrontendConfig(): array
    {
        return ['key_id' => $this->config['key_id']];
    }

    public function handleWebhook(Request $request): array
    {
        $webhookSecret = $this->config['webhook_secret'] ?? null;
        if (!$webhookSecret) {
            throw new Exception('Razorpay webhook_secret is missing from configuration.');
        }

        $payload   = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature');
        $expected  = hash_hmac('sha256', $payload, $webhookSecret);

        if (!hash_equals($expected, $signature ?? '')) {
            throw new WebhookSignatureException('Razorpay webhook signature mismatch.');
        }

        $data      = $request->json()->all();
        $eventType = $data['event'] ?? 'unknown';

        Log::notice('Razorpay webhook received.', ['event' => $eventType]);

        if ($eventType === 'payment.captured') {
            $payment = $data['payload']['payment']['entity'] ?? [];
            return [
                'status'         => 'processed',
                'payment_status' => 'paid',
                'reference'      => $payment['id'] ?? null,
                'order_id'       => $payment['order_id'] ?? null,
                'message'        => 'Payment captured.',
            ];
        }

        if ($eventType === 'payment.failed') {
            $payment = $data['payload']['payment']['entity'] ?? [];
            return [
                'status'         => 'failed',
                'payment_status' => 'failed',
                'reference'      => $payment['id'] ?? null,
                'message'        => $payment['error_description'] ?? 'Payment failed.',
            ];
        }

        return ['status' => 'ignored', 'message' => "Event {$eventType} acknowledged but not processed."];
    }
}
