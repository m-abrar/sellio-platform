<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Application
 * * The core engine of a Sellio application instance.
 * Defines the business vertical, visual configurations, 
 * and operational settings.
 *
 * @property int $id
 * @property string $app_key
 * @property string $vertical
 * @property string $title
 * @property bool $is_active
 * @property array|null $variables
 * @property array|null $config
 */
class Application extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivity;

    /**
     * The relationships that should always be eager loaded.
     */
    protected $with = ['media'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vertical',  // e.g., 'real_estate', 'automotive'
        'title',     // e.g., "Modern Midnight"
        'is_active', 
        'variables', // Stores JSON data for visual styling
        'config'     // Stores JSON data for modular logic/features
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'variables' => 'array',
        'config'    => 'array',
        'is_active' => 'boolean',
    ];


    // --- Scopes ---

    /**
     * Scope a query to only include the currently active application.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // --- Helpers ---

    /**
     * Helper to get a specific variable with a fallback.
     */
    public function getVariable(string $key, mixed $default = null): mixed
    {
        return $this->variables[$key] ?? $default;
    }

    /**
     * Helper to get a specific config value with a fallback.
     */
    public function getConfig(string $key, mixed $default = null): mixed
    {
        return $this->config[$key] ?? $default;
    }
}
