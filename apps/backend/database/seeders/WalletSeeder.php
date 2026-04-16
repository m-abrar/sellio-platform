<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Bavix\Wallet\Exceptions\NotEnoughFunds;
use Bavix\Wallet\Models\Wallet;
use Illuminate\Database\Eloquent\Builder;

/**
 * Seeds the database with initial wallet transactions for a key "Partner" user.
 *
 * This seeder is crucial for populating development or staging environments with
 * a user who has a full transaction history (bonus, deposits, withdrawals)
 * required for testing the financial management features.
 */
class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds, initializing a test partner's wallet with transactions.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->info('💰 Starting Wallet Seeder for Test Partner...');

        // 1. Find or Create the designated Test Partner User
        /** @var User $partner */
        $partner = User::query()
            ->where('email', 'partner@example.com')
            ->first();

        // If the partner doesn't exist, create a basic one to ensure the seeding can proceed.
        if (!$partner) {
            $partner = User::factory()->create([
                'name' => 'Test Partner',
                'email' => 'partner@example.com',
                'password' => bcrypt('password'), // Use a standard password for easy login
            ]);
            $this->command->info('  Created new Test Partner user.');
        }

        // Ensure the partner's wallet is initialized and retrieve the instance.
        /** @var Wallet $wallet */
        // Accessing the 'wallet' relation ensures the Wallet model is created if it doesn't exist.
        $wallet = $partner->wallet;

        // 2. Award the Joining Bonus (Idempotent Check)
        $bonusAmount = 5000; // $50.00 USD in cents (standard currency storage unit)
        $bonusType = 'joining_bonus';

        // Check for the existence of a previous deposit transaction with specific metadata.
        // This ensures the bonus is awarded only once if the seeder is run multiple times (idempotency).
        $hasBonus = $partner->transactions()
            ->where('type', 'deposit')
            ->where(function (Builder $query) use ($bonusType) {
                // Use the database JSON column operator to query the metadata for the specific type.
                $query->where("meta->type", $bonusType);
            })
            ->exists();

        if (!$hasBonus) {
            // Use a database transaction to ensure the deposit operation is atomic.
            DB::transaction(function () use ($partner, $bonusAmount, $bonusType) {
                // The deposit method uses the default wallet.
                $partner->deposit($bonusAmount, [
                    'type' => $bonusType,
                    'description' => 'Welcome joining bonus for new partner',
                    'partner_id' => $partner->id, // Contextual metadata for tracing
                ]);
            });
            $this->command->info("  Awarded partner joining bonus of $" . ($bonusAmount / 100) . "!");
        } else {
            $this->command->line('  Partner already has the joining bonus. Skipping.');
        }

        // 3. Add a Sample Earning Deposit (e.g., Commission)
        $partner->deposit(12000, [ // $120.00 USD
            'type' => 'commission_deposit',
            'description' => 'Commission for successful listing sale',
            'listing_id' => 101, // Link to a mock listing ID for context
        ]);
        $this->command->info('  Added a sample commission deposit.');


        // 4. Add a Sample Withdrawal
        $withdrawalAmount = 7000; // $70.00 USD
        try {
            // Always check the current balance before attempting a withdrawal.
            if ($partner->balance >= $withdrawalAmount) {
                // The withdraw method creates a negative balance transaction (withdrawal).
                $partner->withdraw($withdrawalAmount, [
                    'type' => 'withdrawal_request',
                    'description' => 'Partner withdrawal request #001',
                ]);
                $this->command->info('  Added a sample successful withdrawal.');
            } else {
                // Use warn if the condition fails but the code is robust enough to handle it.
                $this->command->line('  Skipped sample withdrawal: Partner balance is too low.');
            }
        } catch (NotEnoughFunds $e) {
            // Catch the specific exception thrown by the wallet package when the balance is insufficient.
            $this->command->error('  Error during sample withdrawal: Not enough funds!');
        }

        // Output the final computed balance for verification purposes.
        $this->command->info('✅ Final Partner Balance: $' . ($partner->balance / 100));
        $this->command->info('--- 🏁 Wallet Seeding Complete ---');
    }
}