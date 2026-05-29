<?php
// File: apps/backend/app/Models/PayoutMethod.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayoutMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'details',
        'is_primary',
    ];

    protected $casts = [
        'details' => 'encrypted:array',
        'is_primary' => 'boolean',
    ];

    /**
     * The User/Partner that owns this payout method.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Model booted hooks.
     */
    protected static function booted()
    {
        static::saving(function ($payoutMethod) {
            if ($payoutMethod->is_primary) {
                // Ensure all other payout methods for this user are not marked as primary
                static::where('user_id', $payoutMethod->user_id)
                    ->where('id', '!=', $payoutMethod->id)
                    ->update(['is_primary' => false]);
            }
        });

        static::deleted(function ($payoutMethod) {
            if ($payoutMethod->is_primary) {
                // Reassign primary status to the next oldest payout method for this user
                $next = static::where('user_id', $payoutMethod->user_id)
                    ->where('id', '!=', $payoutMethod->id)
                    ->orderBy('id', 'asc')
                    ->first();
                    
                if ($next) {
                    $next->update(['is_primary' => true]);
                }
            }
        });
    }
}
