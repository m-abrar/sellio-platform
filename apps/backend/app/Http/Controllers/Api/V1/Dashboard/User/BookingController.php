<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\EventBooking;
use App\Models\PropertyBooking;
use App\Models\PropertyVisit;
use App\Models\ServiceAppointment;
use App\Services\Dashboard\User\DashboardBookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * @var \App\Services\Dashboard\User\DashboardBookingService
     */
    protected $bookingService;

    /**
     * BookingController constructor.
     *
     * @param \App\Services\Dashboard\User\DashboardBookingService $bookingService
     */
    public function __construct(DashboardBookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a listing of all user bookings, sorted by date.
     */
    public function index()
    {
        $data = $this->bookingService->getUserBookings(Auth::user());

        return $this->successResponse($data);
    }

    /**
     * Cancel a specific booking by ID (supporting multiple polymorphic booking models).
     */
    public function cancel(Request $request, $id)
    {
        $user = Auth::user();
        $type = $request->input('type'); // optional type parameter: 'property_booking', 'property_visit', 'event_booking', 'service_appointment'
        
        $cancelled = false;
        
        if ($type === 'property_visit' || !$type) {
            $visit = PropertyVisit::where('user_id', $user->id)->where('id', $id)->first();
            if ($visit) {
                $visit->update(['status' => 'cancelled']);
                $cancelled = true;
            }
        }
        
        if (!$cancelled && ($type === 'property_booking' || !$type)) {
            $booking = PropertyBooking::where('user_id', $user->id)->where('id', $id)->first();
            if ($booking) {
                $booking->update(['status' => 'cancelled']);
                $cancelled = true;
            }
        }
        
        if (!$cancelled && ($type === 'event_booking' || !$type)) {
            $booking = EventBooking::where('user_id', $user->id)->where('id', $id)->first();
            if ($booking) {
                $booking->update(['status' => 'cancelled']);
                $cancelled = true;
            }
        }
        
        if (!$cancelled && ($type === 'service_appointment' || !$type)) {
            $appointment = ServiceAppointment::where('user_id', $user->id)->where('id', $id)->first();
            if ($appointment) {
                $appointment->update(['status' => 'cancelled']);
                $cancelled = true;
            }
        }
        
        if ($cancelled) {
            return $this->successResponse(null, __('Booking successfully cancelled.'));
        }
        
        return $this->errorResponse(__('Booking not found or unauthorized.'), 404);
    }
}
