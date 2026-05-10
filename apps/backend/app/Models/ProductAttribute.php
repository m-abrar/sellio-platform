<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute as EloquentAttribute;

/**
 * App\Models\ProductAttribute
 * Handles specific variations (Size, Color, etc.) and their impact on price and stock.
 */
class ProductAttribute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'product_id',
        'name',
        'value',
        'sku_extension',
        'stock_quantity',
        'visual_color_code',
        'sort_order',
        'is_visible',
        'is_variation',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'additional_price' => 'decimal:2',
        'stock_quantity'   => 'integer',
        'sort_order'       => 'integer',
        'is_visible'       => 'boolean',
        'is_variation'     => 'boolean',
    ];

    // --- Relationships ---

    /**
     * Get the product that owns this attribute.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // --- Accessors ---

    /**
     * Returns a combined label (e.g., "Color: Red")
     */
    protected function fullLabel(): EloquentAttribute
    {
        return EloquentAttribute::make(
            get: fn (mixed $value, array $attributes) => "{$attributes['name']}: {$attributes['value']}"
        );
    }


    public function scopeVariation(Builder $query): Builder
    {
        return $query->where('is_variation', true)->where('is_visible', true)->orderBy('sort_order');
    }

    /**
     * Formats the price modifier for display (e.g., "+$5.00")
     * Professional version: Uses config-based currency and safe fallbacks.
     */
    protected function priceModifierFormatted(): EloquentAttribute
    {
        return EloquentAttribute::make(
            get: function (mixed $value, array $attributes) {
                $price = (float) ($attributes['additional_price'] ?? 0);
                
                if (abs($price) < 0.01) return '';
                
                $symbol = function_exists('setting') ? setting('currency_symbol', '$') : '$';
                $formatted = $symbol . number_format(abs($price), 2);
                
                return $price > 0 ? "+{$formatted}" : "-{$formatted}";
            }
        );
    }
}
