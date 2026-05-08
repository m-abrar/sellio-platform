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
 * App\Models\Type
 * * Defines specific listing classifications within a vertical.
 * Used to filter items by architectural type (Property), body style (Auto), 
 * or employment nature (Jobs).
 */
class Type extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageAccess;

    /**
     * Constants for media management.
     */
    public const PRIMARY_MEDIA = 'type_icon';
    public const GALLERY_MEDIA = 'type_cover';
    
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'slug',
        'icon',         // FontAwesome/SVG string support
        'description',
        'is_property', 
        'is_auto', 
        'is_event', 
        'is_service', 
        'is_job', 
        'is_classified', 
        'is_product', 
        'is_blog', 
        'is_published'
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'is_property'   => 'boolean', 
        'is_auto'       => 'boolean', 
        'is_event'      => 'boolean', 
        'is_service'    => 'boolean', 
        'is_job'        => 'boolean', 
        'is_classified' => 'boolean', 
        'is_product'    => 'boolean', 
        'is_blog'    => 'boolean', 
        'is_published'  => 'boolean',
    ];

    /**
     * Automatically append the calculated counts for UI badges.
     */
    protected $appends = ['listings_count'];

    // --- Lifecycle Hooks ---

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($type) {
            if (empty($type->slug)) {
                $type->slug = Str::slug($type->title);
            }
        });
    }

    // --- Media Configuration ---

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }

    // --- Scopes ---

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
    
    // --- Relationships ---
    
    

    public function properties(): HasMany { return $this->hasMany(Property::class); }
    public function autos(): HasMany       { return $this->hasMany(Auto::class); }
    public function events(): HasMany     { return $this->hasMany(Event::class); }
    public function jobs(): HasMany       { return $this->hasMany(JobListing::class); }
    public function services(): HasMany   { return $this->hasMany(Service::class); }
    public function classifieds(): HasMany { return $this->hasMany(Classified::class); }
    public function products(): HasMany       { return $this->hasMany(Product::class); }

    // --- Accessors (Modern Attribute Syntax) ---

    /**
     * Returns a combined count of all active items across verticals.
     * Essential for showing "Properties (45)" in sidebar navigation.
     */
    public function listingsCount(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Key is unique to this Type ID and invalidates if the record is updated
                $cacheKey = "type_count_{$this->id}_" . ($this->updated_at?->timestamp ?? 'new');

                return cache()->remember($cacheKey, now()->addMinutes(15), function () {
                    $relations = [
                        'properties', 
                        'events', 
                        'jobs', 
                        'services', 
                        'classifieds', 
                        'autos'
                    ];

                    return collect($relations)->sum(function ($relation) {
                        // Ensure the relationship exists and use a standardized active scope
                        return method_exists($this, $relation) 
                            ? $this->$relation()->active()->count() 
                            : 0;
                    });
                });
            }
        );
    }
}

