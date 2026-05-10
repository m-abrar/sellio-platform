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
     * @param float $amount The amount to charge.
     * @param string $token The payment token or method ID.
     * @param string $returnUrl The URL to redirect back to after 3DS/SCA.
     * @param array $metadata Optional metadata to attach to the transaction (e.g. order_id, booking_id).
     */
    public function charge(float $amount, string $token, string $returnUrl, array $metadata = []): array;
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
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function handleWebhook(\Illuminate\Http\Request $request): array;
}
