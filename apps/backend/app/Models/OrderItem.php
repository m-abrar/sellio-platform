<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use HasFactory, SoftDeletes;
    
    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['product'];

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'quantity',
        'selected_attributes',
        'selected_addons',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'selected_attributes' => 'array', // Automatically handles JSON conversion
        'selected_addons' => 'array',     // Automatically handles JSON conversion
    ];

    /**
     * Get the order that contains this item.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product associated with this item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
