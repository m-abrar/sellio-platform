<?php

namespace App\Models;

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
use App\Models\User;
use App\Traits\Models\HasStatusModeration;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Classified extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivity, HasImageAccess, HasStatusModeration;

    // --- 1. Constants & Properties ---
    public const PRIMARY_MEDIA = 'item_photo';
    public const GALLERY_MEDIA = 'item_gallery';

    protected $table = 'classified_ads';

    protected $fillable = [
        'user_id', 'category_id', 'location_id', 'brand_id', 'type_id',
        'title', 'slug', 'description', 'base_price', 'sale_price',
        'item_condition', 'item_year_age', 'item_quantity', 'item_dimensions',
        'warranty_months', 'min_ad_duration', 'address', 'city', 'state',
        'country', 'zip_code', 'latitude', 'longitude', 'is_published',
        'is_featured', 'is_for_rent', 'is_for_sale', 'approved_at', 'expires_at',
    ];

    protected $casts = [
        'is_published'    => 'boolean',
        'is_featured'     => 'boolean',
        'is_for_rent'     => 'boolean',
        'is_for_sale'     => 'boolean',
        'base_price'      => 'float',
        'sale_price'      => 'float',
        'warranty_months' => 'integer',
        'min_ad_duration' => 'integer',
        'item_year_age'   => 'integer',
        'item_quantity'   => 'integer',
        'sale_starts_at'  => 'datetime',
        'sale_ends_at'    => 'datetime',
        'approved_at'     => 'datetime',
        'expires_at'     => 'datetime',
    ];

    // --- 2. Configuration (Logs & Media) ---
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty()->dontSubmitEmptyLogs();
    }

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);
        $this->addMediaConversion('classified_thumb')
            ->width(300)->height(300)->sharpen(10)->nonQueued();
    }

    // --- 3. Relationships ---
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function type(): BelongsTo { return $this->belongsTo(Type::class); }
    public function brand(): BelongsTo { return $this->belongsTo(Brand::class); }
    public function location(): BelongsTo { return $this->belongsTo(Location::class); }
    
    public function reviews(): MorphMany { return $this->morphMany(Review::class, 'reviewable'); }
    public function inquiries(): HasMany { return $this->hasMany(ClassifiedInquiry::class); }
    public function inquiriesNew(): HasMany { return $this->hasMany(ClassifiedInquiry::class)->whereNull('viewed_at'); }
    public function favorites(): MorphMany { return $this->morphMany(Favorite::class, 'favoritable'); }
    public function tags(): MorphToMany { return $this->morphToMany(Tag::class, 'taggable'); }

    public function inquirers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'classified_inquiries', 'classified_id', 'user_id')
            ->using(ClassifiedInquiry::class)
            ->withPivot('status', 'message')
            ->withTimestamps();
    }

    // --- 4. Scopes ---
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true)->whereNotNull('approved_at');
    }

    /**
     * Scope visibility based on the authenticated user's role.
     *
     * - guests / buyers   → active listings only
     * - partner           → own listings (any status) + active listings from others
     * - admin/super-admin → all listings, unrestricted
     */
    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        if (!$user || $user->hasRole('user')) {
            return $query->active();
        }

        if ($user->hasRole(['admin', 'super-admin'])) {
            return $query;
        }

        if ($user->hasRole('partner')) {
            return $query->where(fn (Builder $q) => $q->active()->orWhere('user_id', $user->id));
        }

        return $query->active();
    }

    // --- 5. Accessors & Mutators ---

    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                // 1. Determine active price (Sale takes priority over Base)
                $price = ($this->sale_price > 0) ? $this->sale_price : $this->base_price;
                
                if (!$price || $price <= 0) {
                    return null;
                }

                // 2. Retrieve global settings
                $symbol = setting('currency_symbol', '$');
                $position = setting('currency_position', 'left'); // Options: 'left', 'right'
                
                $formattedValue = number_format($price, 2);

                // 3. Return based on placement preference
                return $position === 'left' 
                    ? "{$symbol}{$formattedValue}" 
                    : "{$formattedValue}{$symbol}";
            }
        )->shouldCache();
    }

    protected function priceFormattedK(): Attribute
    {
        return Attribute::make(
            get: function () {
                $currency = config('app.currency_symbol', '$');
                $price = ($this->sale_price > 0) ? $this->sale_price : $this->base_price;
                if ($price <= 0) return __('N/A');
                return (abs($price) >= 1000) ? $currency . number_format($price / 1000, 1) . 'k' : $currency . number_format($price, 2);
            }
        );
    }

    protected function conditionLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                $condition = (int) $this->item_condition;
                return match (true) {
                    $condition >= 10 => __('Brand New / Sealed'),
                    $condition >= 9  => __('Perfect Condition'),
                    $condition >= 8  => __('Excellent Condition'),
                    $condition >= 7  => __('Very Good'),
                    $condition >= 5  => __('Good / Used'),
                    $condition >= 3  => __('Fair / Minor Defects'),
                    $condition >= 1  => __('Poor / For Parts'),
                    default          => __('Condition Unspecified'),
                };
            }
        );
    }

    protected function conditionBadgeClass(): Attribute
    {
        return Attribute::make(
            get: function () {
                $condition = (int) $this->item_condition;
                return match (true) {
                    $condition >= 8 => 'bg-success',
                    $condition >= 5 => 'bg-info',
                    $condition >= 3 => 'bg-warning',
                    default         => 'bg-danger',
                };
            }
        );
    }

    protected function discountPercentage(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                $price = $attributes['base_price'] ?? 0;
                $salePrice = $attributes['sale_price'] ?? 0;
                return ($salePrice > 0 && $price > 0) ? (int) round((1 - ($salePrice / $price)) * 100) : 0;
            }
        )->shouldCache();
    }

    protected function isSale(): Attribute
    {
        return Attribute::make(
            get: fn($value, array $attributes) => !empty($attributes['sale_price']) && $attributes['sale_price'] > 0
        )->shouldCache();
    }

    protected function isNew(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->created_at ? $this->created_at->gt(Carbon::now()->subDays(30)) : false
        )->shouldCache();
    }

    protected function shortDescription(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!empty($this->short_description)) return $this->short_description;
                return !empty($this->description) ? str($this->description)->words(10, '...') : null;
            }
        );
    }


    /**
     * Get all photos (Primary + Gallery) with the primary image first.
     */
    public function getAllPhotosAttribute()
    {
        return cache()->remember("classified_photos_{$this->id}", 3600, function () {
            $primary = $this->getFirstMedia(self::PRIMARY_MEDIA);
            $gallery = $this->getMedia(self::GALLERY_MEDIA);

            $collection = collect();
            if ($primary) {
                $collection->push($primary);
            }

            // Merge gallery items, excluding the primary if it's accidentally duplicated
            foreach ($gallery as $item) {
                if ($primary && $item->id === $primary->id) continue;
                $collection->push($item);
            }

            return $collection;
        });
    }

    /**
     * Get the starting main image URL.
     */
    public function getInitialMainImageUrl(string $conversion = 'detail'): string
    {
        $first = $this->all_photos->first();
        return $first ? $first->getUrl($conversion) : $this->getImageUrl(conversion: $conversion);
    }
}
