<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasBookingAttributes
{
    /**
     * Get the CSS class for the module type badge.
     */
    public function getTypeBadgeClass(): string
    {
        $type = class_basename($this);

        return match (true) {
            str_contains($type, 'Property')  => 'badge-primary',
            str_contains($type, 'Event')     => 'badge-success',
            str_contains($type, 'Service')   => 'badge-warning',
            str_contains($type, 'Job')       => 'badge-info',
            str_contains($type, 'Auto')      => 'badge-dark',
            str_contains($type, 'Classified') => 'badge-secondary',
            default                          => 'badge-light',
        };
    }

    /**
     * Get the CSS class for the status badge.
     */
    public function getStatusBadgeClass(): string
    {
        return match ($this->status) {
            'confirmed', 'accepted', 'paid', 'completed' => 'badge-success',
            'pending', 'requested', 'processing'         => 'badge-warning',
            'cancelled', 'rejected', 'failed', 'denied'  => 'badge-danger',
            default                                      => 'badge-info',
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
