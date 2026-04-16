<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GatewayCredential
 *
 * @property int $id
 * @property int $payment_gateway_id
 * @property array $live_config
 * @property array $sandbox_config
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PaymentGateway $gateway
 */
class GatewayCredential extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payment_gateway_id',
        'live_config',
        'sandbox_config',
    ];

    /**
     * The attributes that should be cast.
     * * Sensitive configuration data is encrypted at rest in the database.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'live_config'    => 'encrypted:array',
        'sandbox_config' => 'encrypted:array',
    ];

    // --- Relationships ---

    /**
     * Get the payment gateway associated with these credentials.
     */
    public function gateway(): BelongsTo
    {
        return $this->belongsTo(PaymentGateway::class, 'payment_gateway_id');
    }
}
