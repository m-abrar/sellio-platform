<?php

namespace App\Contracts;

interface PaymentGatewayService
{
    /**
     * Initializes the gateway service with configuration and client setup.
     * @param array $config The decrypted configuration array (live or sandbox).
     */
    public function __construct(array $config);

    /**
     * Executes a payment charge.
     */
    public function charge(float $amount, string $token, string $returnUrl): array;
    public function retrieveIntentStatus(string $paymentIntentId): array;
    /**
     * Executes a refund for a previous transaction.
     */
    public function refund(string $transactionId, float $amount): array;

    /**
     * Retrieves the non-sensitive configuration (e.g., Publishable Key) required for the frontend.
     * @return array
     */
    public function getFrontendConfig(): array;

    /**
     * Handles and processes incoming webhook payloads from the gateway.
     * @param string $payload The raw payload from the request body.
     * @param string|null $signature The signature header for verification.
     * @return array
     */
    public function handleWebhook(string $payload, ?string $signature = null): array;
}
