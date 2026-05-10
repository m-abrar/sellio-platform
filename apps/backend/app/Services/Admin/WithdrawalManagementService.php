<?php

namespace App\Services\Admin;

use App\Models\Withdrawal;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WithdrawalManagementService
{
    /**
     * Approve a withdrawal request.
     */
    public function approveWithdrawal(Withdrawal $withdrawal): void
    {
        DB::transaction(function () use ($withdrawal) {
            $lockedWithdrawal = Withdrawal::where('id', $withdrawal->id)->lockForUpdate()->first();

            if ($lockedWithdrawal->status !== Withdrawal::STATUS_PENDING) {
                throw new \Exception(__('The withdrawal request is already :status.', ['status' => $lockedWithdrawal->status]));
            }

            // Verify that the initial wallet reservation exists
            $initialTransaction = $lockedWithdrawal->user->transactions()
                ->where('type', 'withdraw')
                ->whereJsonContains('meta', ['withdrawal_id' => $lockedWithdrawal->id])
                ->first();

            if (!$initialTransaction) {
                Log::warning("Potential Reconciliation Risk: Missing wallet reservation for withdrawal ID: {$lockedWithdrawal->id} during approval.");
            }

            $lockedWithdrawal->update([
                'status'      => Withdrawal::STATUS_APPROVED,
                'approved_at' => now(),
                'admin_note'  => 'Approved and scheduled for bank transfer.', 
            ]);
        });
    }

    /**
     * Reject a withdrawal request and refund funds.
     */
    public function rejectWithdrawal(Withdrawal $withdrawal, string $adminNote): void
    {
        DB::transaction(function () use ($withdrawal, $adminNote) {
            $lockedWithdrawal = Withdrawal::where('id', $withdrawal->id)->lockForUpdate()->first();

            if ($lockedWithdrawal->status !== Withdrawal::STATUS_PENDING) {
                throw new \Exception(__('The withdrawal request is already :status.', ['status' => $lockedWithdrawal->status]));
            }

            $initialTransaction = $lockedWithdrawal->user->transactions()
                ->where('type', 'withdraw')
                ->whereJsonContains('meta', ['withdrawal_id' => $lockedWithdrawal->id])
                ->first();

            // Orchestrate Wallet Refund
            if ($initialTransaction) {
                $lockedWithdrawal->user->deposit($lockedWithdrawal->amount, [
                    'type'           => 'withdrawal_refund',
                    'description'    => "Withdrawal Request #{$lockedWithdrawal->id} Rejected/Refunded",
                    'reversal_of_id' => $initialTransaction->id,
                ]);
            }

            $lockedWithdrawal->update([
                'status'      => Withdrawal::STATUS_REJECTED,
                'admin_note'  => $adminNote,
                'rejected_at' => now(),
            ]);
        });
    }
}
