<?php

namespace Database\Seeders\Payment;

use App\Models\GatewayCredential;
use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class RazorpayGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'razorpay'],
            [
                'title'      => 'Razorpay',
                'class_name' => 'App\Services\RazorpayGatewayService',
                'is_active'  => false,
                'sort_order' => 30,
            ]
        );

        $fields = [
            ['key' => 'key_id',         'label' => 'Key ID',          'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'Your Razorpay Key ID (rzp_test_... or rzp_live_...)'],
            ['key' => 'key_secret',     'label' => 'Key Secret',      'input_type' => 'password', 'is_required' => true,  'is_sensitive' => true,  'description' => 'Your Razorpay Key Secret'],
            ['key' => 'webhook_secret', 'label' => 'Webhook Secret',  'input_type' => 'password', 'is_required' => false, 'is_sensitive' => true,  'description' => 'Secret for verifying Razorpay webhook signatures'],
            ['key' => 'currency',       'label' => 'Default Currency', 'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'e.g., INR, USD'],
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
