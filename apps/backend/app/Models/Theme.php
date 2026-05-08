<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * App\Models\Theme
 *
 * A switchable storefront theme/template instance.
 * Defines the business vertical, visual configurations,
 * and operational settings for the storefront.
 */
class Theme extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $table = 'themes';

    protected $fillable = [
        'theme_key', // e.g., 'properties_classic', 'events_modern'
        'vertical',  // e.g., 'properties', 'events', 'autos', null (unified)
        'title',     // e.g., 'Properties Classic'
        'order',
        'is_active',
        'last_activated_at',
        'variables', // JSON: visual styling (colors, fonts, radii)
        'config',    // JSON: modular logic/features
    ];

    protected $casts = [
        'variables' => 'array',
        'config'    => 'array',
        'is_active' => 'boolean',
        'last_activated_at' => 'datetime',
        'last_activated_at' => 'datetime',
    ];

    // --- Scopes ---

    /**
     * Scope a query to only include the currently active theme.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by vertical group.
     */
    public function scopeForVertical($query, string $vertical)
    {
        return $query->where('vertical', $vertical);
    }

    // --- Helpers ---

    public function getVariable(string $key, mixed $default = null): mixed
    {
        return $this->variables[$key] ?? $default;
    }

    public function getConfig(string $key, mixed $default = null): mixed
    {
        return $this->config[$key] ?? $default;
    }
}

