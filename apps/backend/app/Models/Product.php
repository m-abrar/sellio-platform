<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HasAnalytics;
use App\Traits\HasImageAccess;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Traits\Models\HasStatusModeration;

/**
 * App\Models\Product
 * The core engine of the E-commerce vertical. Handles inventory,
 * physical dimensions, and retail pricing logic.
 */
class Product extends Model implements HasMedia
{
    use SoftDeletes, LogsActivity, HasAnalytics, HasFactory, InteractsWithMedia, HasImageAccess, HasStatusModeration;

    /**
     * Constants for media collections.
     */
    public const PRIMARY_MEDIA = 'main_image';
    public const GALLERY_MEDIA = 'product_gallery';

    protected $fillable = [
        'user_id', 'category_id', 'type_id', 'brand_id',
        'title', 'slug', 'sku', 'description', 'short_description',
        'base_price', 'sale_price', 'cost_price', 
        'stock_quantity', 'low_stock_threshold', 'manage_stock', 'in_stock',
        'weight', 'length', 'width', 'height', 
        'video', 'main_image',
        'is_published', 'is_featured', 'on_sale', 'is_digital',
        'meta_title', 'meta_description'
    ];

    /**
     * Attribute casting for retail data.
     */
    protected $casts = [
        'is_published'      => 'boolean',
        'is_featured'       => 'boolean',
        'on_sale'           => 'boolean',
        'is_digital'        => 'boolean',
        'manage_stock'      => 'boolean',
        'in_stock'          => 'boolean',
        'base_price'        => 'decimal:2',
        'sale_price'        => 'decimal:2',
        'cost_price'        => 'decimal:2',
        'weight'            => 'decimal:2',
        'length'            => 'decimal:2',
        'width'             => 'decimal:2',
        'height'            => 'decimal:2',
        'stock_quantity'    => 'integer',
        'low_stock_threshold' => 'integer',
        'approved_at' => 'datetime',
    ];

    // --- Media Management ---

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }
    
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);
        
        $this->addMediaConversion('product_thumbnail')
             ->width(400)->height(400)
             ->quality(85)->format('webp')->nonQueued();
    }

    // --- Relationships (Belongs To) ---
    public function orders(): HasMany { return $this->hasMany(Order::class); }
    
    /** Get only bookings that haven't been seen by the agent yet */
    public function ordersNew(): HasMany { return $this->hasMany(Order::class)->whereNull('viewed_at'); }

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function type(): BelongsTo { return $this->belongsTo(Type::class); }
    public function brand(): BelongsTo { return $this->belongsTo(Brand::class); }

    // --- Relationships (Has Many) ---
    public function attributes(): HasMany { return $this->hasMany(ProductAttribute::class); }
    public function addons(): HasMany { return $this->hasMany(ProductAddon::class); }
    public function orderItems(): HasMany { return $this->hasMany(OrderItem::class); }
    
    /** Get only items currently in active carts */
    public function cartItems(): HasMany { return $this->hasMany(CartItem::class); }

    // --- Relationships (Many-to-Many & Polymorphic) ---
    public function features(): MorphToMany { return $this->morphToMany(Feature::class, 'featurable'); }
    public function reviews(): MorphMany { return $this->morphMany(Review::class, 'reviewable'); }
    
    /** Get only reviews that haven't been seen by the merchant yet */
    public function reviewsNew(): MorphMany { return $this->morphMany(Review::class, 'reviewable')->whereNull('viewed_at'); }
    
    public function favorites(): MorphMany { return $this->morphMany(Favorite::class, 'favoritable'); }
    public function tags(): MorphToMany { return $this->morphToMany(Tag::class, 'taggable'); }

    // --- Scopes ---

    /** Filter products that are approved, published, and in stock */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true)
                     ->where('in_stock', true)
                     ->whereNotNull('approved_at');
    }
    
    public function scopeOrderByRating(Builder $query, string $direction = 'desc'): Builder
    {
        return $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', $direction);
    }

    // --- Accessors ---

    /** Returns the current active price (Sale price if on sale, otherwise base) */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->on_sale && !empty($this->sale_price) && $this->sale_price > 0) {
                    return $this->sale_price;
                }
                return $this->base_price;
            }
        );
    }

    
    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                $currency = setting('currency_symbol', '$');
                $price = ($this->sale_price > 0 && $this->sale_price < $this->base_price) ? $this->sale_price : $this->base_price;
                return ($price > 0) ? $currency . number_format($price, 2) : __('Price on Request');
            }
        );
    }


    /** Formats dimensions into a single string (e.g., 10x20x5 cm) */
    protected function dimensionsFormatted_BAK(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if ($attributes['length'] && $attributes['width'] && $attributes['height']) {
                    return "{$attributes['length']}x{$attributes['width']}x{$attributes['height']} cm";
                }
                return __('N/A');
            }
        );
    }

    protected function dimensionsFormatted(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                // Use collect() or array_key_exists to prevent "Undefined array key" errors
                $l = $attributes['length'] ?? null;
                $w = $attributes['width'] ?? null;
                $h = $attributes['height'] ?? null;

                if ($l && $w && $h) {
                    return "{$l}x{$w}x{$h} cm";
                }
                return __('N/A');
            }
        );
    }


    /**
     * Better Rating Accessor
     * Uses the eager-loaded average if available to prevent N+1 queries.
     */
    protected function ratingAverage(): Attribute
    {
        return Attribute::make(
            get: function () {
                $avg = $this->reviews_avg_rating ?? $this->reviews()->avg('rating') ?? 0;
                return rtrim(rtrim(number_format($avg, 2), '0'), '.');
            }
        );
    }

    protected function isNew(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->created_at ? $this->created_at->gt(Carbon::now()->subDays(15)) : false
        )->shouldCache();
    }

    protected function shortDescription(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (!empty($attributes['short_description'])) return $attributes['short_description'];
                return !empty($attributes['description']) ? str($attributes['description'])->words(15, '...') : null;
            }
        );
    }

    /**
     * Sanitize rich HTML descriptions before persistence.
     */
    protected function description(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => sanitize_rich_html($value)
        );
    }

    // --- Activity Log ---
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs();
    }


    /**
     * Scope visibility based on the authenticated user's role.
     *
     * - guests / buyers  → active products only (published + in-stock + approved)
     * - partner          → their own products (any status) + active products from others
     * - admin/super-admin → all products, no restrictions
     *
     * @param  Builder    $query
     * @param  User|null  $user
     * @return Builder
     */
    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        // Unauthenticated guests and regular buyers → active only
        if (!$user || $user->hasRole('user')) {
            return $query->active();
        }

        // Admins → unrestricted access to all products
        if ($user->hasRole(['admin', 'super-admin'])) {
            return $query;
        }

        // Partners → their own products (any status) OR any active product
        if ($user->hasRole('partner')) {
            return $query->where(fn (Builder $q) => $q->active()->orWhere('user_id', $user->id));
        }

        // Fallback — treat as guest
        return $query->active();
    }


    
}

