<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
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
    protected function value(): Attribute
    {
        return Attribute::make(
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

    /**
     * Scope a query to order results semantically (Top -> Middle -> Bottom) 
     * and by content key importance (Heading -> Subheading -> Paragraph).
     */
    public function scopeOrdered($query)
    {
        $topSections = ['header', 'hero'];
        $bottomSections = ['footer'];
        
        $sectionCase = "CASE 
            WHEN section IN ('" . implode("','", $topSections) . "') THEN 1
            WHEN section IN ('" . implode("','", $bottomSections) . "') THEN 3
            ELSE 2
        END";

        $keyPatterns = [
            10 => '%brand%', 20 => '%logo%', 30 => '%heading%', 
            31 => '%subheading%', 32 => '%sub_heading%', 
            40 => '%paragraph%', 50 => '%button%', 55 => '%link%',
        ];

        $keyCaseClauses = [];
        foreach ($keyPatterns as $orderValue => $pattern) {
            $keyCaseClauses[] = "WHEN `content_key` LIKE '{$pattern}' THEN {$orderValue}";
        }
        $keyCaseSql = "CASE " . implode(' ', $keyCaseClauses) . " ELSE 999 END";

        return $query->orderByRaw($sectionCase)
            ->orderByRaw("FIELD(section, 'header', 'hero', 'footer')")
            ->orderByRaw($keyCaseSql)
            ->orderBy('section')
            ->orderBy('content_key');
    }
}
