<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GatewayFieldBlueprint
 *
 * @property int $id
 * @property int $payment_gateway_id
 * @property string $key
 * @property string $label
 * @property string $input_type
 * @property bool $is_required
 * @property bool $is_sensitive
 * @property string|null $description
 * @property int $sort_order
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class GatewayFieldBlueprint extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'payment_gateway_id',
        'key',
        'label',
        'input_type',
        'is_required',
        'is_sensitive',
        'description',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_required'  => 'boolean',
        'is_sensitive' => 'boolean',
        'sort_order'   => 'integer',
    ];

    // --- Relationships ---

    /**
     * Get the payment gateway that owns this field blueprint.
     */
    public function gateway(): BelongsTo
    {
        return $this->belongsTo(PaymentGateway::class, 'payment_gateway_id');
    }

    // --- Scopes ---

    /**
     * Scope a query to order blueprints by their display order.
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc');
    }
}
