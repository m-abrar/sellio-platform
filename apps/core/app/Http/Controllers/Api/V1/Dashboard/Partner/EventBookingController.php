<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Services\Partner\EventBookingService;
use App\Http\Resources\EventBookingResource;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

/**
 * Class EventBookingController
 * * Manages event booking interactions for the partner dashboard.
 * * @package App\Http\Controllers\Dashboard\Partner
 */
class EventBookingController extends Controller
{
    /**
     * @var EventBookingService
     */
    protected $bookingService;

    /**
     * EventBookingController constructor.
     * * @param EventBookingService $bookingService
     */
    public function __construct(EventBookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a listing of all bookings for the partner's events.
     * * @return View
     */
    public function index() {
        $eventBookings = $this->bookingService->getPartnerBookings(Auth::user());

        return $this->successResponse(EventBookingResource::collection($eventBookings));
    }

    /**
     * Display the specified event booking details.
     * * @param int $id
     * @return View
     */
    public function show(int $id) {
        // Fetch booking with relations to avoid N+1 issues in the view
        $booking = $this->bookingService->getBookingDetails($id);

        // Security Check: Ensure the partner owns the event this booking belongs to
        if ($booking->event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to booking details.');
        }

        return $this->successResponse(new EventBookingResource($booking));
    }
}
