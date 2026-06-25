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
            RazorpayGatewaySeeder::class,
            FlutterwaveGatewaySeeder::class,
            MollieGatewaySeeder::class,
            PaystackGatewaySeeder::class,
        ]);
        
        // Add more gateway seeders here as you integrate them!
    }
}