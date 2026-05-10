<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\ProductAddon
 *
 * @property int $id
 * @property int $product_id
 * @property string $title
 * @property string|null $description
 * @property float $price
 * @property string $pricing_type (one_time, per_unit)
 * @property bool $is_required
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 */
class ProductAddon extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageAccess;

    /**
     * Constants to define media collections used by the HasImageAccess trait.
     */
    public const PRIMARY_MEDIA = 'addon_image';
    public const GALLERY_MEDIA = 'addon_gallery';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'product_addons';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'title',
        'description',
        'icon',
        'pricing_type',
        'max_qty',
        'is_required',
        'is_popular',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'is_required' => 'boolean',
        'is_popular' => 'boolean',
        'sort_order' => 'integer',
        'max_qty' => 'integer',
    ];

    // --- Media Management ---

    /**
     * Register media collections using the trait helper.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }

    // --- Relationships ---

    /**
     * Get the product that owns the addon.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Formatted price for the UI.
     */
    protected function priceFormatted(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: function () {
                $symbol = function_exists('setting') ? setting('currency_symbol', '$') : '$';
                $formatted = $symbol . number_format($this->price, 2);
                
                // Extra touch: Indicate if it's a recurring or unit cost
                return $this->pricing_type === 'per_unit' ? "{$formatted}/unit" : $formatted;
            }
        );
    }

    /**
     * Scope to return addons in the correct order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order', 'asc');
    }

}
