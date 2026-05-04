<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class Amenity
 *
 * @package App\Models
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property bool $is_published
 * @property bool $is_property
 * @property bool $is_event
 * @property bool $is_job
 * @property bool $is_auto
 * @property bool $is_service
 * @property bool $is_classified
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Property[] $properties
 *
 * @method static Builder|Amenity active()
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Amenity extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

    /**
     * Media collection constants.
     */
    public const PRIMARY_MEDIA = 'amenity_icon';
    public const GALLERY_MEDIA = 'amenity_photos';

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
        'is_published',
        'is_property',
        'is_event',
        'is_job',
        'is_auto',
        'is_service',
        'is_classified',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_published' => 'boolean',
        'is_property' => 'boolean',
        'is_event' => 'boolean',
        'is_job' => 'boolean',
        'is_auto' => 'boolean',
        'is_service' => 'boolean',
        'is_classified' => 'boolean',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Amenity $amenity): void {
            if (empty($amenity->slug)) {
                $amenity->slug = Str::slug($amenity->title);
            }
        });
    }

    /**
     * Define the relationship with properties.
     *
     * @return BelongsToMany
     */
    public function properties(): BelongsToMany
    {
        return $this->belongsToMany(Property::class);
    }

    /**
     * Scope a query to only include published amenities.
     *
     * @param Builder $query
     * @return Builder
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

    /**
     * Register media collections.
     *
     * @return void
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    /**
     * Register media conversions.
     *
     * @param Media|null $media
     * @return void
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('amenity_listing_icon')
            ->width(48)
            ->height(48)
            ->nonQueued();
    }
}
