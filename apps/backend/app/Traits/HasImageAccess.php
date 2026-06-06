<?php

namespace App\Traits;

use Illuminate\Support\Collection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\Image\Enums\Fit;

trait HasImageAccess
{
    protected function registerMediaCollectionFromConstants(): void
    {
        if (!defined('static::PRIMARY_MEDIA')) {
            $this->addMediaCollection('images')
                 ->registerMediaConversions(function () {
                     $this->registerCommonMediaConversions();
                 });
        }
        
        if (defined('static::PRIMARY_MEDIA')) {
            $this->addMediaCollection(static::PRIMARY_MEDIA)
                 ->singleFile()
                 ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
                 ->registerMediaConversions(function () {
                     $this->registerCommonMediaConversions();
                 });
        }

        if (defined('static::GALLERY_MEDIA')) {
            $this->addMediaCollection(static::GALLERY_MEDIA)
                 ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
        }
    }

    protected function registerCommonMediaConversions(Media $media = null): void
    {
        // Skip resource-heavy conversions if the global flag is set (e.g., during seeding on shared hosting)
        if (config('app.skip_media_conversions')) {
            return;
        }

        $this->addMediaConversion('avatar')
             ->fit(Fit::Crop, 150, 150)
             ->sharpen(10)->format('webp')->nonQueued();
             
        $this->addMediaConversion('thumb')
             ->fit(Fit::Crop, 300, 300)
             ->sharpen(10)->format('webp')->nonQueued();

        $this->addMediaConversion('card')
             ->fit(Fit::Crop, 600, 450) 
             ->quality(90)->sharpen(10)->format('webp')->nonQueued();
             
        $this->addMediaConversion('detail')
             ->width(1200) 
             ->quality(90)->sharpen(10)->format('webp')->nonQueued();

        $this->addMediaConversion('hero')
             ->fit(Fit::Crop, 1920, 480) 
             ->quality(90)->sharpen(10)->format('webp')->nonQueued();
    }
    
    protected function detectCollection(?string $preferred = null): string
    {
        if ($preferred && $this->hasMedia($preferred)) {
            return $preferred;
        } elseif (defined('static::PRIMARY_MEDIA') && $this->hasMedia(static::PRIMARY_MEDIA)) {
            return static::PRIMARY_MEDIA;
        }
        
        $common = ['featured_image', 'avatar', 'cover', 'image', 'gallery']; 
        foreach ($common as $name) {
            if ($this->hasMedia($name)) {
                return $name;
            }
        }
        
        return $preferred ?? 'images';
    }

    public function getImageUrl(?string $collection = null, string $conversion = ''): string
    {
        $collection = $this->detectCollection($collection);
        $media = $this->getFirstMedia($collection);

        if ($media) {
            return $this->resolveMediaUrl($media, $conversion);
        }

        return $this->getFallbackImage($conversion ?: 'default');
    }

    public function resolveMediaUrl(Media $media, string $conversion = ''): string
    {
        if ($conversion !== ''
            && method_exists($media, 'hasGeneratedConversion')
            && $media->hasGeneratedConversion($conversion)) {
            return $media->getUrl($conversion);
        }

        return $media->getUrl();
    }

    public function gallery(?string $collection = null): Collection
    {
        $collectionName = defined('static::GALLERY_MEDIA') 
                             ? static::GALLERY_MEDIA 
                             : ($collection ?? 'gallery');

        return $this->getMedia($collectionName);
    }
    
    public function getPrimaryImageUrlAttribute(): string
    {
        $collection = defined('static::PRIMARY_MEDIA') ? static::PRIMARY_MEDIA : null;
        return $this->getImageUrl(collection: $collection, conversion: 'card'); 
    }

    public function getThumbnailUrlAttribute(): string
    {
        return $this->getImageUrl(conversion: 'thumb');
    }

    public function getFallbackImage(string $type = 'default'): string
    {
        $basePath = 'images/fallbacks/';

        $fallbacks = [
            'avatar' => asset($basePath . 'default-avatar.png'),
            'thumb'  => asset($basePath . 'default-square.jpg'),
            'card'   => asset($basePath . 'default-card.jpg'),
            'detail' => asset($basePath . 'default-detail.jpg'),
            'hero'   => asset($basePath . 'default-hero.jpg'),
            'default'=> asset($basePath . 'default.jpg'),
        ];
        
        return $fallbacks[$type] ?? $fallbacks['default'];
    }

    public function isFallbackUrl(string $url): bool
    {
        return str_contains($url, 'images/fallbacks/');
    }

    public function getArrayableAppends()
    {
        $appends = parent::getArrayableAppends();

        $traitAppends = [
            'primary_image_url', 
            'thumbnail_url', 
            // 'avatar_url'
        ];

        return array_unique(array_merge($appends, $traitAppends));
    }
}
