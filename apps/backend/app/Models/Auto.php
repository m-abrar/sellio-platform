<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Facades\Session;
use App\Models\User;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Traits\Models\HasStatusModeration;

/**
 * App\Models\Auto
 * * @property int $id
 * @property string|null $description
 * @property string|null $short_description
 * @property float|null $base_price
 * @property float|null $sale_price
 * @property int|null $mileage_value
 * @property string|null $mileage_units
 * @property bool $is_published
 * @property \Illuminate\Support\Carbon|null $approved_at
 */
class Auto extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;
    use LogsActivity;
    use HasImageAccess;
    use HasStatusModeration;

    public const PRIMARY_MEDIA = 'main_photo';
    public const GALLERY_MEDIA = 'auto_gallery';
    protected const MILE_TO_KM_FACTOR = 1.60934;
    protected const KM_TO_MILE_FACTOR = 0.621371;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'brand_id',
        'location_id',
        'description',
        'short_description',
        'base_price',
        'sale_price',
        'mileage_value',
        'mileage_units',
        'is_lease',
        'is_selling',
        'is_featured',
        'is_published',
        'approved_at',
        'expires_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured'  => 'boolean',
        'is_lease'     => 'boolean',
        'is_selling'   => 'boolean',
        'base_price'   => 'decimal:2',
        'sale_price'   => 'decimal:2',
        'expires_at'   => 'datetime',
        'approved_at'  => 'datetime',
    ];

    /**
     * Get the options for logging activity.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Register media collections using trait helpers.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    /**
     * Register media conversions for the auto listing.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('auto_listing_preview')
            ->width(800)
            ->height(600)
            ->sharpen(10)
            ->nonQueued();
    }

    // --- Relationships ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function features(): MorphToMany
    {
        return $this->morphToMany(Feature::class, 'featurable');
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(AutoInquiry::class);
    }

    public function inquiriesNew(): HasMany
    {
        return $this->hasMany(AutoInquiry::class)->whereNull('viewed_at');
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active and approved listings.
     */
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

    // --- Accessors & Mutators ---

    /**
     * Determine if the auto is new (created within the last 30 days).
     */
    protected function isNew(): Attribute
    {
        return Attribute::make(
            get: fn ($value, array $attributes) => $this->created_at 
                ? $this->created_at->gt(Carbon::now()->subDays(30)) 
                : false
        )->shouldCache();
    }

    /**
     * Get a short snippet of the description.
     */
    protected function shortDescription(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!empty($this->short_description)) {
                    return $this->short_description;
                }
                return !empty($this->description) 
                    ? str($this->description)->words(10, '...') 
                    : null;
            }
        );
    }

    /**
     * Get the formatted price using system currency settings.
     * Use config() to allow global currency changes without touching code.
     */
    /**
     * Get the formatted price with dynamic symbol and position.
     */
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

    /**
     * Get the price in K/M shorthand format (e.g., $1.2M or 500K€).
     */
    protected function priceFormattedK(): Attribute
    {
        return Attribute::make(
            get: function () {
                // 1. Determine the active price
                $price = ($this->sale_price > 0) ? $this->sale_price : $this->base_price;

                if ($price <= 0) return null;

                // 2. Fetch global settings
                $symbol = setting('currency_symbol', '$');
                $position = setting('currency_position', 'left');

                // 3. Calculate shorthand value
                if (abs($price) >= 1000000) {
                    $value = number_format($price / 1000000, 1) . 'M';
                } elseif (abs($price) >= 1000) {
                    $value = number_format($price / 1000, 1) . 'K';
                } else {
                    $value = number_format($price, 2);
                }

                // 4. Return with correct symbol positioning
                return $position === 'left' 
                    ? "{$symbol}{$value}" 
                    : "{$value}{$symbol}";
            }
        )->shouldCache();
    }

    /**
     * Format mileage based on unit preferences.
     */
    protected function mileageFormatted(): Attribute
    {
        return Attribute::make(
            get: function ($value, array $attributes) {
                $rawDistance = $attributes['mileage_value'] ?? 0;
                $savedUnit = $attributes['mileage_units'] ?? 'mi';
                $displayUnit = Session::get('unit_preference') ?: $savedUnit;
                
                $distance = $rawDistance;

                if ($savedUnit === 'mi' && $displayUnit === 'km') {
                    $distance = $rawDistance * self::MILE_TO_KM_FACTOR;
                } elseif ($savedUnit === 'km' && $displayUnit === 'mi') {
                    $distance = $rawDistance * self::KM_TO_MILE_FACTOR;
                }
                
                $formattedDistance = ($distance >= 1000) 
                    ? round($distance / 1000) . 'k' 
                    : number_format($distance, 0);
                
                return "{$formattedDistance} {$displayUnit}";
            }
        )->shouldCache();
    }
}
