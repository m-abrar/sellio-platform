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
}
