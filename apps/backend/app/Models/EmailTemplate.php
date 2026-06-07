<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\EmailTemplate
 *
 * @property int $id
 * @property string $key
 * @property string $title
 * @property string $subject
 * @property string $body
 * @property bool $is_active
 * @property string|null $description
 */
class EmailTemplate extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'email_templates';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'title',
        'subject',
        'body',
        'is_active',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
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

    // --- Scopes ---

    /**
     * Scope a query to find a template by its unique key.
     */
    public function scopeByKey(Builder $query, string $key): Builder
    {
        return $query->where('key', $key);
    }

    /**
     * Scope a query to only include active templates.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Fetch a template by key with persistent caching to eliminate N+1 overhead.
     */
    public static function fetchByKey(string $key): ?self
    {
        return Cache::rememberForever("email_template.{$key}", function () use ($key) {
            return self::where('key', $key)->first();
        });
    }

    /**
     * Invalidate the cache for a specific template.
     */
    public function forgetCache(): void
    {
        Cache::forget("email_template.{$this->key}");
    }

    /**
     * Sanitize body before saving to prevent XSS.
     */
    protected function body(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => strip_tags($value, '<a><b><i><u><strong><em><p><br><ul><li><ol><h1><h2><h3><h4><h5><h6><img><blockquote><style>')
        );
    }
}
