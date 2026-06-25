<?php

namespace Database\Seeders\Payment;

use App\Models\GatewayCredential;
use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class FlutterwaveGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'flutterwave'],
            [
                'title'      => 'Flutterwave',
                'class_name' => 'App\Services\FlutterwaveGatewayService',
                'is_active'  => false,
                'sort_order' => 40,
            ]
        );

        $fields = [
            ['key' => 'public_key',          'label' => 'Public Key',           'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'Your Flutterwave Public Key (FLW-PUBK-...)'],
            ['key' => 'secret_key',          'label' => 'Secret Key',           'input_type' => 'password', 'is_required' => true,  'is_sensitive' => true,  'description' => 'Your Flutterwave Secret Key (FLW-SECKEY-...)'],
            ['key' => 'webhook_secret_hash', 'label' => 'Webhook Secret Hash',  'input_type' => 'password', 'is_required' => false, 'is_sensitive' => true,  'description' => 'Secret hash set in your Flutterwave dashboard for webhook verification'],
            ['key' => 'currency',            'label' => 'Default Currency',      'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'e.g., NGN, GHS, KES, USD'],
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
