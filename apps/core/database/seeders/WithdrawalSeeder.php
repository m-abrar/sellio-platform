<?php

// File: database/seeders/WithdrawalSeeder.php
// Purpose: Handles the creation of dummy Withdrawal records for development and testing.
// It relies on pre-existing users having a calculated wallet balance.

namespace Database\Seeders;

use App\Models\Withdrawal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Illuminate\Support\Collection;

/**
 * Class WithdrawalSeeder
 *
 * Handles the creation of dummy Withdrawal records for development and testing.
 *
 * This seeder iterates over existing users who have a sufficient wallet balance
 * and creates mock withdrawal requests with varying statuses (pending, approved, rejected)
 * to populate the database with realistic data.
 */
class WithdrawalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Fetches users with a balance above a minimum threshold and creates realistic
     * withdrawal records, setting historical dates and statuses.
     *
     * @return void
     */
    public function run(): void
    {
        // Initialize Faker instance for generating random data
        $faker = Faker::create();
        
        if ($this->command) {
            $this->command->info('💸 Starting Withdrawal Seeder...');
            DB::table('withdrawals')->delete();
            $this->command->line('  🗑️ Cleared existing withdrawal records.');
        }

        // Define the minimum required balance in cents for a user to be considered for a withdrawal seed.
        // This ensures generated withdrawals are valid according to business rules (e.g., $10.00 USD).
        $minBalanceToWithdraw = 1000;

        // --- 1. Fetch Users with a positive balance ---
        /** @var Collection $users */
        // We filter for users whose current wallet balance is greater than the required minimum threshold.
        $users = User::all()->filter(function ($user) use ($minBalanceToWithdraw) {
            // Note: $user->balance typically comes from a trait (like 'HasWallet')
            // and returns the balance stored in cents (integer).
            return $user->balance > $minBalanceToWithdraw;
        });

        $count = 0;
        // Limit the number of withdrawals created to prevent excessive seeding on large databases.
        $maxNumberOfWithdrawalsToCreate = 100;

        // Provide feedback to the developer about the number of eligible users found.
        if ($this->command) {
            // Assumes a global helper `humanAmount()` exists for formatting cents to a human-readable currency string.
            // If humanAmount is not defined, we fallback to simple division for display.
            $formattedMinBalance = function_exists('humanAmount') 
                ? humanAmount($minBalanceToWithdraw / 100) 
                : '$' . number_format($minBalanceToWithdraw / 100, 2);

            $this->command->info("Found {$users->count()} users with sufficient balance (> {$formattedMinBalance}) for withdrawal seeding.");
        }

        // --- 2. Iterate and create calculated withdrawals ---
        // We take a limited number of eligible users to create the withdrawal records.
        foreach ($users->take($maxNumberOfWithdrawalsToCreate) as $user) {
            $balanceCents = $user->balance;

            // Select a random withdrawal percentage between 70% and 80% of the user's current balance.
            $percentage = mt_rand(70, 80) / 100;

            // Calculate the withdrawal amount in cents.
            // floor() is used to ensure the amount is a valid integer (cents) and does not exceed cent precision.
            $withdrawalCents = floor($balanceCents * $percentage);

            // Final check: if the calculated amount falls below the minimum required, skip this user.
            if ($withdrawalCents < $minBalanceToWithdraw) {
                continue;
            }

            // Determine a random status for the withdrawal to represent different states in history.
            $status = $faker->randomElement(['pending', 'approved', 'rejected']);
            // Set a historical creation date within the last 8 months.
            $createdAt = $faker->dateTimeBetween('-8 months', 'now');

            // Initialize conditional date fields.
            $approvedAt = null;
            $rejectedAt = null;

            // Set the appropriate historical date based on the determined status.
            if ($status === 'approved') {
                // Approved date must logically be after the creation date.
                $approvedAt = $faker->dateTimeBetween($createdAt, 'now');
            } elseif ($status === 'rejected') {
                // Rejected date must logically be after the creation date.
                $rejectedAt = $faker->dateTimeBetween($createdAt, 'now');
            }

            // --- Create the Withdrawal Record ---
            Withdrawal::create([
                'user_id' => $user->id,
                'amount' => $withdrawalCents,
                'method' => $faker->randomElement(['Bank Transfer', 'PayPal', 'Wire Transfer']),
                // Store payment account details as a JSON string, mimicking real-world data storage.
                'details' => json_encode(['account' => $faker->bankAccountNumber(), 
                'name' => $faker->name()]),
                'status' => $status,
                'admin_note' => $faker->sentence(),
                // Set the conditional and historical timestamps.
                'approved_at' => $approvedAt,
                'rejected_at' => $rejectedAt,
                'created_at' => $createdAt,
            ]);

            $count++;
            // Stop loop if the maximum number of desired records has been created.
            if ($count >= $maxNumberOfWithdrawalsToCreate) break;
        }

        // Final feedback message to confirm the total number of records successfully seeded.
        if ($this->command) {
            $this->command->info("✅ Successfully created {$count} withdrawal records based on user balances.");
            $this->command->info('--- 🏁 Withdrawal Seeding Complete ---');
        }
    }
}