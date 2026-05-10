<?php

namespace App\Services\Dashboard\User;

use App\Models\User;
use App\Models\EventBooking;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\ServiceAppointment;
use Illuminate\Support\Collection;
use App\Http\Resources\PropertyBookingResource;
use App\Http\Resources\PropertyVisitResource;
use App\Http\Resources\EventBookingResource;
use App\Http\Resources\ServiceAppointmentResource;

class DashboardBookingService
{
    /**
     * Get a unified list of bookings for the user.
     */
    public function getUserBookings(User $user, int $limit = 50): array
    {
        $userId = $user->id;

        // Fetch types with reasonable limits to prevent memory exhaustion
        $propertyBookings = PropertyBooking::where('user_id', $userId)
            ->with(['property'])
            ->latest()
            ->limit($limit)
            ->get();

        $propertyVisits = PropertyVisit::where('user_id', $userId)
            ->with(['property'])
            ->latest()
            ->limit($limit)
            ->get();
            
        $eventBookings = EventBooking::where('user_id', $userId)
            ->with(['event', 'occurrence', 'ticketType'])
            ->latest()
            ->limit($limit)
            ->get();

        $serviceAppointments = ServiceAppointment::where('user_id', $userId)
            ->with(['service'])
            ->latest()
            ->limit($limit)
            ->get();
            
        // Merge into a single collection
        $allBookings = collect()
            ->concat($propertyBookings)
            ->concat($propertyVisits)
            ->concat($eventBookings)
            ->concat($serviceAppointments);
            
        // Sort and categorize
        $sortedBookings = $allBookings->sortByDesc(fn($b) => $this->getBookingDate($b));

        $upcoming = $sortedBookings->filter(fn($b) => $this->getBookingDate($b)->isFuture())->values();
        $past     = $sortedBookings->filter(fn($b) => $this->getBookingDate($b)->isPast())->values();

        return [
            'upcomingBookings' => $this->mapToResources($upcoming),
            'pastBookings'     => $this->mapToResources($past),
        ];
    }

    protected function mapToResources(Collection $bookings): Collection
    {
        return $bookings->map(function ($booking) {
            return match (true) {
                $booking instanceof PropertyBooking    => new PropertyBookingResource($booking),
                $booking instanceof PropertyVisit      => new PropertyVisitResource($booking),
                $booking instanceof EventBooking       => new EventBookingResource($booking),
                $booking instanceof ServiceAppointment => new ServiceAppointmentResource($booking),
                default                                => $booking,
            };
        });
    }

    protected function getBookingDate($booking)
    {
        if ($booking instanceof PropertyBooking) return $booking->check_in_date;
        if ($booking instanceof PropertyVisit) return $booking->scheduled_at;
        if ($booking instanceof EventBooking && $booking->occurrence) return $booking->occurrence->start_date_time;
        if ($booking instanceof ServiceAppointment) return $booking->scheduled_at ?? $booking->created_at;

        return now()->addYears(100);
    }
}
