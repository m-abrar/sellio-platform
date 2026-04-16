<?php

namespace Database\Seeders\Payment;

use Illuminate\Database\Seeder;

class PaymentGatewaysSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            StripeGatewaySeeder::class,
            PaypalGatewaySeeder::class,
        ]);
        
        // Add more gateway seeders here as you integrate them!
    }
}