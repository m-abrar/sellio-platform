<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'attribute_ids',
        'addon_ids',
    ];

    protected $casts = [
        'attribute_ids' => 'array',
        'addon_ids'     => 'array',
        'quantity'      => 'integer',
        'unit_price'    => 'decimal:2',
    ];

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withDefault([
            'name' => __('Deleted Product'),
            'price' => 0
        ]);
    }

    /**
     * Get the total price.
     * Note: unit_price is now a database column, making this very fast.
     */
    protected function totalPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->unit_price * $this->quantity
        );
    }
}
