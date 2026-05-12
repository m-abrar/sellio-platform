<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasBookingAttributes
{
    /**
     * Get the semantic context level for the module type.
     * Maps to internal vertical types for UI categorization.
     */
    public function getTypeContext(): string
    {
        $type = class_basename($this);

        return match (true) {
            str_contains($type, 'Property')  => 'real-estate',
            str_contains($type, 'Event')     => 'event',
            str_contains($type, 'Service')   => 'service',
            str_contains($type, 'Job')       => 'recruitment',
            str_contains($type, 'Auto')      => 'automotive',
            str_contains($type, 'Classified') => 'classified',
            default                          => 'general',
        };
    }

    /**
     * Get the semantic severity level for the booking status.
     */
    public function getStatusLevel(): string
    {
        return match ($this->status) {
            'confirmed', 'accepted', 'paid', 'completed' => 'success',
            'pending', 'requested', 'processing'         => 'warning',
            'cancelled', 'rejected', 'failed', 'denied'  => 'danger',
            default                                      => 'info',
        };
    }

    /**
     * Get a clean, human-readable name for the booking type.
     */
    public function getFriendlyType(): string
    {
        return Str::headline(str_replace(['Booking', 'Inquiry', 'Application', 'Quote', 'Appointment'], '', class_basename($this)));
    }

    /**
     * Get the CSS badge class based on the module context.
     */
    public function getTypeBadgeClass(): string
    {
        return match ($this->getTypeContext()) {
            'real-estate' => 'badge-info-light text-info',
            'event'       => 'badge-success-light text-success',
            'service'     => 'badge-teal-light text-teal',
            'recruitment' => 'badge-purple-light text-purple',
            'automotive'  => 'badge-primary-light text-primary',
            'classified'  => 'badge-secondary-light text-secondary',
            default       => 'badge-dark-light text-dark',
        };
    }

    /**
     * Virtual attribute to get the title of the related item.
     */
    public function getItemTitleAttribute(): string
    {
        $relation = $this->relation_name ?? null;
        if (!$relation) return 'N/A';
        
        return $this->{$relation}->title ?? $this->{$relation}->name ?? 'Untitled Item';
    }

    /**
     * Virtual attribute to get the thumbnail of the related item.
     */
    public function getItemThumbnailAttribute(): string
    {
        $relation = $this->relation_name ?? null;
        if (!$relation || !$this->{$relation}) {
            return asset('images/fallbacks/default.jpg');
        }

        return method_exists($this->{$relation}, 'getFirstMediaUrl') 
            ? $this->{$relation}->getFirstMediaUrl('featured_image', 'thumb') 
            : asset('images/fallbacks/default.jpg');
    }
}


