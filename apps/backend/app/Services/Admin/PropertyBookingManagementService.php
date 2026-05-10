<?php

namespace App\Services\Admin;

use App\Models\PropertyBooking;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Class PropertyBookingManagementService
 * Orchestrates administrative reservations for the real estate vertical, managing 
 * listing availability, calendar visualization, and financial status reconciliation.
 */
class PropertyBookingManagementService
{
    /**
     * Get paginated property bookings with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getBookings(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return PropertyBooking::with(['property', 'user'])
            ->when($filters['property'] ?? null, fn($q, $prop) => $q->where('property_id', $prop))
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn($q) => $q->where('status', $filters['status']))
            ->when($filters['start_date'] ?? null, fn($q, $start) => $q->where('check_in_date', '>=', $start))
            ->when($filters['end_date'] ?? null, fn($q, $end) => $q->where('check_out_date', '<=', $end))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Hydrate a comprehensive availability map for a specific property's calendar.
     *
     * @param int $propertyId
     * @param int|null $excludeBookingId
     * @return Collection
     */
    public function getCalendarEvents(int $propertyId, ?int $excludeBookingId = null): Collection
    {
        $statusColors = [
            'confirmed' => '#bbf7d0',
            'pending'   => '#fde68a',
            'cancelled' => '#fecaca',
        ];

        return PropertyBooking::where('property_id', $propertyId)
            ->when($excludeBookingId, fn($q) => $q->where('id', '!=', $excludeBookingId))
            ->get()
            ->map(function ($b) use ($statusColors) {
                return [
                    'start' => Carbon::parse($b->check_in_date)->toDateString(),
                    'end'   => Carbon::parse($b->check_out_date)->toDateString(),
                    'color' => $statusColors[$b->status] ?? '#e5e7eb',
                    'title' => $b->full_name ?? __('Booked'),
                ];
            });
    }

    /**
     * Store a newly created property booking record.
     *
     * @param array $data
     * @return PropertyBooking
     */
    public function createBooking(array $data): PropertyBooking
    {
        return PropertyBooking::create($data);
    }

    /**
     * Update an existing property booking and synchronize its reservation parameters.
     *
     * @param PropertyBooking $booking
     * @param array $data
     * @return bool
     */
    public function updateBooking(PropertyBooking $booking, array $data): bool
    {
        return $booking->update($data);
    }

    /**
     * Securely remove a property booking record from the administrative ledger.
     *
     * @param PropertyBooking $booking
     * @return bool|null
     */
    public function deleteBooking(PropertyBooking $booking): ?bool
    {
        return $booking->delete();
    }
}
