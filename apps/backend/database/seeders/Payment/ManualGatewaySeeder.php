<?php

namespace Database\Seeders\Payment;

use App\Models\GatewayCredential;
use App\Models\PaymentGateway;
use Illuminate\Database\Seeder;

class ManualGatewaySeeder extends Seeder
{
    public function run(): void
    {
        $gateway = PaymentGateway::firstOrCreate(
            ['slug' => 'manual'],
            [
                'title'      => 'Bank Transfer / Manual',
                'class_name' => 'App\Services\ManualGatewayService',
                'is_active'  => false,
                'sort_order' => 70,
            ]
        );

        $fields = [
            ['key' => 'bank_name',      'label' => 'Bank Name',         'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'Name of the receiving bank (e.g., Chase, Barclays)'],
            ['key' => 'account_name',   'label' => 'Account Name',      'input_type' => 'text',     'is_required' => true,  'is_sensitive' => false, 'description' => 'Name on the bank account'],
            ['key' => 'account_number', 'label' => 'Account Number',    'input_type' => 'text',     'is_required' => false, 'is_sensitive' => true,  'description' => 'Bank account number'],
            ['key' => 'routing_number', 'label' => 'Routing Number',    'input_type' => 'text',     'is_required' => false, 'is_sensitive' => false, 'description' => 'ABA routing number (US banks)'],
            ['key' => 'iban',           'label' => 'IBAN',              'input_type' => 'text',     'is_required' => false, 'is_sensitive' => true,  'description' => 'International Bank Account Number'],
            ['key' => 'swift_bic',      'label' => 'SWIFT / BIC',      'input_type' => 'text',     'is_required' => false, 'is_sensitive' => false, 'description' => 'SWIFT or BIC code for international transfers'],
            ['key' => 'instructions',   'label' => 'Payment Instructions', 'input_type' => 'textarea', 'is_required' => true, 'is_sensitive' => false, 'description' => 'Shown to the buyer at checkout — include transfer reference instructions, turnaround time, etc.'],
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
