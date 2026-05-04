<?php

namespace App\Models;

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
 * App\Models\Location
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $state
 * @property string|null $zip_code
 * @property string|null $country
 * @property float|null $latitude
 * @property float|null $longitude
 * @property bool $is_published
 * @property bool $is_property
 * @property bool $is_event
 * @property bool $is_auto
 * @property bool $is_service
 * @property bool $is_job
 * @property bool $is_classified
 * @property bool $is_product
 * @property bool $is_blog
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Location extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'location_photo';
    public const GALLERY_MEDIA = 'location_gallery';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'latitude',
        'longitude',
        'state',
        'zip_code',
        'country',
        'is_property',
        'is_event',
        'is_auto',
        'is_service',
        'is_job',
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
        'is_auto'       => 'boolean',
        'is_service'    => 'boolean',
        'is_job'        => 'boolean',
        'is_classified' => 'boolean',
        'is_product'    => 'boolean',
        'is_blog'       => 'boolean',
        'is_published'  => 'boolean',
        'latitude'      => 'decimal:8',
        'longitude'     => 'decimal:8',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Model $model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

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
     * Get all properties in this location.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Get all autos in this location.
     */
    public function autos(): HasMany
    {
        return $this->hasMany(Auto::class);
    }

    /**
     * Get all services in this location.
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
    /**
     * Get all classified ads in this location.
     */
    public function classifieds(): HasMany
    {
        return $this->hasMany(Classified::class);
    }

    /**
     * Get all events in this location.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Get all job listings in this location.
     */
    public function jobs(): HasMany
    {
        return $this->hasMany(JobListing::class);
    }

    /**
     * Get all product listings in this location.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // --- Scopes ---

    /**
     * Scope a query to only include published locations.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to filter locations by type (e.g., jobs, properties).
     */
    public function scopeForType(Builder $query, string $type): Builder
    {
        $column = 'is_' . $type;
        return $query->where($column, true);
    }

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['listings_count'];

    /**
     * Aggregates active listings count across all verticals for this location.
     * Cached to handle high-traffic location-based filtering.
     */
    public function listingsCount(): Attribute
    {
        return Attribute::make(
            get: function () {
                $cacheKey = "location_listings_count_{$this->id}_" . ($this->updated_at?->timestamp ?? 'new');

                return cache()->remember($cacheKey, now()->addMinutes(30), function () {
                    $verticals = [
                        'properties', 
                        'events', 
                        'jobs', 
                        'services', 
                        'classifieds', 
                        'autos'
                    ];

                    return collect($verticals)->sum(function ($relation) {
                        return method_exists($this, $relation) 
                            ? $this->$relation()->active()->count() 
                            : 0;
                    });
                });
            }
        );
    }
}
