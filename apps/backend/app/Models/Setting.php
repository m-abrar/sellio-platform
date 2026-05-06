<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Setting
 * * The global configuration engine.
 * Stores site-wide parameters such as SEO metadata, branding assets, 
 * payment gateway credentials, and system toggles.
 */
class Setting extends Model
{
    use LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['key', 'value'];
    
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('settings_all'));
        static::deleted(fn () => Cache::forget('settings_all'));
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

    /**
     * Retrieve a setting value by its key with production-grade caching.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = Cache::rememberForever('settings_all', function () {
            return self::pluck('value', 'key')->all();
        });

        return $settings[$key] ?? $default;
    }

    /**
     * Set or update a configuration value.
     */
    public static function set(string $key, mixed $value): Setting
    {
        $setting = self::updateOrCreate(['key' => $key], ['value' => $value]);
        
        Cache::forget('settings_all');

        return $setting;
    }

    /**
     * Helper to retrieve multiple settings at once.
     */
    public static function getAllGrouped(): array
    {
        return Cache::rememberForever('settings_all', function () {
            return self::pluck('value', 'key')->all();
        });
    }
}
