<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingLineItem extends Model
{
    protected $fillable = [
        'property_booking_id',
        'title',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(PropertyBooking::class, 'property_booking_id');
    }
}
