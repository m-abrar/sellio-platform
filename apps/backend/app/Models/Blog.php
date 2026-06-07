<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use App\Traits\HasAnalytics;
use App\Traits\HasImageAccess;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Traits\Models\HasStatusModeration;

/**
 * App\Models\Blog
 * Handles article content, author relationships, and Spatie-driven media.
 */
class Blog extends Model implements HasMedia
{
    use LogsActivity, HasAnalytics, HasFactory, InteractsWithMedia, HasImageAccess, HasStatusModeration, SoftDeletes;

    /**
     * Constants for Spatie media collections.
     */
    public const PRIMARY_MEDIA = 'featured_image';
    public const GALLERY_MEDIA = 'post_gallery';

    /**
     * Guarded attributes.
     */
    protected $fillable = [
        'user_id', 'category_id', 'title', 'slug', 'subtitle', 'content',
        'reading_time', 'video', 
        'allow_comments',
        'meta_title', 'meta_description'
    ];

    /**
     * Attribute casting.
     */
    protected $casts = [
        'is_published'  => 'boolean',
        'is_featured'   => 'boolean',
        'allow_comments' => 'boolean',
        'published_at'  => 'datetime',
        'view_count'    => 'integer',
    ];

    // --- Media Management ---

    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants(); 
    }
    
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);
        
        // Specific conversion for blog post headers
        $this->addMediaConversion('post_header')
             ->width(1200)->height(630)
             ->quality(90)->format('webp')->nonQueued();
    }

    // --- Relationships ---

    /** The author of the blog */
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    
    /** The primary category */
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }

    /** Polymorphic relationships matching your Property structure */
    public function reviews(): MorphMany { return $this->morphMany(Review::class, 'reviewable'); }
    public function reviewsNew(): MorphMany { return $this->morphMany(Review::class, 'reviewable')->whereNull('viewed_at'); }
    public function favorites(): MorphMany { return $this->morphMany(Favorite::class, 'favoritable'); }
    public function tags(): MorphToMany { return $this->morphToMany(Tag::class, 'taggable'); }

    // --- Scopes ---

    /** Only show blogs that are published and not scheduled for the future */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_published', true)
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    // --- Accessors ---

    /** Returns estimated reading time or calculates it on the fly */
    protected function readingTimeEstimate(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if ($attributes['reading_time']) return $attributes['reading_time'] . ' min read';
                
                $words = str_word_count(strip_tags($attributes['content']));
                $minutes = ceil($words / 200); // Average 200 words per minute
                return $minutes . ' min read';
            }
        )->shouldCache();
    }

    /** Returns a snippet of the content for index pages */
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                return !empty($attributes['content']) 
                    ? str($attributes['content'])->stripTags()->words(25, '...') 
                    : null;
            }
        );
    }

    /** Check if post was published in the last 7 days */
    protected function isNew(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->published_at ? $this->published_at->gt(Carbon::now()->subDays(7)) : false
        )->shouldCache();
    }

    // --- Activity Log Configuration ---
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty() 
            ->dontSubmitEmptyLogs();
    }

    /**
     * Logic for status badge (PUBLISHED/DRAFT/SCHEDULED)
     */
    protected function statusLabel(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->is_published) return 'DRAFT';
                if ($this->published_at && $this->published_at->isFuture()) return 'SCHEDULED';
                return 'PUBLISHED';
            }
        );
    }

    /**
     * Logic for badge colors
     */
    protected function statusColor(): Attribute
    {
        return Attribute::make(
            get: fn () => match($this->status_label) {
                'PUBLISHED' => 'bg-success text-white',
                'SCHEDULED' => 'bg-info text-white',
                'DRAFT'     => 'bg-secondary text-white',
            }
        );
    }

    /**
     * Sanitize content before saving to prevent XSS.
     */
    protected function content(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => sanitize_rich_html($value)
        );
    }
}

