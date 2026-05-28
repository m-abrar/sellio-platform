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
            // Delete all withdrawals except for the demo partner to preserve their high-fidelity transactions
            \App\Models\Withdrawal::whereHas('user', function($q) {
                $q->where('email', '!=', 'partner@sellio-platform.test');
            })->delete();
            $this->command->line('  🗑️ Cleared existing non-demo withdrawal records.');
        }

        // Define the minimum required balance in cents for a user to be considered for a withdrawal seed.
        // This ensures generated withdrawals are valid according to business rules (e.g., $10.00 USD).
        $minBalanceToWithdraw = 1000;

        $count = 0;
        // Limit the number of withdrawals created to prevent excessive seeding on large databases.
        $maxNumberOfWithdrawalsToCreate = 100;

        // --- 1. Fetch Users with a positive balance using chunkById for performance ---
        User::whereHas('wallet', function($query) use ($minBalanceToWithdraw) {
            $query->where('balance', '>', $minBalanceToWithdraw);
        })->where('email', '!=', 'partner@sellio-platform.test') // Exclude the demo partner to preserve their balance and transactions
        ->orderBy('id')->chunkById(25, function ($users) use (&$count, $maxNumberOfWithdrawalsToCreate, $faker, $minBalanceToWithdraw) {
            $batchWithdrawals = [];
            foreach ($users as $user) {
                if ($count >= $maxNumberOfWithdrawalsToCreate) break;
                
                $balanceCents = $user->balance;
                $percentage = mt_rand(70, 80) / 100;
                $withdrawalCents = floor($balanceCents * $percentage);

                if ($withdrawalCents < $minBalanceToWithdraw) {
                    continue;
                }

                $status = $faker->randomElement(['pending', 'approved', 'rejected']);
                $createdAt = $faker->dateTimeBetween('-8 months', 'now');
                $approvedAt = ($status === 'approved') ? $faker->dateTimeBetween($createdAt, 'now') : null;
                $rejectedAt = ($status === 'rejected') ? $faker->dateTimeBetween($createdAt, 'now') : null;

                $batchWithdrawals[] = [
                    'user_id' => $user->id,
                    'amount' => $withdrawalCents,
                    'method' => $faker->randomElement(['Bank Transfer', 'PayPal', 'Wire Transfer']),
                    'details' => json_encode([
                        'account' => $faker->bankAccountNumber(), 
                        'name' => $faker->name()
                    ]),
                    'status' => $status,
                    'admin_note' => $faker->sentence(),
                    'approved_at' => $approvedAt ? $approvedAt->format('Y-m-d H:i:s') : null,
                    'rejected_at' => $rejectedAt ? $rejectedAt->format('Y-m-d H:i:s') : null,
                    'created_at' => $createdAt->format('Y-m-d H:i:s'),
                    'updated_at' => now()->toDateTimeString(),
                ];

                $count++;
            }
            
            if (!empty($batchWithdrawals)) {
                Withdrawal::insert($batchWithdrawals);
            }
        });

        // Final feedback message to confirm the total number of records successfully seeded.
        if ($this->command) {
            $this->command->info("✅ Successfully created {$count} withdrawal records based on user balances.");
            $this->command->info('--- 🏁 Withdrawal Seeding Complete ---');
        }
    }
}