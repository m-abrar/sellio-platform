<?php

namespace Database\Seeders\Payment;

use App\Models\GatewayCredential;
use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class MollieGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'mollie'],
            [
                'title'      => 'Mollie',
                'class_name' => 'App\Services\MollieGatewayService',
                'is_active'  => false,
                'sort_order' => 50,
            ]
        );

        $fields = [
            ['key' => 'api_key',     'label' => 'API Key',           'input_type' => 'password', 'is_required' => true,  'is_sensitive' => true,  'description' => 'Your Mollie API key (test_... or live_...)'],
            ['key' => 'webhook_url', 'label' => 'Webhook URL',        'input_type' => 'text',     'is_required' => false, 'is_sensitive' => false, 'description' => 'The URL Mollie will POST payment status updates to'],
            ['key' => 'currency',    'label' => 'Default Currency',   'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'e.g., EUR, GBP, USD'],
        ];

        foreach ($fields as $index => $field) {
            $gateway->blueprints()->updateOrCreate(
                ['key' => $field['key']],
                array_merge($field, ['sort_order' => ($index + 1) * 10])
            );
        }

        GatewayCredential::firstOrCreate(
            ['payment_gateway_id' => $gateway->id],
            ['live_config' => [], 'sandbox_config' => []]
        );
    }
}
