<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Category
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property int|null $parent_id
 * @property bool $is_property
 * @property bool $is_event
 * @property bool $is_auto
 * @property bool $is_service
 * @property bool $is_job
 * @property bool $is_classified
 * @property bool $is_product
 * @property bool $is_blog
 * @property bool $is_featured
 * @property bool $is_published
 * @property array|null $types
 * @property-read int $listings_count
 */
class Category extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'category_icon';
    public const GALLERY_MEDIA = 'category_cover';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'icon',
        'parent_id',
        'is_property',
        'is_event',
        'is_auto',
        'is_service',
        'is_job',
        'is_classified',
        'is_product',
        'is_blog',
        'is_featured',
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
        'is_featured'   => 'boolean',
        'is_published'  => 'boolean',
        'types'         => 'array',
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

        static::creating(function ($category) {
            $category->slug = $category->slug ?? Str::slug($category->title);
        });
    }

    /**
     * Register media collections using the trait helper.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    // --- Relationships ---

    /**
     * Get the parent category.
     */
    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get the subcategories for this category.
     */
    // public function subCategories(): HasMany
    // {
    //     return $this->hasMany(Category::class, 'parent_id');
    // }



    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Recursive relationship to get all descendants
    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }



    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
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

    public function classifieds(): HasMany
    {
        return $this->hasMany(Classified::class);
    }

    public function autos(): HasMany
    {
        return $this->hasMany(Auto::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // --- Scopes ---

    /**
     * Scope a query to only include published categories.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to filter categories by type (e.g., jobs, properties).
     */
    public function scopeForType(Builder $query, string $type): Builder
    {
        $column = 'is_' . $type;
        return $query->where($column, true);
    }

    // --- Accessors & Mutators ---

    /**
     * Calculate the total count of all published listings within this category.
     */
    public function listingsCount(): Attribute
    {
        return Attribute::make(
            get: function () {
                // If the count has been pre-loaded via withCount(), return it immediately
                if (isset($this->attributes['properties_count'])) {
                    return array_sum(array_intersect_key($this->attributes, array_flip([
                        'properties_count', 'autos_count', 'events_count', 'jobs_count', 
                        'services_count', 'classifieds_count', 'products_count'
                    ])));
                }

                // Unique key based on ID and last update to ensure validity
                $cacheKey = "category_listings_count_{$this->id}_" . ($this->updated_at?->timestamp ?? 'new');

                return cache()->remember($cacheKey, now()->addMinutes(20), function () {
                    $verticals = ['properties', 'events', 'jobs', 'services', 'classifieds', 'autos', 'products'];
                    $count = 0;
                    foreach ($verticals as $relation) {
                        if (method_exists($this, $relation)) {
                            $count += $this->$relation()->active()->count();
                        }
                    }
                    return $count;
                });
            }
        );
    }
}
