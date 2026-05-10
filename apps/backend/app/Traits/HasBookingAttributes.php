<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasBookingAttributes
{
    /**
     * Get the semantic state for the module type.
     * Maps to view-layer CSS classes (primary, success, etc.)
     */
    public function getTypeState(): string
    {
        $type = class_basename($this);

        return match (true) {
            str_contains($type, 'Property')  => 'primary',
            str_contains($type, 'Event')     => 'success',
            str_contains($type, 'Service')   => 'warning',
            str_contains($type, 'Job')       => 'info',
            str_contains($type, 'Auto')      => 'dark',
            str_contains($type, 'Classified') => 'secondary',
            default                          => 'light',
        };
    }

    /**
     * Get the semantic status state for the booking.
     */
    public function getStatusState(): string
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
