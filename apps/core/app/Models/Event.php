<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use App\Models\User;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Event
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $start_date_time
 * @property \Illuminate\Support\Carbon $end_date_time
 * @property float|null $base_price
 * @property float|null $sale_price
 * @property bool $is_published
 * @property \Illuminate\Support\Carbon|null $approved_at
 */
class Event extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use LogsActivity;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'poster_image';
    public const GALLERY_MEDIA = 'event_gallery';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'location_id',
        'brand_id',
        'type_id',
        'title',
        'slug',
        'description',
        'start_date_time',
        'end_date_time',
        'is_paid',
        'is_published',
        'is_featured',
        'max_attendees',
        'base_price',
        'sale_price',
        'address',
        'latitude',
        'longitude',
        'approved_at',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date_time' => 'datetime',
        'end_date_time'   => 'datetime',
        'is_paid'         => 'boolean',
        'is_published'    => 'boolean',
        'is_featured'     => 'boolean',
        'max_attendees'   => 'integer',
        'base_price'      => 'decimal:2',
        'sale_price'      => 'decimal:2',
        'approved_at'     => 'datetime',
        'expires_at'      => 'datetime',
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
     * Register media collections using the trait helper.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }

    /**
     * Register media conversions for event visuals.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('event_poster_preview')
            ->width(1200)
            ->height(675)
            ->nonQueued();
    }

    // --- Relationships ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(Type::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function ticketTypes(): HasMany
    {
        return $this->hasMany(EventTicketType::class);
    }

    public function occurrences(): HasMany
    {
        return $this->hasMany(EventOccurrence::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(EventBooking::class);
    }

    public function bookingsNew(): HasMany
    {
        return $this->hasMany(EventBooking::class)->whereNull('viewed_at');
    }

    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // --- Scopes ---

    /**
     * Scope a query to only include published and approved events.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true)->whereNotNull('approved_at');
    }

    /**
     * Scope visibility based on the authenticated user's role.
     *
     * - guests / buyers   → active listings only
     * - partner           → own listings (any status) + active listings from others
     * - admin/super-admin → all listings, unrestricted
     */
    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        if (!$user || $user->hasRole('user')) {
            return $query->active();
        }

        if ($user->hasRole(['admin', 'super-admin'])) {
            return $query;
        }

        if ($user->hasRole('partner')) {
            return $query->where(fn (Builder $q) => $q->active()->orWhere('user_id', $user->id));
        }

        return $query->active();
    }

    // --- Accessors & Mutators ---

    /**
     * Get the events left.
     */
    protected function ticketsLeft(): Attribute
    {
        return Attribute::make(
            get: function () {
                return 100; //TODO complete this
            }
        );
    }

    /**
     * Get the standard formatted price.
     */
    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = ($this->sale_price > 0) ? $this->sale_price : $this->base_price;
                return ($price > 0) ? '$' . number_format($price, 2) : null;
            }
        );
    }

    /**
     * Get the shorthand price format (e.g., $1.2K).
     */
    protected function priceFormattedK(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = ($this->sale_price > 0) ? $this->sale_price : $this->base_price;

                if ($price <= 0) return null;

                if (abs($price) >= 1000000) {
                    return '$' . number_format($price / 1000000, 1) . 'M';
                }

                if (abs($price) >= 1000) {
                    return '$' . number_format($price / 1000, 1) . 'K';
                }

                return '$' . number_format($price, 2);
            }
        );
    }


    protected function isFree(): Attribute
    {
        return Attribute::make(
            get: fn () => floatval($this->base_price) <= 0
        );
    }

    /**
     * Check if the event has an active sale price.
     */
    protected function onSale(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sale_price > 0 && $this->sale_price < $this->base_price
        );
    }
}
