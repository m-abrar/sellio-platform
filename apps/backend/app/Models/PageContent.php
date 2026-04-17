<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class PageContent extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use HasImageAccess;

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
