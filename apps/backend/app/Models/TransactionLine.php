<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class TransactionLine
 *
 * Granular financial record linked to a Property and optionally a Booking.
 */
class TransactionLine extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'property_id',
        'property_booking_id',
        'description',
        'transaction_date',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'amount'           => 'decimal:2',
        'transaction_date' => 'date',
    ];

    // --- Relationships ---

    /**
     * Every transaction line belongs to a property.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Optional link to a specific property booking.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(PropertyBooking::class, 'property_booking_id');
    }
}
