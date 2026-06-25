<?php

namespace App\Services;

use App\Contracts\PaymentGatewayService;
use App\Exceptions\WebhookSignatureException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ManualGatewayService implements PaymentGatewayService
{
    protected array $config;

    public function __construct(array $config)
    {
        if (empty($config['account_number']) && empty($config['iban'])) {
            throw new Exception('Manual gateway requires at least account_number or IBAN to be configured.');
        }
        $this->config = $config;
    }

    // Returns pending_auth with bank details — no API call made.
    // The checkout controller is responsible for handling the file upload
    // and storing the path in payments.proof_file.
    public function charge(float $amount, string $token, string $returnUrl, array $metadata = []): array
    {
        Log::info('Manual payment initiated — awaiting buyer proof upload.', [
            'amount'   => $amount,
            'metadata' => $metadata,
        ]);

        return [
            'status'       => 'pending_auth',
            'reference'    => 'MANUAL-' . strtoupper(uniqid()),
            'redirect_url' => null,
            'bank_details' => $this->getBankDetails(),
            'message'      => 'Please transfer the amount to the bank account below and upload your payment receipt.',
        ];
    }

    // Manual payments stay pending until an admin reviews and approves them.
    public function retrieveIntentStatus(string $paymentIntentId): array
    {
        return [
            'status'    => 'pending',
            'reference' => $paymentIntentId,
            'message'   => 'Awaiting admin verification of uploaded payment proof.',
        ];
    }

    // Refunds are handled manually — notify admin via admin_note.
    public function refund(string $transactionId, float $amount): array
    {
        Log::notice('Manual gateway refund requested — must be processed offline.', [
            'reference' => $transactionId,
            'amount'    => $amount,
        ]);

        return [
            'status'    => 'pending',
            'reference' => $transactionId,
            'message'   => 'Refund for manual/bank payment must be processed offline. Please contact the customer directly.',
        ];
    }

    // Returns bank details and instructions for the checkout UI to display.
    public function getFrontendConfig(): array
    {
        return [
            'bank_details' => $this->getBankDetails(),
            'instructions' => $this->config['instructions'] ?? null,
        ];
    }

    // No webhook for manual payments.
    public function handleWebhook(Request $request): array
    {
        return ['status' => 'ignored', 'message' => 'Manual gateway does not process webhooks.'];
    }

    private function getBankDetails(): array
    {
        return array_filter([
            'bank_name'      => $this->config['bank_name']      ?? null,
            'account_name'   => $this->config['account_name']   ?? null,
            'account_number' => $this->config['account_number'] ?? null,
            'routing_number' => $this->config['routing_number'] ?? null,
            'iban'           => $this->config['iban']           ?? null,
            'swift_bic'      => $this->config['swift_bic']      ?? null,
            'instructions'   => $this->config['instructions']   ?? null,
        ], fn ($v) => filled($v));
    }
}
