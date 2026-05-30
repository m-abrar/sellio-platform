<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Plan
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property string|null $label_text (e.g., 'Save 20%', 'New')
 * @property float $price
 * @property string $billing_period (monthly, yearly, lifetime)
 * @property int|null $max_listings
 * @property int|null $max_addons
 * @property int|null $max_featured_listings
 * @property int|null $listing_duration (days)
 * @property bool $priority_support
 * @property bool $custom_branding
 * @property bool $analytics_access
 * @property bool $is_active
 * @property bool $is_featured
 * @property bool $is_popular
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Plan extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'plan_icon';
    public const GALLERY_MEDIA = 'plan_banners';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'label_text',
        'price',
        'billing_period',
        'max_listings',
        'max_addons',
        'priority_support',
        'max_featured_listings',
        'custom_branding',
        'analytics_access',
        'listing_duration',
        'is_active',
        'is_featured',
        'is_popular',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price'                 => 'decimal:2',
        'max_listings'          => 'integer',
        'max_addons'            => 'integer',
        'max_featured_listings' => 'integer',
        'listing_duration'      => 'integer',
        'priority_support'      => 'boolean',
        'custom_branding'       => 'boolean',
        'analytics_access'      => 'string',
        'is_active'             => 'boolean',
        'is_featured'           => 'boolean',
        'is_popular'            => 'boolean',
    ];

    // --- Media Management ---

    /**
     * Register media collections using the trait helper.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    /**
     * Register media conversions for plan displays.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('plan_banner_preview')
            ->width(1920)
            ->height(300)
            ->nonQueued();
    }

    // --- Relationships ---

    /**
     * Get the subscriptions associated with this pricing plan.
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    // --- Attributes (Mutators/Accessors) ---

    /**
     * Handles normalization of quota fields (null if empty or zero).
     */
    protected function maxListings(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ?: null,
        );
    }

    protected function maxFeaturedListings(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ?: null,
        );
    }

    protected function maxAddons(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ?: null,
        );
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active plans.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order by price (useful for pricing tables).
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('price', 'asc');
    }
}
