<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * Class Advertisement
 *
 * @package App\Models
 *
 * @property int $id
 * @property string $title
 * @property string|null $image_path
 * @property string|null $link
 * @property string $status
 * @property array|null $orientations
 * @property float|null $latitude
 * @property float|null $longitude
 * @property int|null $radius
 * @property array|null $cities
 * @property array|null $zipcodes
 * @property array|null $regions
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Advertisement extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageAccess, LogsActivity;

    /**
     * Media collection constants for Spatie Media Library.
     */
    public const PRIMARY_MEDIA = 'banner_image';
    public const GALLERY_MEDIA = 'banner_gallery';

    // --- Status Constants ---
    public const STATUS_ACTIVE   = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_EXPIRED   = 'expired';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'image_path',
        'link',
        'status',
        'orientations',
        'latitude',
        'longitude',
        'radius',
        'cities',
        'zipcodes',
        'regions',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'orientations' => 'array',
        'cities'       => 'array',
        'zipcodes'     => 'array',
        'regions'      => 'array',
        'latitude'     => 'double',
        'longitude'    => 'double',
        'radius'       => 'integer',
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
     * Register media collections using the HasImageAccess trait.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    /**
     * Register media conversions for the advertisement.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('ad_banner_hd')
            ->width(1920)
            ->height(300)
            ->nonQueued();
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active advertisements.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    // --- UI Helpers ---

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_ACTIVE    => ['label' => 'Active', 'color' => 'success'],
            self::STATUS_INACTIVE  => ['label' => 'Inactive', 'color' => 'secondary'],
            self::STATUS_SCHEDULED => ['label' => 'Scheduled', 'color' => 'info'],
            self::STATUS_EXPIRED   => ['label' => 'Expired', 'color' => 'danger'],
            default               => ['label' => 'Unknown', 'color' => 'dark'],
        };
    }
}
