<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
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
        if (! Schema::hasTable('settings')) {
            return $default;
        }

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
     * Sanitize values to prevent XSS, allowing raw scripts only for specific keys.
     */
    protected function value(): Attribute
    {
        return Attribute::make(
            set: function ($value, $attributes) {
                $key = $attributes['key'] ?? '';
                
                // Whitelist of keys allowed to contain raw scripts/HTML
                $allowedRawKeys = [
                    'google_analytics',
                    'custom_head_code',
                    'custom_footer_code',
                    'google_map_api_key'
                ];

                if (in_array($key, $allowedRawKeys)) {
                    return $value;
                }

                // Strictly strip all tags for everything else
                return strip_tags($value);
            }
        );
    }
}
