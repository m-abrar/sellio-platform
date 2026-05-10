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
     * @var \App\Services\Dashboard\User\DashboardBookingService
     */
    protected $bookingService;

    /**
     * BookingController constructor.
     *
     * @param \App\Services\Dashboard\User\DashboardBookingService $bookingService
     */
    public function __construct(\App\Services\Dashboard\User\DashboardBookingService $bookingService)
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
}
