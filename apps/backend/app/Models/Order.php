<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Order
 *
 * @property int $id
 * @property string $order_number
 * @property int $user_id
 * @property string $status
 * @property string $payment_status
 * @property string|null $payment_method
 * @property float $subtotal
 * @property float $shipping_cost
 * @property float $tax_amount
 * @property float $discount_amount
 * @property float $total_amount
 * @property string $shipping_name
 * @property string $shipping_address
 * @property string $shipping_city
 * @property string|null $shipping_state
 * @property string $shipping_zip
 * @property string $shipping_country
 * @property string|null $tracking_number
 * @property \Illuminate\Support\Carbon|null $shipped_at
 * @property \Illuminate\Support\Carbon|null $delivered_at
 */
class Order extends Model
{
    use HasFactory;

    // --- Status Constants ---
    public const STATUS_PENDING          = 'pending';
    public const STATUS_PROCESSING       = 'processing';
    public const STATUS_SHIPPED          = 'shipped';
    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';
    public const STATUS_DELIVERED        = 'delivered';
    public const STATUS_CANCELLED        = 'cancelled';
    public const STATUS_REFUNDED         = 'refunded';

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['user', 'items'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'payment_method',
        'shipping_cost',
        'tax_amount',
        'discount_amount',
        'shipping_name',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_zip',
        'shipping_country',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal'        => 'decimal:2',
        'shipping_cost'   => 'decimal:2',
        'tax_amount'      => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount'    => 'decimal:2',
        'shipped_at'      => 'datetime',
        'delivered_at'    => 'datetime',
    ];

    // --- Relationships ---

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items (products) for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING          => ['label' => 'Pending', 'color' => 'warning'],
            self::STATUS_PROCESSING       => ['label' => 'Processing', 'color' => 'info'],
            self::STATUS_SHIPPED          => ['label' => 'Shipped', 'color' => 'primary'],
            self::STATUS_OUT_FOR_DELIVERY => ['label' => 'Out for Delivery', 'color' => 'indigo'],
            self::STATUS_DELIVERED        => ['label' => 'Delivered', 'color' => 'success'],
            self::STATUS_CANCELLED        => ['label' => 'Cancelled', 'color' => 'danger'],
            self::STATUS_REFUNDED         => ['label' => 'Refunded', 'color' => 'secondary'],
            default                      => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}

