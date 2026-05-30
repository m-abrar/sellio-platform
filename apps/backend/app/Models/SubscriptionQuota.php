<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionQuota extends Model
{
    protected $fillable = [
        'subscription_id',
        'listings_used',
        'featured_used',
        'notes',
    ];

    protected $casts = [
        'listings_used' => 'integer',
        'featured_used' => 'integer',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
