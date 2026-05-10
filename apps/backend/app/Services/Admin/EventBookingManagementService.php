<?php

namespace App\Services\Admin;

use App\Models\EventBooking;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

/**
 * Class EventBookingManagementService
 * Orchestrates the administrative lifecycle for event ticketing, 
 * managing reservations, financial statuses, and relationship mapping between users and occurrences.
 */
class EventBookingManagementService
{
    /**
     * Get paginated event bookings with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getBookings(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return EventBooking::with(['event.category', 'event.location', 'user', 'payments'])
            ->when($filters['event'] ?? null, fn($q, $evId) => $q->where('event_id', $evId))
            ->when($filters['event_name'] ?? null, fn($q, $name) => $q->whereHas('event', fn($ev) => $ev->where('title', 'LIKE', "%{$name}%")))
            ->when($filters['category'] ?? null, function($q, $catId) {
                $q->whereHas('event', fn($ev) => $ev->where('category_id', $catId));
            })
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn($q) => $q->where('status', $filters['status']))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Store a newly created event booking record with an automated unique reference.
     *
     * @param array $data
     * @return EventBooking
     */
    public function createBooking(array $data): EventBooking
    {
        if (!isset($data['booking_reference'])) {
            $data['booking_reference'] = 'EVT-' . strtoupper(Str::random(8));
        }

        return EventBooking::create($data);
    }

    /**
     * Update an existing event booking and synchronize its parameters.
     *
     * @param EventBooking $booking
     * @param array $data
     * @return bool
     */
    public function updateBooking(EventBooking $booking, array $data): bool
    {
        return $booking->update($data);
    }

    /**
     * Securely remove an event booking record from the database.
     *
     * @param EventBooking $booking
     * @return bool|null
     */
    public function deleteBooking(EventBooking $booking): ?bool
    {
        return $booking->delete();
    }
}
