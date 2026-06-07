<?php

namespace Database\Seeders\Payment;

use App\Models\PaymentGateway;
use App\Models\GatewayCredential;
use App\Models\GatewayFieldBlueprint;
use Illuminate\Database\Seeder;

class StripeGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'stripe'],
            [
                'title' => 'Stripe',
                'class_name' => 'App\Services\StripeGatewayService',
                'is_active' => false,
                'sort_order' => 10,
            ]
        );

        // ----------------------------------------------------
        // 1. Blueprint (Admin Form Schema) - This logic is correct
        // ----------------------------------------------------
        $fields = [
             ['key' => 'secret_key', 'label' => 'API Secret Key', 'input_type' => 'password', 'is_required' => true, 'is_sensitive' => true, 'description' => 'Your live Stripe Secret Key (sk_live_...)'],
             ['key' => 'publishable_key', 'label' => 'Publishable Key', 'input_type' => 'text', 'is_required' => true, 'is_sensitive' => false, 'description' => 'Your live Stripe Publishable Key (pk_live_...)'],
             ['key' => 'webhook_secret', 'label' => 'Webhook Signing Secret', 'input_type' => 'text', 'is_required' => false, 'is_sensitive' => true, 'description' => 'Secret used to verify webhook payloads.'],
             ['key' => 'currency', 'label' => 'Default Currency', 'input_type' => 'text', 'is_required' => true, 'is_sensitive' => false, 'description' => 'e.g., USD, EUR'],
        ];

        foreach ($fields as $index => $field) {
            $gateway->blueprints()->updateOrCreate(
                ['key' => $field['key']],
                array_merge($field, ['sort_order' => ($index + 1) * 10])
            );
        }
        
        // ----------------------------------------------------
        // 2. Initial Credentials Record (Empty/Encrypted)
        // Use the relationship to create the credentials record cleanly.
        // ----------------------------------------------------
        $sandboxConfig = array_filter([
            'secret_key' => env('STRIPE_SECRET_KEY') ?: env('STRIPE_SECRET'),
            'publishable_key' => env('STRIPE_PUBLISHABLE_KEY') ?: env('STRIPE_KEY'),
            'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
            'currency' => env('STRIPE_CURRENCY', 'USD'),
        ], fn ($value) => filled($value));

        $liveConfig = array_filter([
            'secret_key' => env('STRIPE_LIVE_SECRET_KEY'),
            'publishable_key' => env('STRIPE_LIVE_PUBLISHABLE_KEY'),
            'webhook_secret' => env('STRIPE_LIVE_WEBHOOK_SECRET'),
            'currency' => env('STRIPE_CURRENCY', 'USD'),
        ], fn ($value) => filled($value));

        $gateway->credentials()->firstOrCreate(
            [],
            [
                'live_config' => $liveConfig,
                'sandbox_config' => $sandboxConfig,
            ]
        );

        if (!empty($sandboxConfig['secret_key']) && !empty($sandboxConfig['publishable_key'])) {
            $gateway->forceFill([
                'is_active' => true,
                'mode' => PaymentGateway::MODE_SANDBOX,
            ])->save();
        }
    }
}