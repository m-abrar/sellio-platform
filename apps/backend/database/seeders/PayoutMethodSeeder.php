<?php
// File: apps/backend/database/seeders/PayoutMethodSeeder.php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PayoutMethod;
use Illuminate\Database\Seeder;

class PayoutMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if ($this->command) {
            $this->command->info('💳 Starting Payout Method Seeder...');
            PayoutMethod::truncate();
            $this->command->line('  🗑️ Cleared existing payout methods.');
        }

        $users = User::all();
        $seededCount = 0;

        foreach ($users as $user) {
            // Seed a Primary Bank Account
            PayoutMethod::create([
                'user_id' => $user->id,
                'type' => 'bank_transfer',
                'details' => [
                    'bank_name' => 'Chase Bank',
                    'account_holder' => $user->name,
                    'account_number' => '**** 4290',
                    'routing_number' => '121000248',
                ],
                'is_primary' => true,
            ]);

            // Seed a Secondary PayPal Account
            PayoutMethod::create([
                'user_id' => $user->id,
                'type' => 'paypal',
                'details' => [
                    'email' => strtolower(str_replace(' ', '.', $user->name)) . '-payout@paypal.com',
                ],
                'is_primary' => false,
            ]);

            $seededCount += 2;
        }

        if ($this->command) {
            $this->command->info("✅ Successfully seeded {$seededCount} payout methods for {$users->count()} users.");
        }
    }
}
