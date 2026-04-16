<?php

namespace App\Services; // <-- The correct namespace for app/Services

use App\Models\User; // Or App\Models\Partner
use Illuminate\Support\Facades\DB;

class PartnerBonusService
{
    /**
     * Awards a one-time joining bonus to the partner.
     *
     * @param User $partner
     * @param int $amount
     * @return \Bavix\Wallet\Models\Transaction
     */
    public function awardJoiningBonus(User $partner, int $amount): \Bavix\Wallet\Models\Transaction
    {
        // 1. Check if the bonus has already been awarded (Crucial for idempotency)
        if ($this->hasReceivedBonus($partner)) {
            throw new \Exception('Joining bonus already awarded to this partner.');
        }

        // 2. Perform the deposit with specific metadata
        return DB::transaction(function () use ($partner, $amount) {
            return $partner->deposit($amount, [
                'type' => 'joining_bonus',
                'description' => 'Welcome bonus for new partner registration',
                'partner_id' => $partner->id,
            ]);
        });
    }
    
    /**
     * Checks if the partner has received the joining bonus.
     *
     * @param User $partner
     * @return bool
     */
    public function hasReceivedBonus(User $partner): bool
    {
        // Check for a 'deposit' transaction with the specific 'joining_bonus' type in metadata
        return $partner->transactions()
            ->where('type', 'deposit')
            ->where('meta->type', 'joining_bonus')
            ->exists();
    }
}
