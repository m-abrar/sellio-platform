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
 * App\Models\PageContent
 *
 * @property int $id
 * @property string $theme_key
 * @property string $page
 * @property string $section
 * @property string $content_key
 * @property string $input_type (text, textarea, editor, image, toggle)
 * @property string|null $value
 */
class PageContent extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, HasImageAccess, LogsActivity;

    /**
     * Constants to define media collections used by the HasImageAccess trait.
     */
    public const PRIMARY_MEDIA = 'content_image';
    public const GALLERY_MEDIA = 'content_gallery';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'page_contents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'theme_key',
        'page',
        'section',
        'content_key',
        'input_type',
        'value',
    ];

    /**
     * Sanitize content before saving to prevent XSS.
     */
    protected function value(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            set: fn ($value) => is_string($value) 
                ? strip_tags($value, '<div><section><main><article><aside><header><footer><nav><p><br><hr><a><b><i><u><strong><em><span><ul><li><ol><h1><h2><h3><h4><h5><h6><img><blockquote><video><audio><source><track><canvas><svg><path><circle><rect><line><polyline><polygon><ellipse>')
                : $value
        );
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
     * Register media collections using the trait helper.
     */
    public function registerMediaCollections(): void
    {
        $this->registerMediaCollectionFromConstants();
    }


    // --- Scopes ---

    /**
     * Scope a query to filter content by theme and page.
     */
    public function scopeForPage(Builder $query, string $page, ?string $themeKey = null): Builder
    {
        $query->where('page', $page);
        
        if ($themeKey) {
            $query->where('theme_key', $themeKey);
        }

        return $query;
    }

    /**
     * Scope a query to filter by section.
     */
    public function scopeForSection(Builder $query, string $section): Builder
    {
        return $query->where('section', $section);
    }
}
