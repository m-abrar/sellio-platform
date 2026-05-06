<?php

namespace App\Models;

use App\Traits\HasAnalytics;
use App\Traits\HasImageAccess;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Spatie\Activitylog\LogOptions;
use App\Models\User;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Traits\Models\HasStatusModeration;

/**
 * App\Models\Property
 *
 * @property int $id
 * @property int|null $user_id
 * @property int|null $category_id
 * @property int|null $type_id
 * @property int|null $brand_id
 * @property int|null $location_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property float $base_price
 * @property float|null $sale_price
 * @property float|null $price_per_night
 * @property int $total_units
 * @property int $number_of_bedrooms
 * @property int $number_of_bathrooms
 * @property int $maximum_guests
 * @property int $minimum_rental_days
 * @property int $maximum_rental_days
 * @property float|null $area_sq_ft
 * @property float|null $area_sq_m
 * @property string|null $number_of_parking_spots
 * @property float|null $hoa
 * @property string|null $rules
 * @property string|null $policies
 * @property int|null $year_built
 * @property string|null $video
 * @property string|null $virtual_tour
 * @property string|null $address
 * @property string $city
 * @property string|null $state
 * @property string $country
 * @property string|null $zip_code
 * @property float|null $latitude
 * @property float|null $longitude
 * @property bool $is_published
 * @property bool $is_featured
 * @property bool $is_rental
 * @property bool $is_sale
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * The core engine of the Real Estate vertical. Handles polymorphic features, 
 * dual-pricing (Sale/Rental), and comprehensive lead tracking.
 */
class Property extends Model implements HasMedia
{
    use LogsActivity, HasAnalytics, HasFactory, InteractsWithMedia, HasImageAccess, SoftDeletes, HasStatusModeration;

    /**
     * Eager load common relationships to prevent N+1 performance issues
     * in marketplaces listings and search results.
     */
    protected $with = ['media', 'type', 'location'];

