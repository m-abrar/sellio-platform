<?php

namespace Database\Seeders\Payment;

use App\Models\GatewayCredential;
use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class PaystackGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'paystack'],
            [
                'title'      => 'Paystack',
                'class_name' => 'App\Services\PaystackGatewayService',
                'is_active'  => false,
                'sort_order' => 60,
            ]
        );

        $fields = [
            ['key' => 'public_key', 'label' => 'Public Key',        'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'Your Paystack Public Key (pk_test_... or pk_live_...)'],
            ['key' => 'secret_key', 'label' => 'Secret Key',        'input_type' => 'password', 'is_required' => true,  'is_sensitive' => true,  'description' => 'Your Paystack Secret Key (sk_test_... or sk_live_...)'],
            ['key' => 'currency',   'label' => 'Default Currency',   'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'e.g., NGN, GHS, ZAR, USD, KES'],
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
