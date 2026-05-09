<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Withdrawal
 * * The payout engine. 
 * Manages the lifecycle of a funds extraction request from a 
 * Partner's wallet to their external payment method.
 */
class Withdrawal extends Model
{
    use HasFactory;

    /**
     * Withdrawal Status Constants
     */
    public const STATUS_PENDING  = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'amount',      // Stored in minor units (cents/paisa)
        'method',      // e.g., 'paypal', 'bank_transfer', 'stripe'
        'details',     // JSON or String containing account info
        'admin_note',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount'      => 'integer',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     */
    protected $appends = ['amount_dollars'];

    // --- Relationships ---

    /**
     * The Partner requesting the payout.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- Accessors ---

    /**
     * Convert the integer amount (cents) to a readable float (dollars).
     * Example: 5000 -> 50.00
     */
    protected function amountDollars(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => isset($attributes['amount'])
                ? (float)($attributes['amount'] / 100)
                : 0.0,
        );
    }

    // --- Scopes ---

    /**
     * Scope for the Admin Dashboard "Action Required" list.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for completed financial history.
     */
    public function scopeProcessed(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_APPROVED, self::STATUS_REJECTED]);
    }

    // --- Logic Helpers ---

    /**
     * Helper to check if the request can still be modified.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING  => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_APPROVED => ['label' => 'Approved', 'color' => 'success'],
            self::STATUS_REJECTED => ['label' => 'Rejected', 'color' => 'danger'],
            default              => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}
