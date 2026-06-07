<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Page
 *
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $type
 * @property string|null $meta_description
 * @property string|null $meta_keywords
 * @property string|null $css
 * @property string|null $html
 * @property string $status (active, inactive, draft)
 * @property int|null $header_id
 * @property int|null $footer_id
 */
class Page extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivity;

    // --- Status Constants ---
    public const STATUS_ACTIVE   = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_DRAFT    = 'draft';

    public const PRIMARY_MEDIA = 'featured_image';
    public const GALLERY_MEDIA = 'album';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'type',
        'meta_description',
        'meta_keywords',
        'css',
        'html',
        'status',
        'header_id',
        'footer_id',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Model $model) {
            if (empty($model->slug) && !empty($model->title)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }

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

    // --- Media Management ---

    /**
     * Register media collections for SEO and page-builder assets.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')->singleFile();
        $this->addMediaCollection('gallery');
        $this->addMediaCollection('pagebuilder');
    }

    // --- Relationships ---

    /**
     * Get the specific header template associated with this page.
     */
    public function header(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'header_id');
    }

    /**
     * Get the specific footer template associated with this page.
     */
    public function footer(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'footer_id');
    }

    // --- Scopes ---

    /**
     * Scope a query to only include active pages.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope a query to filter pages by their type (e.g., 'system', 'landing').
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    // --- UI Helpers ---
    
    /**
     * Sanitize page-builder HTML/CSS before saving to prevent stored XSS.
     */
    protected function html(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => sanitize_rich_html(
                is_string($value) ? $value : '',
                page_content_editor_allowed_tags()
            )
        );
    }

    protected function css(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => is_string($value) ? sanitize_page_builder_css($value) : $value
        );
    }

    /**
     * Get a human-readable status label with CSS classes.
     */
    public function getStatusMeta(): array
    {
        return match ($this->status) {
            self::STATUS_ACTIVE   => ['label' => 'Active', 'color' => 'success', 'icon' => 'check-circle'],
            self::STATUS_INACTIVE => ['label' => 'Inactive', 'color' => 'secondary', 'icon' => 'times-circle'],
            self::STATUS_DRAFT    => ['label' => 'Draft', 'color' => 'warning', 'icon' => 'edit'],
            default              => ['label' => 'Unknown', 'color' => 'dark', 'icon' => 'question-circle'],
        };
    }
}

