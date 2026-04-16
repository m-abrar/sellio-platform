<?php

namespace App\Models;

use App\Traits\HasBookingAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PropertyBooking extends Model
{
    use HasFactory;
    use HasBookingAttributes;
    use LogsActivity;

    protected $table = 'property_bookings';

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
     * Calculate the number of nights.
     * Usage: $booking->duration_nights
     */
    public function getDurationNightsAttribute(): int
    {
        return $this->check_in_date->diffInDays($this->check_out_date) ?: 1;
    }

    /**
     * Get formatted total price.
     * Usage: $booking->formatted_total
     */
    public function getFormattedTotalAttribute(): string
    {
        return number_format($this->total_price, 2);
    }

    /**
     * Calculate Add-ons total from transaction lines starting with "Add-on:"
     * Usage: $booking->addons_total_price
     */
    public function getAddonsTotalPriceAttribute(): float
    {
        return (float) $this->transactionLines()
            ->where('description', 'LIKE', 'Add-on:%')
            ->sum('amount');
    }

    /**
     * Get the subtotal for the base rental.
     * Usage: $booking->base_rental_amount
     */
    public function getBaseRentalAmountAttribute(): float
    {
        $lineSum = $this->transactionLines()
            ->where('description', 'LIKE', '%Base Rental%')
            ->sum('amount');

        // Fallback logic if lines are missing: total - addons
        return $lineSum > 0 ? (float) $lineSum : (float) ($this->total_price - $this->addons_total_price);
    }

    /**
     * Get the Taxes & Service fees (anything not Base Rental and not Add-on)
     * Usage: $booking->fees_and_taxes_amount
     */
    public function getFeesAndTaxesAmountAttribute(): float
    {
        return (float) $this->transactionLines()
            ->where('description', 'NOT LIKE', 'Add-on:%')
            ->where('description', 'NOT LIKE', '%Base Rental%')
            ->sum('amount');
    }

    /**
     * Determine if the booking is currently "pending"
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
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
        return $query->where('status', 'confirmed');
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
