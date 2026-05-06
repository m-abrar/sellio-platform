<?php

// File: database/seeders/PaymentSeeder.php
// Purpose: Seeds the 'payments' table, establishing sample transaction records for various polymorphic payment types
// (Subscriptions, PropertyBookings, EventBookings). It also simulates the corresponding wallet deposit for completed payments.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\PropertyBooking; 
use App\Models\EventBooking; 	
use Faker\Factory as Faker;

/**
 * Class PaymentSeeder
 *
 * Seeds dummy payment records linked to different transactional entities
 * (Payables) using polymorphism. It integrates with a wallet system to
 * simulate fund deposits for successful payments.
 */
class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Fetches existing payable records (Subscriptions, Bookings) and creates a fixed number
     * of associated payment records, handling wallet deposits for successful transactions.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        // Header
        $this->command->info('💳 Starting Payment Module Seeding...'); 
        
        // Truncate the table for a clean run, ensuring no old test data persists.
        Payment::query()->delete();

        // 1. Fetch Existing Payable Records for linking via polymorphism
        $subscriptions = Subscription::all();
        $propertyBookings = PropertyBooking::all();
        $eventBookings = EventBooking::all();
        $users = User::pluck('id')->toArray();

        // Check for necessary data before proceeding to avoid errors when other seeders haven't run.
        if ($subscriptions->isEmpty() || $propertyBookings->isEmpty() || $eventBookings->isEmpty() || empty($users)) {
             $this->command->error('❌ Skipping PaymentSeeder: Missing dependencies (Subscriptions, PropertyBookings, EventBookings, or Users). Please ensure related seeders ran successfully.');
             return;
        }

        $recordsPerType = 10; // Sets the target number of payments to create for each payable type.
        $totalPaymentsCreated = 0;
        $totalDeposits = 0;

        // --- 2. Create Payments for Subscriptions ---
        $this->command->line("\n--- 💰 Seeding Subscription Payments (targeting {$recordsPerType} records) ---");
        $subscriptionPayments = 0;
        $subscriptionDeposits = 0;

        // Links the payments to the Subscription model.
        $subscriptions->take($recordsPerType)->each(function ($subscription) use ($faker, &$subscriptionPayments, &$subscriptionDeposits) {
            $status = $this->createAndDepositPayment(
                $faker, 
                $subscription, 
                'App\Models\Subscription', 
                $subscription->user_id,
                // Use the subscription's amount if available, otherwise fake a price.
                $subscription->amount ?? $faker->randomFloat(2, 10, 200) 
            );
            $subscriptionPayments++;
            if ($status === 'completed') {
               $subscriptionDeposits++;
            }
        });
        $this->command->info("  ✅ Subscription Payments: {$subscriptionPayments} created. {$subscriptionDeposits} deposits processed.");
        $totalPaymentsCreated += $subscriptionPayments;
        $totalDeposits += $subscriptionDeposits;


        // --- 3. Create Payments for Property Bookings ---
        $this->command->line("\n--- 🏘️ Seeding Property Booking Payments (targeting {$recordsPerType} records) ---");
        $propertyPayments = 0;
        $propertyDeposits = 0;

        // Links the payments to the PropertyBooking model.
        $propertyBookings->take($recordsPerType)->each(function ($booking) use ($faker, &$propertyPayments, &$propertyDeposits) {
            $status = $this->createAndDepositPayment(
                $faker, 
                $booking, 
                'App\Models\PropertyBooking', 
                $booking->user_id,
                // Use the booking's total price if available, otherwise fake a price.
                $booking->total_price ?? $faker->randomFloat(2, 50, 5000) 
            );
            $propertyPayments++;
            if ($status === 'completed') {
                $propertyDeposits++;
            }
        });
        $this->command->info("  ✅ Property Booking Payments: {$propertyPayments} created. {$propertyDeposits} deposits processed.");
        $totalPaymentsCreated += $propertyPayments;
        $totalDeposits += $propertyDeposits;


        // --- 4. Create Payments for Event Bookings ---
        $this->command->line("\n--- 🎫 Seeding Event Booking Payments (targeting {$recordsPerType} records) ---");
        $eventPayments = 0;
        $eventDeposits = 0;

        // Links the payments to the EventBooking model.
        $eventBookings->take($recordsPerType)->each(function ($booking) use ($faker, &$eventPayments, &$eventDeposits) {
            $status = $this->createAndDepositPayment(
                $faker, 
                $booking, 
                'App\Models\EventBooking', 
                $booking->user_id,
                // Use the booking's price if available, otherwise fake a price.
                $booking->price ?? $faker->randomFloat(2, 5, 500) 
            );
            $eventPayments++;
            if ($status === 'completed') {
               $eventDeposits++;
            }
        });
        $this->command->info("  ✅ Event Booking Payments: {$eventPayments} created. {$eventDeposits} deposits processed.");
        $totalPaymentsCreated += $eventPayments;
        $totalDeposits += $eventDeposits;

        
        // Final Summary Footer
        $this->command->info("\n--- 🏁 Payment Seeding Complete ---");
        $this->command->info("🎉 Total Payments Created: {$totalPaymentsCreated}");
        $this->command->info("💵 Total Wallet Deposits Processed: {$totalDeposits}");
    }

    /**
     * Helper function to create the payment record and handle the wallet deposit if completed.
     *
     * This method handles the creation of a polymorphic Payment record and, if the status
     * is 'completed', converts the amount to cents and deposits it into the associated user's wallet.
     *
     * @param \Faker\Generator $faker The Faker instance for generating fake data.
     * @param object $payable The model instance that the payment is linked to (Subscription, Booking, etc.).
     * @param string $type The fully qualified class name of the payable model (e.g., 'App\Models\Subscription').
     * @param int $userId The ID of the user who made the payment.
     * @param float $amount The payment amount in dollars (float).
     * @return string The payment status ('completed', 'failed', 'refunded').
     */
    private function createAndDepositPayment($faker, $payable, string $type, int $userId, float $amount): string
    {
        $status = $faker->randomElement(['completed', 'failed', 'refunded']);
        // Only payments that are completed or refunded have a paid status and potentially a transaction ID.
        $isPaid = $status === 'completed' || $status === 'refunded';

        // 1. Create the Payment record using the model
        $payment = Payment::create([
            'user_id' => $userId,
            'amount' => $amount, // Stored in dollars (float)
            'currency' => 'USD',
            'transaction_id' => $isPaid ? 'TRN-' . $faker->uuid() : null, // Only assign a transaction ID if a transaction occurred.
            'payment_method' => $faker->randomElement(['credit_card', 'paypal', 'bank_transfer', 'wallet']),
            'status' => $status,
            'admin_note' => 'System generated payment record.',
            'paid_at' => $isPaid ? $faker->dateTimeBetween('-12 months', 'now') : null,
            // Set up the polymorphic relationship keys
            'payable_type' => $type,
            'payable_id' => $payable->id,
            'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
        ]);

        // 2. Handle Wallet Deposit if payment is completed
        if ($payment->status === 'completed') {
            // Business logic: Wallet systems typically store currency in the smallest unit (cents) to avoid float issues.
            $amountInCents = (int) round($payment->amount * 100); 

            // Find the user to deposit into their wallet
            $user = User::find($userId);

            if ($user) {
                // Deposit the amount using the 'deposit' method (assuming a package like 'laravel-wallet' or similar is used).
                // NOTE: This assumes the User model has a deposit method provided by a wallet package.
                $transaction = $user->deposit($amountInCents, [
                    'description' => 'Payment completed for ' . class_basename($payment->payable_type) . ' #' . $payment->payable_id,
                    'payment_id' => $payment->id,
                ]);
                
                // Crucial for seeding: force the wallet transaction's timestamps to match the payment's paid_at date
                // to maintain historical consistency for reporting purposes.
                $transaction->forceFill([
                    'created_at' => $payment->paid_at,
                    'updated_at' => $payment->paid_at,
                ])->save();
            } 
        }
        
        return $payment->status;
    }
}