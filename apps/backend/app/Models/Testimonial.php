<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use App\Traits\Models\HasStatusModeration;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Testimonial extends Model implements HasMedia
{
    use HasFactory, HasImageAccess, HasStatusModeration, InteractsWithMedia, LogsActivity, SoftDeletes;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ARCHIVED = 'archived';

    public const AVATAR_MEDIA = 'avatar';

    protected $fillable = [
        'author_name',
        'author_title',
        'company',
        'quote',
        'rating',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'rating' => 'integer',
        'sort_order' => 'integer',
    ];

    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(Theme::class)
            ->withPivot(['priority', 'is_featured'])
            ->withTimestamps();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    public function scopeGlobal(Builder $query): Builder
    {
        return $query->doesntHave('themes');
    }

    public function getAvatarUrlAttribute(): string
    {
        $mediaUrl = $this->getFirstMediaUrl(self::AVATAR_MEDIA);

        if ($mediaUrl) {
            return $mediaUrl;
        }

        $color = config('ui.avatar_color', '6366f1');

        return 'https://ui-avatars.com/api/?name=' . urlencode($this->author_name ?: 'Testimonial') . "&background={$color}&color=fff&size=160&font-size=0.35";
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::AVATAR_MEDIA)->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->registerCommonMediaConversions($media);

        $this->addMediaConversion('avatar_thumb')
            ->width(160)
            ->height(160);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
