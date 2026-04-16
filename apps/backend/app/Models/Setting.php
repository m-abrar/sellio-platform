<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * App\Models\Setting
 * * The global configuration engine.
 * Stores site-wide parameters such as SEO metadata, branding assets, 
 * payment gateway credentials, and system toggles.
 */
class Setting extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['key', 'value'];

    /**
     * Retrieve a setting value by its key.
     * * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        // Marketplace Tip: In production, consider wrapping this in 
        // Cache::remember to reduce database load on every page hit.
        return self::where('key', $key)->value('value') ?? $default;
    }

    /**
     * Set or update a configuration value.
     *
     * @param string $key
     * @param mixed $value
     * @return \App\Models\Setting
     */
    public static function set(string $key, mixed $value): Setting
    {
        $setting = self::updateOrCreate(['key' => $key], ['value' => $value]);
        
        // Clear specific cache if you implement a caching layer
        // Cache::forget("setting_{$key}");

        return $setting;
    }

    /**
     * Helper to retrieve multiple settings at once.
     * Useful for initializing the front-end configuration in a single query.
     */
    public static function getAllGrouped(): array
    {
        return self::pluck('value', 'key')->toArray();
    }
}
