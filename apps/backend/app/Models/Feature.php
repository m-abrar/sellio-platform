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
 * App\Models\Feature
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $icon
 * @property string|null $description
 * @property bool $is_property
 * @property bool $is_auto
 * @property bool $is_event
 * @property bool $is_job
 * @property bool $is_service
 * @property bool $is_classified
 * @property bool $is_product
 * @property bool $is_blog
 * @property bool $is_published
 * @property array|null $types
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Feature extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'feature_icon';
    public const GALLERY_MEDIA = 'feature_images';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'icon',
        'description',
        'is_property',
        'is_auto',
        'is_event',
        'is_job',
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
        'is_auto'       => 'boolean',
        'is_event'      => 'boolean',
        'is_job'        => 'boolean',
        'is_service'    => 'boolean',
        'is_classified' => 'boolean',
        'is_product'    => 'boolean',
        'is_blog'    => 'boolean',
        'is_published'  => 'boolean',
        'types'         => 'array',
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

    /**
     * Register media collections using the trait helper.
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
    }

    // --- Relationships ---

    /**
     * Get the properties associated with this feature.
     */
    public function properties(): BelongsToMany
    {
        return $this->belongsToMany(Property::class);
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active features.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
