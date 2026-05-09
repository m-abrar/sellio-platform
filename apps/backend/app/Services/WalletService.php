<?php

namespace App\Services;

use App\Models\{Withdrawal, User};
use Illuminate\Support\Facades\{DB, Log};
use Illuminate\Validation\ValidationException;

class WalletService
{
    /**
     * Process a withdrawal request for a partner.
     *
     * @param User $partner
     * @param array $data Validated data containing 'amount', 'method', 'details'
     * @throws ValidationException
     * @throws \Exception
     */
    public function processWithdrawal(User $partner, array $data): void
    {
        $amountInCents = intval(round($data['amount'] * 100));

        if ($amountInCents <= 0) {
            throw ValidationException::withMessages([
                'amount' => 'Withdrawal amount must be greater than zero.',
            ]);
        }

        try {
            DB::beginTransaction();

            // Lock the user record for update to prevent concurrent balance checks/deductions
            $lockedUser = User::where('id', $partner->id)->lockForUpdate()->first();

            if (!$lockedUser->canWithdraw($amountInCents)) {
                throw ValidationException::withMessages([
                    'amount' => 'Insufficient funds. Your current available balance is less than the amount requested.',
                ]);
            }

            $withdrawal = Withdrawal::create([
                'user_id' => $lockedUser->id,
                'amount'  => $amountInCents,
                'method'  => $data['method'] ?? 'Bank Transfer',
                'details' => json_encode($data['details'] ?? ['account' => '...']),
                'status'  => 'pending', 
            ]);

            $lockedUser->withdraw($amountInCents, [
                'type' => 'withdrawal_request',
                'description' => 'Pending withdrawal request #' . $withdrawal->id,
                'withdrawal_id' => $withdrawal->id,
            ]);

            DB::commit();

        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Wallet Withdrawal Error: ' . $e->getMessage(), ['user_id' => $partner->id]);
            throw new \Exception('Failed to submit withdrawal request. Please try again or contact support.');
        }
    }
}
