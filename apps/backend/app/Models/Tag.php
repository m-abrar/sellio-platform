<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Tag
 * * The global taxonomy engine. 
 * Provides cross-vertical filtering (e.g., 'Luxury', 'Discounted', 'Verified')
 * using a polymorphic many-to-many architecture.
 */
class Tag extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageAccess;

    /**
     * Constants for the HasImageAccess trait.
     * Allows tags to have custom icons or banner images.
     */
    public const PRIMARY_MEDIA = 'tag_icon';
    public const GALLERY_MEDIA = 'tag_images';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title', 
        'slug', 
        'is_property', 
        'is_auto', 
        'is_event', 
        'is_service', 
        'is_job', 
        'is_classified', 
        'is_product', 
        'is_blog', 
        'is_published',
        'description',
        'icon', // Support for FontAwesome/Bootstrap icon strings
    ];

    protected $casts = [
        'is_property'   => 'boolean', 
        'is_auto'       => 'boolean', 
        'is_event'      => 'boolean', 
        'is_service'    => 'boolean', 
        'is_job'        => 'boolean', 
        'is_classified' => 'boolean', 
        'is_product'    => 'boolean', 
        'is_blog'       => 'boolean', 
        'is_published'  => 'boolean',
    ];

    /**
     * Automatically append the calculated counts to JSON responses.
     */
    protected $appends = ['listings_count'];

    // --- Lifecycle Hooks ---

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->title);
            }
        });
    }

    // --- Media Configuration ---

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);
    }

    // --- Scopes ---

    /**
     * Only return tags that are marked as published.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope a query to filter by type.
     */
    public function scopeForType(Builder $query, string $type): Builder
    {
        $column = 'is_' . $type;
        return $query->where($column, true);
    }

    // --- Polymorphic Relationships (Morphed By Many) ---
    
    

    public function properties(): MorphToMany { return $this->morphedByMany(Property::class, 'taggable'); }
    public function autos(): MorphToMany { return $this->morphedByMany(Auto::class, 'taggable'); }
    public function events(): MorphToMany { return $this->morphedByMany(Event::class, 'taggable'); }
    public function jobs(): MorphToMany { return $this->morphedByMany(JobListing::class, 'taggable'); }
    public function services(): MorphToMany { return $this->morphedByMany(Service::class, 'taggable'); }
    public function classifieds(): MorphToMany { return $this->morphedByMany(Classified::class, 'taggable'); }

    // --- Accessors (Modern Attribute Syntax) ---

    /**
     * Aggregates the total number of active listings across all verticals.
     * Use with caution in high-traffic loops; consider using 'withCount' in controllers.
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

                // Fallback to cached individual counts if not pre-loaded
                return cache()->remember("tag_count_{$this->id}_{$this->updated_at?->timestamp}", now()->addMinutes(10), function () {
                    $relations = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
                    $total = 0;

                    foreach ($relations as $relation) {
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
