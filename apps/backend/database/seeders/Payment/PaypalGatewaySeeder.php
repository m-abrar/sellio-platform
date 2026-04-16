<?php

namespace Database\Seeders\Payment;

use App\Models\PaymentGateway;
use App\Models\GatewayCredential;
use App\Models\GatewayFieldBlueprint;
use Illuminate\Database\Seeder;

class PaypalGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'paypal'],
            [
                'title' => 'PayPal',
                'class_name' => 'App\Services\PaypalGatewayService',
                'is_active' => false,
                'sort_order' => 20,
            ]
        );

        // ----------------------------------------------------
        // 1. Blueprint (Admin Form Schema) - PayPal needs different keys!
        // ----------------------------------------------------
        $fields = [
            ['key' => 'client_id', 'label' => 'Client ID', 'input_type' => 'text', 'is_required' => true, 'is_sensitive' => false],
            ['key' => 'client_secret', 'label' => 'Client Secret', 'input_type' => 'password', 'is_required' => true, 'is_sensitive' => true],
            ['key' => 'app_id', 'label' => 'App ID', 'input_type' => 'text', 'is_required' => false, 'is_sensitive' => false],
            ['key' => 'return_url', 'label' => 'Success Return URL', 'input_type' => 'text', 'is_required' => true, 'is_sensitive' => false],
        ];

        foreach ($fields as $index => $field) {
            $gateway->blueprints()->updateOrCreate(
                ['key' => $field['key']],
                array_merge($field, ['sort_order' => ($index + 1) * 10])
            );
        }
        
        // ----------------------------------------------------
        // 2. Initial Credentials Record (Empty)
        // ----------------------------------------------------
        GatewayCredential::firstOrCreate(
            ['payment_gateway_id' => $gateway->id],
            ['live_config' => [], 'sandbox_config' => []]
        );
    }
}