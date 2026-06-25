<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Payment
 *
 * @property int $id
 * @property int $user_id
 * @property float $amount
 * @property string $currency
 * @property string|null $transaction_id
 * @property string $payment_method (stripe, paypal, bank_transfer, etc.)
 * @property string $status (pending, completed, failed, refunded)
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property string $payable_type
 * @property int $payable_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $payable
 */
class Payment extends Model
{
    use HasFactory;
    use LogsActivity;

    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED    = 'failed';
    public const STATUS_REFUNDED  = 'refunded';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['user'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'currency',
        'transaction_id',
        'payment_method',
        'paid_at',
        'payable_type',
        'payable_id',
        'proof_file',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount'  => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    /**
     * Get the options for logging activity.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // --- Relationships ---

    /**
     * Get the user who made the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the related model that this payment is for (Subscription, EventBooking, etc.).
     */
    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    // --- Scopes ---

    /**
     * Scope a query to only include completed payments.
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_COMPLETED => ['label' => 'Completed', 'color' => 'success'],
            self::STATUS_FAILED    => ['label' => 'Failed', 'color' => 'danger'],
            self::STATUS_REFUNDED  => ['label' => 'Refunded', 'color' => 'info'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }

    /**
     * Scope a query to filter payments by a specific method.
     */
    public function scopeByMethod(Builder $query, string $method): Builder
    {
        return $query->where('payment_method', $method);
    }
}
