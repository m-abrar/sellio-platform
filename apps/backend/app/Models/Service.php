<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use App\Traits\Models\HasStatusModeration;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Service
 * * The central model for the Professional Services vertical.
 * Supports subscription-based or project-based offerings with 
 * appointment and quote management lead systems.
 */
class Service extends Model implements HasMedia
{
    use SoftDeletes, HasFactory, InteractsWithMedia, LogsActivity, HasImageAccess, HasStatusModeration;

    /**
     * Constants for media management.
     */
    public const PRIMARY_MEDIA = 'service_main_photo';
    public const GALLERY_MEDIA = 'service_gallery';

    protected $table = 'services'; 

    protected $fillable = [
        'user_id', 'category_id', 'brand_id', 'type_id', 'location_id',
        'title', 'slug', 'description', 'operating_hours', 'operating_days_label',
        'base_price', 'sale_price', 'expertise_level', 'availability_schedule',
        'service_radius', 'licenses_certs', 'min_contract_months', 'max_client_slots',
        'address', 'city', 'state', 'country', 'zip_code', 'latitude', 'longitude',
        'is_published', 'is_featured', 'is_subscription', 'is_project_based',
        'meta_title', 'meta_description', 'expires_at'
    ];

    protected $casts = [
        'base_price'          => 'decimal:2',
        'sale_price'          => 'decimal:2',
        'is_published'        => 'boolean',
        'is_featured'         => 'boolean',
        'is_subscription'     => 'boolean',
        'is_project_based'    => 'boolean',
        'min_contract_months' => 'integer',
        'max_client_slots'    => 'integer',
        'latitude'            => 'float',
        'longitude'           => 'float',
        'approved_at'         => 'datetime',
        'expires_at'         => 'datetime',
    ];

    // --- Media Configuration ---

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }

    // --- Activity Log ---

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs();
    }

    // --- Relationships ---

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function provider(): BelongsTo { return $this->belongsTo(User::class); } // Alias for UX
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function type(): BelongsTo { return $this->belongsTo(Type::class); }
    public function brand(): BelongsTo { return $this->belongsTo(Brand::class); }
    public function location(): BelongsTo { return $this->belongsTo(Location::class); }
    public function packages(): HasMany { return $this->hasMany(ServicePackage::class)->orderBy('sort_order', 'asc'); }

    /** Service Specific Leads */
    public function quotes(): HasMany { return $this->hasMany(ServiceQuote::class, 'service_id'); }
    public function appointments(): HasMany { return $this->hasMany(ServiceAppointment::class, 'service_id'); }
    
    /** Notification Scopes */
    public function quotesNew(): HasMany { return $this->quotes()->whereNull('viewed_at'); }
    public function appointmentsNew(): HasMany { return $this->appointments()->whereNull('viewed_at'); }

    /** Polymorphic Features */
    public function features(): MorphToMany { return $this->morphToMany(Feature::class, 'featurable')->withPivot('value'); }
    public function tags(): MorphToMany { return $this->morphToMany(Tag::class, 'taggable'); }
    public function reviews(): MorphMany { return $this->morphMany(Review::class, 'reviewable'); }
    public function favorites(): MorphMany { return $this->morphMany(Favorite::class, 'favoritable'); }

    // --- Accessors (Modern Attribute Syntax) ---

    protected function shortDescription(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (!empty($attributes['short_description'])) return $attributes['short_description'];
                return !empty($attributes['description']) ? str($attributes['description'])->words(10, '...') : null;
            }
        );
    }

    protected function ratingAverage(): Attribute
    {
        return Attribute::make(
            get: fn () => number_format($this->reviews()->avg('rating') ?? 0, 1)
        )->shouldCache();
    }

    protected function price(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!empty($this->sale_price) && $this->sale_price > 0) return $this->sale_price;
                return (!empty($this->base_price) && $this->base_price > 0) ? $this->base_price : null;
            }
        );
    }

    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = $this->price;
                if (!$price) return null;

                $symbol = setting('currency_symbol', '$');
                $position = setting('currency_position', 'left');
                $value = number_format($price, 2);

                return $position === 'left' ? "{$symbol}{$value}" : "{$value}{$symbol}";
            }
        )->shouldCache();
    }

    protected function priceFormattedK(): Attribute
    {
        return Attribute::make(
            get: function () {
                $price = $this->price;
                if (!$price || $price <= 0) return null;

                $symbol = setting('currency_symbol', '$');
                $position = setting('currency_position', 'left');

                if (abs($price) >= 1000000) {
                    $val = number_format($price / 1000000, 1) . 'M';
                } elseif (abs($price) >= 1000) {
                    $val = number_format($price / 1000, 1) . 'K';
                } else {
                    $val = number_format($price, 2);
                }

                return $position === 'left' ? "{$symbol}{$val}" : "{$val}{$symbol}";
            }
        )->shouldCache();
    }

    // --- Scopes ---

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

    protected function isOpen(): Attribute
    {
        return Attribute::make(
            get: function () {
                // 1. Basic Validation
                if (empty($this->operating_hours) || empty($this->operating_days_label)) {
                    return false;
                }

                try {
                    $now = now();
                    
                    // 2. Check if Today is a working day
                    // Parses "Monday - Friday" or "Saturday - Sunday"
                    $days = explode(' - ', $this->operating_days_label);
                    if (count($days) === 2) {
                        $startDay = Carbon::parse($days[0])->dayOfWeek;
                        $endDay = Carbon::parse($days[1])->dayOfWeek;
                        $currentDay = $now->dayOfWeek;

                        // Handle ranges that cross over weekends (e.g., Thursday - Tuesday)
                        if ($startDay <= $endDay) {
                            if ($currentDay < $startDay || $currentDay > $endDay) return false;
                        } else {
                            // Overflow range logic
                            if ($currentDay < $startDay && $currentDay > $endDay) return false;
                        }
                    }

                    // 3. Check if current Time is within hours
                    $times = explode(' - ', $this->operating_hours);
                    if (count($times) !== 2) return false;

                    // Create Carbon instances for today with the service's hours
                    $start = Carbon::createFromFormat('h:i A', $times[0], $now->timezone);
                    $end = Carbon::createFromFormat('h:i A', $times[1], $now->timezone);

                    return $now->between($start, $end);

                } catch (Exception $e) {
                    // Log error if needed: \Log::error("Schedule Parsing Error: " . $e->getMessage());
                    return false;
                }
            }
        );
    }
}

