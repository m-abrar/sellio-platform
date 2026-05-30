<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Transaction extends Model implements HasMedia
{
    use InteractsWithMedia;
    use SoftDeletes;

    public const PRIMARY_MEDIA = 'transaction_screenshots';

    protected $table = 'ledger_transactions';

    protected $fillable = [
        'property_booking_id',
        'user_id',
        'reference_number',
        'amount',
        'status',
        'payment_method',
        'description',
        'notes',
        'transaction_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'transaction_date' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(PropertyBooking::class, 'property_booking_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
