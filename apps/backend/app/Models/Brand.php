<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Brand
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string|null $meta_title
 * @property string|null $meta_description
 * @property bool $is_property
 * @property bool $is_event
 * @property bool $is_job
 * @property bool $is_auto
 * @property bool $is_service
 * @property bool $is_classified
 * @property bool $is_product
 * @property bool $is_blog
 * @property bool $is_published
 * @property-read int $listings_count
 */
class Brand extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'brand_logo';
    public const GALLERY_MEDIA = 'brand_assets';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'brands';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'meta_title',
        'meta_description',
        'is_property',
        'is_event',
        'is_job',
        'is_auto',
        'is_service',
        'is_classified',
        'is_product', 
        'is_blog', 
        'is_published',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_property'   => 'boolean',
        'is_event'      => 'boolean',
        'is_job'        => 'boolean',
        'is_auto'       => 'boolean',
        'is_service'    => 'boolean',
        'is_classified' => 'boolean',
        'is_product'    => 'boolean',
        'is_blog'       => 'boolean',
        'is_published'  => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($brand) {
            $brand->slug = $brand->slug ?? Str::slug($brand->title);
        });
    }

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    /**
     * Register media conversions.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('header_logo')
            ->width(300)
            ->height(100)
            ->nonQueued();
    }

    // --- Relationships ---

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function autos(): HasMany
    {
        return $this->hasMany(Auto::class);
    }

    public function classifieds(): HasMany
    {
        return $this->hasMany(Classified::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(JobListing::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    // --- Scopes ---

    /**
     * Scope a query to only include published brands.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    // --- Accessors & Mutators ---

    /**
     * Calculate the total count of all published listings across all categories.
     */
    /**
     * Calculate the total count of all published listings across all categories.
     * Cached for 10 minutes to ensure high performance in production.
     */
    protected function listingsCount(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Use Brand ID and timestamp to ensure the cache invalidates if the brand is edited
                $cacheKey = "brand_count_{$this->id}_" . ($this->updated_at?->timestamp ?? 'new');

                return cache()->remember($cacheKey, now()->addMinutes(10), function () {
                    $relations = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
                    $total = 0;

                    foreach ($relations as $relation) {
                        // Check if relationship method exists and use scopeActive for consistency
                        if (method_exists($this, $relation)) {
                            $total += $this->$relation()->active()->count();
                        }
                    }

                    return $total;
                });
            }
        );
    }
}

