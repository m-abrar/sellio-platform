<?php

namespace App\Models;

use App\Traits\HasBookingAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * @property int $id
 * @property int $user_id
 * @property int $property_id
 * @property \Illuminate\Support\Carbon $check_in_date
 * @property \Illuminate\Support\Carbon $check_out_date
 * @property int $guests
 * @property float $total_price
 * @property string $status
 * @property string $full_name
 * @property string $email
 * @property string $phone
 * @property string|null $message
 * @property \Illuminate\Support\Carbon|null $viewed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class PropertyBooking extends Model
{
    use HasFactory;
    use HasBookingAttributes;
    use LogsActivity;

    // --- Status Constants ---
    public const STATUS_PENDING   = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    protected $table = 'property_bookings';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['property', 'user'];

    protected $fillable = [
        'user_id',
        'property_id',
        'check_in_date',
        'check_out_date',
        'guests',
        'total_price',
        'status',
        'full_name',
        'email',
        'phone',
        'message',
        'viewed_at',
    ];

    protected $casts = [
        'check_in_date'  => 'date',
        'check_out_date' => 'date',
        'total_price'    => 'decimal:2',
        'viewed_at'      => 'datetime',
    ];

    // --- Accessors & Helpers for Blade ---

    /**
     * The table associated with the model.
     *
     * @var string
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    // --- Modern Accessors ---

    /**
     * Calculate the number of nights.
     */
    protected function durationNights(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->check_in_date->diffInDays($this->check_out_date) ?: 1
        );
    }

    /**
     * Get formatted total price.
     */
    protected function formattedTotal(): Attribute
    {
        return Attribute::make(
            get: fn () => number_format($this->total_price, 2)
        );
    }

    /**
     * Calculate Add-ons total from transaction lines starting with "Add-on:"
     */
    protected function addonsTotalPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => (float) $this->transactionLines()
                ->where('description', 'LIKE', 'Add-on:%')
                ->sum('amount')
        );
    }

    /**
     * Get the subtotal for the base rental.
     */
    protected function baseRentalAmount(): Attribute
    {
        return Attribute::make(
            get: function () {
                $lineSum = $this->transactionLines()
                    ->where('description', 'LIKE', '%Base Rental%')
                    ->sum('amount');

                return $lineSum > 0 ? (float) $lineSum : (float) ($this->total_price - $this->addons_total_price);
            }
        );
    }

    /**
     * Get the Taxes & Service fees (anything not Base Rental and not Add-on)
     */
    protected function feesAndTaxesAmount(): Attribute
    {
        return Attribute::make(
            get: fn () => (float) $this->transactionLines()
                ->where('description', 'NOT LIKE', 'Add-on:%')
                ->where('description', 'NOT LIKE', '%Base Rental%')
                ->sum('amount')
        );
    }

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING   => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_CONFIRMED => ['label' => 'Confirmed', 'color' => 'success'],
            self::STATUS_CANCELLED => ['label' => 'Cancelled', 'color' => 'danger'],
            self::STATUS_COMPLETED => ['label' => 'Completed', 'color' => 'info'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }

    // --- Relationships ---

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactionLines(): HasMany
    {
        return $this->hasMany(TransactionLine::class, 'property_booking_id');
    }

    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    // --- Scopes ---

    public function scopeConfirmed($query)
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('check_in_date', '>=', now());
    }

    // --- Activity Log ---

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