    /**
     * Constants for media collections used by HasImageAccess trait.
     */
    public const PRIMARY_MEDIA = 'featured_image';
    public const GALLERY_MEDIA = 'gallery_photos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id', 'category_id', 'type_id', 'brand_id', 'location_id',
        'title', 'slug', 'description', 'base_price', 'sale_price', 'price_per_night',
        'total_units', 'number_of_bedrooms', 'number_of_bathrooms', 'maximum_guests',
        'minimum_rental_days', 'maximum_rental_days', 'area_sq_ft', 'area_sq_m',
        'number_of_parking_spots', 'hoa', 'rules', 'policies', 'year_built',
        'video', 'virtual_tour', 'address', 'city', 'state', 'country', 'zip_code',
        'latitude', 'longitude', 'is_published', 'is_featured', 'is_rental', 'is_sale',
        'meta_title', 'meta_description', 'approved_at', 'expires_at'
    ];

    /**
     * Attribute casting for data integrity and IDE support.
     */
    protected $casts = [
        'is_published'    => 'boolean',
        'is_featured'     => 'boolean',
        'is_rental'       => 'boolean',
        'is_sale'         => 'boolean',
        'year_built'      => 'integer',
        'base_price'      => 'decimal:2',
        'sale_price'      => 'decimal:2',
        'price_per_night' => 'decimal:2',
        'expires_at'      => 'datetime',
        'approved_at'     => 'datetime',
    ];

    // --- Media Management ---

    /**
     * Register media collections based on defined constants.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }
    
    /**
     * Define media conversions for high-performance front-end rendering.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);
        
        $this->addMediaConversion('listing_hero')
             ->width(1920)->height(500)
             ->quality(90)->sharpen(10)->format('webp')->nonQueued();
    }

    // --- Relationships (Belongs To) ---

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function type(): BelongsTo { return $this->belongsTo(Type::class); }
    public function brand(): BelongsTo { return $this->belongsTo(Brand::class); }
    public function location(): BelongsTo { return $this->belongsTo(Location::class); }

    // --- Relationships (Has Many & Notification Scopes) ---

    public function neighborhoods(): HasMany { return $this->hasMany(PropertyNeighborhood::class); }
    public function scores(): HasMany { return $this->hasMany(PropertyScore::class); }
    public function bookings(): HasMany { return $this->hasMany(PropertyBooking::class); }
    
    /** Get only bookings that haven't been seen by the agent yet */
    public function bookingsNew(): HasMany { return $this->hasMany(PropertyBooking::class)->whereNull('viewed_at'); }
    
    public function visits(): HasMany { return $this->hasMany(PropertyVisit::class); }
    
    /** Get only visit requests that haven't been seen by the agent yet */
    public function visitsNew(): HasMany { return $this->hasMany(PropertyVisit::class)->whereNull('viewed_at'); }
    
    public function prices(): HasMany { return $this->hasMany(SeasonalPrice::class); }
    public function seasonalPrices(): HasMany { return $this->hasMany(SeasonalPrice::class); }
    public function addons(): HasMany { return $this->hasMany(PropertyAddon::class); }
    public function transactionLines(): HasMany { return $this->hasMany(TransactionLine::class); }
    public function fees(): HasMany { return $this->hasMany(PropertyFee::class); }

    // --- Relationships (Many-to-Many & Polymorphic) ---

    public function amenities(): BelongsToMany { return $this->belongsToMany(Amenity::class); }
    public function features(): MorphToMany { return $this->morphToMany(Feature::class, 'featurable'); }
    public function reviews(): MorphMany { return $this->morphMany(Review::class, 'reviewable'); }
    
    /** Get only reviews that haven't been seen by the moderator/agent yet */
    public function reviewsNew(): MorphMany { return $this->morphMany(Review::class, 'reviewable')->whereNull('viewed_at'); }
    
    public function favorites(): MorphMany { return $this->morphMany(Favorite::class, 'favoritable'); }
    public function tags(): MorphToMany { return $this->morphToMany(Tag::class, 'taggable'); }

    // --- Scopes ---

    /** Scope to filter listings that are approved and published */
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

    protected function isActive(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->is_published && !is_null($this->approved_at),
        );
    }
    
    /** Scope to order listings by their average review rating */
    public function scopeOrderByRating(Builder $query, string $direction = 'desc'): Builder
    {
        return $query->withAvg('reviews', 'rating')->orderBy('reviews_avg_rating', $direction);
    }

    // --- Accessors (Modern Laravel Attribute Syntax) ---

    /** Returns a clean string of the average rating (e.g., 4.5) */
    protected function ratingAverage(): Attribute
    {
        return Attribute::make(
            get: fn () => rtrim(rtrim(number_format($this->reviews()->avg('rating') ?? 0, 2), '0'), '.')
        )->shouldCache();
    }
    
    /** Formats area into human readable Square Feet or Meters */
    protected function areaFormatted(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if ($attributes['area_sq_ft']) {
                    return number_format($attributes['area_sq_ft']) . " Sq Ft";
                }
                if ($attributes['area_sq_m']) {
                    return number_format($attributes['area_sq_m']) . " Sq M";
                }
                return 'N/A';
            }
        );
    }

    /** Returns true if listing was created in the last 30 days */
    protected function isNew(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->created_at ? $this->created_at->gt(Carbon::now()->subDays(30)) : false
        )->shouldCache();
    }
    
    /** Formats the HOA fee for display */
    protected function hoaFormatted(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (!isset($attributes['hoa']) || is_null($attributes['hoa'])) return null;
                return setting('currency_symbol', '$') . number_format($attributes['hoa'], 2) . ' / month';
            }
        )->shouldCache();
    }
    
    /** Logic to determine which price (Sale/Rental/Base) is currently active */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->is_rental) {
                    return (!empty($this->price_per_night) && $this->price_per_night > 0) ? $this->price_per_night : null;
                }
                if ($this->is_sale) {
                    if (!empty($this->sale_price) && $this->sale_price > 0) return $this->sale_price;
                    if (!empty($this->base_price) && $this->base_price > 0) return $this->base_price;
                }
                return null;
            }
        );
    }

    /** Formats the active price with currency and units */
    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {

                $currency = setting('currency_symbol', '$');

                // Rental price (per night)
                if ($this->is_rental && ! is_null($this->price_per_night)) {
                    return $currency . number_format($this->price_per_night, 2) . ' / night';
                }

                // Sale price or base price
                $price = $this->sale_price ?? $this->base_price;

                return $price
                    ? $currency . number_format($price, 2)
                    : null;
            }
        );
    }
    
    /** Formats large prices into abbreviated strings like 1.2M or 450K */
    protected function priceFormattedK(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = $this->price;

                if (!$price) {
                    return null;
                }

                $currency = setting('currency_symbol', '$');
                $unit = $this->is_rental ? ' / night' : '';

                if (abs($price) >= 1_000_000) {
                    return $currency . number_format($price / 1_000_000, 1) . 'M' . $unit;
                }

                if (abs($price) >= 1_000) {
                    return $currency . number_format($price / 1_000, 1) . 'K' . $unit;
                }

                return $currency . number_format($price, 2) . $unit;
            }
        );
    }


    /** Returns the short description or clips the long description automatically */
    protected function shortDescription(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (!empty($attributes['short_description'])) return $attributes['short_description'];
                return !empty($attributes['description']) ? str($attributes['description'])->words(10, '...') : null;
            }
        );
    }

    // --- Activity Log Configuration ---
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs();
    }


    /**
     * Logic moved from Blade to Model: Returns the status string (SALE/RENTAL/NEW)
     */
    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->is_rental) return 'RENTAL';
                if ($this->is_sale) return 'SALE';
                return 'NEW';
            }
        );
    }

    /**
     * Logic moved from Blade to Model: Returns the CSS class for the badge
     */
    protected function statusColor(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->status_label) {
                'SALE'   => 'bg-danger text-white',
                'RENTAL' => 'bg-warning text-dark',
                default  => 'bg-primary text-white'
            }
        );
    }
}
