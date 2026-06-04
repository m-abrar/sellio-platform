<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\PropertyAddon
 *
 * @property int $id
 * @property int $property_id
 * @property string $title
 * @property string|null $description
 * @property float $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Property $property
 */
class PropertyAddon extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageAccess;

    /**
     * Constants to define media collections used by the HasImageAccess trait.
     */
    public const PRIMARY_MEDIA = 'addon_icon';
    public const GALLERY_MEDIA = 'addon_photos';

    /**
     * The table associated with the model.
     * * @var string
     */
    protected $table = 'property_addons';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'title',
        'description',
        'icon',
        'price',
        'type',
        'max_qty',
        'is_popular',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'is_popular' => 'boolean',
        'max_qty' => 'integer',
        'sort_order' => 'integer',
    ];

    // --- Media Management ---

    /**
     * Register media collections using the trait helper.
     */
    public function registerMediaCollections(): void
    {
        // Calls the trait method to register collections based on constants
        $this->registerMediaCollectionFromConstants(); 
    }

    // --- Relationships ---

    /**
     * Get the property that owns the addon.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
