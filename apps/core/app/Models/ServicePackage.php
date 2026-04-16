<?php

namespace App\Models;

use App\Traits\HasImageAccess;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\ServicePackage
 * * Represents a tiered offering or specific package for a main Service.
 * Supports individual pricing, features (JSON), and media.
 */
class ServicePackage extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, LogsActivity, HasImageAccess;

    /**
     * Constants for media management.
     */
    public const PRIMARY_MEDIA = 'package_main_photo';

    protected $table = 'service_packages';

    protected $fillable = [
        'service_id', 'title', 'slug', 'description', 
        'price', 'billing_period', 'features', 
        'sort_order', 'is_active', 'is_popular'
    ];

    protected $casts = [
        'price'        => 'decimal:2',
        'features'     => 'array', // Crucial for handling JSON bullet points
        'is_active'    => 'boolean',
        'is_popular'   => 'boolean',
        'sort_order'   => 'integer',
    ];

    // --- Media Configuration ---

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::PRIMARY_MEDIA)->singleFile();
    }

    // --- Activity Log ---

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // --- Relationships ---

    /**
     * The parent service this package belongs to.
     */
    public function service(): BelongsTo 
    { 
        return $this->belongsTo(Service::class); 
    }

    // --- Accessors (Modern Attribute Syntax) ---

    /**
     * Formatted Price (e.g., $99.00)
     */
    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->price) return null;

                $symbol = setting('currency_symbol', '$');
                $position = setting('currency_position', 'left');
                $value = number_format($this->price, 2);

                return $position === 'left' ? "{$symbol}{$value}" : "{$value}{$symbol}";
            }
        )->shouldCache();
    }

    protected function priceDisplay(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->price || $this->price <= 0) {
                    return setting('price_placeholder', 'Contact for price');
                }

                $formatted = $this->price_formatted;
                $period = $this->billing_period;

                // Handle 'one-time' or empty periods gracefully
                if (empty($period) || $period === 'one-time') {
                    return $formatted;
                }

                return "{$formatted} / {$period}";
            }
        )->shouldCache();
    }

    // --- Scopes ---

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc');
    }
}
