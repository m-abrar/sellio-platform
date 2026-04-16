<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Page extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

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
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to filter pages by their type (e.g., 'system', 'landing').
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }
}
