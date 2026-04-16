<?php

namespace App\Services\Partner;

use App\Models\EventBooking;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class EventBookingService
 * Handles business logic for event booking operations.
 */
class EventBookingService
{
    /**
     * Retrieve paginated bookings for events owned by the partner.
     */
    public function getPartnerBookings(User $user, int $perPage = 10): LengthAwarePaginator
    {
        $eventIds = $user->events()->pluck('id');

        return EventBooking::whereIn('event_id', $eventIds)
            ->with([
                'event',
                'occurrence',
                'tickettype',
                'user' // Added user to list view for consistent UI
            ])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Retrieve a specific booking with full detail relationships.
     * * @param int $id
     * @return EventBooking
     */
    public function getBookingDetails(int $id): EventBooking
    {
        return EventBooking::with([
            'user', 
            'event', 
            'occurrence', 
            'tickettype'
        ])->findOrFail($id);
    }
}
