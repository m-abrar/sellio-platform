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
 * App\Models\JobListing
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $slug
 * @property float|null $salary_min
 * @property float|null $salary_max
 * @property string|null $salary_frequency
 * @property bool $is_published
 * @property \Illuminate\Support\Carbon|null $application_deadline
 * @property \Illuminate\Support\Carbon|null $approved_at
 */
class JobListing extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use LogsActivity;
    use HasImageAccess;

    public const PRIMARY_MEDIA = 'company_logo';
    public const GALLERY_MEDIA = 'office_photos';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'joblistings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'location_id',
        'type_id',
        'brand_id',
        'title',
        'slug',
        'description',
        'salary_min',
        'salary_max',
        'salary_frequency',
        'employment_type',
        'experience_level',
        'workplace_type',
        'required_education',
        'application_deadline',
        'address',
        'city',
        'state',
        'country',
        'zip_code',
        'latitude',
        'longitude',
        'is_published',
        'is_featured',
        'is_contract',
        'is_full_time',
        'approved_at',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_published'         => 'boolean',
        'is_featured'          => 'boolean',
        'is_contract'          => 'boolean',
        'is_full_time'         => 'boolean',
        'application_deadline' => 'datetime',
        'approved_at'          => 'datetime',
        'expires_at'          => 'datetime',
        'salary_min'           => 'float',
        'salary_max'           => 'float',
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
     * Register media collections.
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

        $this->addMediaConversion('listing_card_logo')
            ->width(100)
            ->height(100)
            ->sharpen(10)
            ->nonQueued();
    }

    // --- Relationships ---

    // public function user(): BelongsTo
    // {
    //     return $this->belongsTo(User::class);
    // }
    public function employer(): BelongsTo
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

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_listing_id');
    }

    public function applicationsNew(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_listing_id')->whereNull('viewed_at');
    }

    public function favorites(): MorphMany
    {
        return $this->morphMany(Favorite::class, 'favoritable');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // --- Accessors ---

    /**
     * Returns a CSS class based on the job category for UI badges.
     */
    public function getBadgeClassAttribute(): string
    {
        return match($this->category?->title) {
            'IT'        => 'bg-primary-subtle text-primary-emphasis',
            'Marketing' => 'bg-warning-subtle text-warning-emphasis',
            'Finance'   => 'bg-success-subtle text-success-emphasis',
            'HR'        => 'bg-info-subtle text-info-emphasis',
            default     => 'bg-secondary-subtle text-secondary-emphasis',
        };
    }

    /**
     * Compact salary format (e.g., $40k–$60k/yr).
     */
    protected function salaryRangeFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->salary_min && !$this->salary_max) return null;

                $suffix = $this->getSalarySuffix();
                $min = $this->salary_min ? '$' . number_format($this->salary_min / 1000, 0) . 'k' : null;
                $max = $this->salary_max ? '$' . number_format($this->salary_max / 1000, 0) . 'k' : null;

                if ($min && $max) return "{$min}–{$max}{$suffix}";
                if ($min) return "{$min}+{$suffix}";
                return "Up to {$max}{$suffix}";
            }
        );
    }

    /**
     * Full salary format (e.g., $40,000 - $60,000/yr).
     */
    protected function salaryRangeFullFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->salary_min && !$this->salary_max) return null;

                $suffix = $this->getSalarySuffix();
                $decimals = ($this->salary_min >= 10000 || $this->salary_max >= 10000) ? 0 : 2;
                $min = $this->salary_min ? '$' . number_format($this->salary_min, $decimals) : null;
                $max = $this->salary_max ? '$' . number_format($this->salary_max, $decimals) : null;

                if ($min && $max) return "{$min} - {$max}{$suffix}";
                if ($min) return "+ {$min}{$suffix}";
                return "Up to {$max}{$suffix}";
            }
        );
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

    // --- Helpers ---

    private function getSalarySuffix(): string
    {
        return match (strtolower($this->salary_frequency ?? '')) {
            'yearly'  => '/yr',
            'monthly' => '/mo',
            'weekly'  => '/wk',
            'hourly'  => '/hr',
            default   => '',
        };
    }

    /**
     * Get the translated workplace type label.
     */
    protected function workplaceLabel(): Attribute
    {
        return Attribute::make(
            get: fn () => match ($this->workplace_type) {
                1 => __('Remote'),
                2 => __('On-Site'),
                3 => __('Hybrid'),
                default => __('On-Site'),
            }
        );
    }
}
