<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\EventBooking;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\ServiceAppointment;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of all user bookings, sorted by date.
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        // 1. Fetch all different booking types
        $propertyBookings = PropertyBooking::where('user_id', $userId)
            ->with(['property'])
            ->get();

        $propertyVisits = PropertyVisit::where('user_id', $userId)
            ->with(['property'])
            ->get();
            
        $eventBookings = EventBooking::where('user_id', $userId)
            ->with(['event', 'occurrence', 'ticketType'])
            ->get();

        $serviceAppointments = ServiceAppointment::where('user_id', $userId)
            ->with(['service'])
            ->get();
            
        // 2. Merge into a single collection
        $allBookings = collect()
            ->concat($propertyBookings)
            ->concat($propertyVisits)
            ->concat($eventBookings)
            ->concat($serviceAppointments);
            
        // 3. Sort and categorize
        $sortedBookings = $allBookings->sortByDesc(function ($booking) {
            return $this->getBookingDate($booking);
        });

        $upcomingBookings = $sortedBookings->filter(function ($booking) {
            return $this->getBookingDate($booking)->isFuture();
        })->values();

        $pastBookings = $sortedBookings->filter(function ($booking) {
            return $this->getBookingDate($booking)->isPast();
        })->values();

        $mapBookings = function ($bookings) {
            return $bookings->map(function ($booking) {
                if ($booking instanceof \App\Models\PropertyBooking) {
                    return new \App\Http\Resources\PropertyBookingResource($booking);
                }
                if ($booking instanceof \App\Models\PropertyVisit) {
                    return new \App\Http\Resources\PropertyVisitResource($booking);
                }
                if ($booking instanceof \App\Models\EventBooking) {
                    return new \App\Http\Resources\EventBookingResource($booking);
                }
                if ($booking instanceof \App\Models\ServiceAppointment) {
                    return new \App\Http\Resources\ServiceAppointmentResource($booking);
                }
                return $booking;
            });
        };

        $upcomingBookings = $mapBookings($upcomingBookings);
        $pastBookings = $mapBookings($pastBookings);

        return $this->successResponse(compact('upcomingBookings', 'pastBookings'));
    }

    /**
     * Helper to normalize the date across different booking models.
     */
    protected function getBookingDate($booking)
    {
        if ($booking instanceof PropertyBooking) {
            return $booking->check_in_date;
        } 
        
        if ($booking instanceof PropertyVisit) {
            return $booking->scheduled_at;
        } 
        
        if ($booking instanceof EventBooking && $booking->occurrence) {
            return $booking->occurrence->start_date_time;
        } 
        
        if ($booking instanceof ServiceAppointment) {
            return $booking->scheduled_at ?? $booking->created_at; 
        }

        return now()->addYears(100);
    }
}
