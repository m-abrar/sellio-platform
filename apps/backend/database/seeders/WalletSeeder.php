<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Withdrawal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class WalletSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('💰 Starting High-Fidelity Wallet Seeder for Demo Partner...');

        // 1. Find or Create the designated Test Partner User
        /** @var User $partner */
        $partner = User::query()
            ->where('email', 'partner@sellio-platform.test')
            ->first();

        if (!$partner) {
            $partner = User::create([
                'name' => 'Julian Sterling',
                'email' => 'partner@sellio-platform.test',
                'password' => bcrypt('password'),
                'status' => 'active',
                'admin_note' => 'System generated demo partner account.',
                'email_verified_at' => now(),
            ]);
        }

        // Initialize/Reset the partner's wallet balance and previous transactions
        $partner->wallet->update(['balance' => 0]);
        $partner->transactions()->delete();
        
        // Also clear existing withdrawals for this specific partner
        Withdrawal::where('user_id', $partner->id)->delete();

        $this->command->line('  ⚙️ Reset partner wallet balance and transactions.');

        // 2. Seed Dynamic Income Deposits (Earnings)
        $deposits = [
            [
                'amount' => 5000, // $50.00
                'type' => 'joining_bonus',
                'desc' => 'Welcome partner joining bonus reward',
                'days_ago' => 30
            ],
            [
                'amount' => 450000, // $4,500.00
                'type' => 'sale_commission',
                'desc' => 'Commission for successful reservation of Sunset Villa (Booking #101)',
                'days_ago' => 20
            ],
            [
                'amount' => 120000, // $1,200.00
                'type' => 'sale_commission',
                'desc' => 'Commission for vehicle purchase of Porsche 911 Carrera (Inquiry #204)',
                'days_ago' => 15
            ],
            [
                'amount' => 35000, // $350.00
                'type' => 'ticket_sales',
                'desc' => 'Ticket sales payouts for Tech Innovators Summit (Booking #302)',
                'days_ago' => 10
            ],
            [
                'amount' => 60000, // $600.00
                'type' => 'service_payment',
                'desc' => 'Earnings for Full-Stack Development Consultation (Appointment #405)',
                'days_ago' => 5
            ],
            [
                'amount' => 15000, // $150.00
                'type' => 'classified_payment',
                'desc' => 'Earnings for Vintage 1970s Film Camera sale (Inquiry #502)',
                'days_ago' => 2
            ],
        ];

        foreach ($deposits as $dep) {
            $date = Carbon::now()->subDays($dep['days_ago']);
            
            DB::transaction(function () use ($partner, $dep, $date) {
                $transaction = $partner->deposit($dep['amount'], [
                    'type' => $dep['type'],
                    'description' => $dep['desc'],
                    'partner_id' => $partner->id,
                ]);
                
                // Backdate the transaction record
                $transaction->update([
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
            });
        }
        $this->command->info('  ✅ Seeded $' . number_format(6850, 2) . ' in dynamic earnings deposits.');

        // 3. Seed Dynamic Withdrawals (Payouts)
        
        // A. Approved / Completed Bank Transfer ($3,000.00)
        $payoutDate1 = Carbon::now()->subDays(12);
        $w1 = Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 300000, // $3,000.00
            'method' => 'Bank Transfer',
            'details' => json_encode(['account' => 'Chase Bank **** 4290', 'name' => 'Julian Sterling']),
            'status' => 'approved',
            'admin_note' => 'Processed and dispatched to Chase checking account.',
            'approved_at' => $payoutDate1,
            'created_at' => $payoutDate1,
            'updated_at' => $payoutDate1,
        ]);
        
        $tx1 = $partner->withdraw(300000, [
            'type' => 'withdrawal_request',
            'description' => 'Chase Bank Transfer payout (Withdrawal #' . $w1->id . ')',
            'withdrawal_id' => $w1->id,
        ]);
        $tx1->update(['created_at' => $payoutDate1, 'updated_at' => $payoutDate1]);

        // B. Approved / Completed PayPal Transfer ($500.00)
        $payoutDate2 = Carbon::now()->subDays(8);
        $w2 = Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 50000, // $500.00
            'method' => 'PayPal',
            'details' => json_encode(['account' => 'julian.sterling@example.com', 'name' => 'Julian Sterling']),
            'status' => 'approved',
            'admin_note' => 'PayPal payout complete.',
            'approved_at' => $payoutDate2,
            'created_at' => $payoutDate2,
            'updated_at' => $payoutDate2,
        ]);
        
        $tx2 = $partner->withdraw(50000, [
            'type' => 'withdrawal_request',
            'description' => 'PayPal Transfer payout (Withdrawal #' . $w2->id . ')',
            'withdrawal_id' => $w2->id,
        ]);
        $tx2->update(['created_at' => $payoutDate2, 'updated_at' => $payoutDate2]);

        // C. Pending / Awaiting Approval Wire Transfer ($400.00)
        $payoutDate3 = Carbon::now()->subDay();
        $w3 = Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 40000, // $400.00
            'method' => 'Wire Transfer',
            'details' => json_encode(['account' => 'Wells Fargo Bank **** 9811', 'name' => 'Julian Sterling']),
            'status' => 'pending',
            'admin_note' => 'Awaiting manual administrator review.',
            'created_at' => $payoutDate3,
            'updated_at' => $payoutDate3,
        ]);
        
        $tx3 = $partner->withdraw(40000, [
            'type' => 'withdrawal_request',
            'description' => 'Pending Wire Transfer request (Withdrawal #' . $w3->id . ')',
            'withdrawal_id' => $w3->id,
        ]);
        $tx3->update(['created_at' => $payoutDate3, 'updated_at' => $payoutDate3]);

        // D. Rejected / Failed Bank Transfer ($200.00)
        // Note: Rejected withdrawals do not deduct from the available wallet balance,
        // so we only create the withdrawal record with status 'rejected' but DO NOT call $partner->withdraw().
        $payoutDate4 = Carbon::now()->subDays(4);
        Withdrawal::create([
            'user_id' => $partner->id,
            'amount' => 20000, // $200.00
            'method' => 'Bank Transfer',
            'details' => json_encode(['account' => 'Chase Bank **** 4290', 'name' => 'Julian Sterling']),
            'status' => 'rejected',
            'admin_note' => 'Invalid account details. Funds returned to wallet.',
            'rejected_at' => $payoutDate4,
            'created_at' => $payoutDate4,
            'updated_at' => $payoutDate4,
        ]);

        $this->command->info('  ✅ Seeded high-fidelity withdrawal requests (Approved, Pending, and Rejected).');
        
        // Output computed balance
        $this->command->info('🎉 Julian Sterling Wallet Seeding Complete! Available Balance: $' . number_format($partner->wallet_balance, 2));
    }
}