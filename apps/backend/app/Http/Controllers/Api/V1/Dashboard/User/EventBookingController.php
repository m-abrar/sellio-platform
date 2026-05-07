<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\EventBooking;
use Illuminate\Http\Request;
use App\Http\Resources\EventBookingResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class EventBookingController
 * Orchestrates the user-facing discovery and retrieval of event ticket bookings,
 * managing attendance history and ticket relationship metadata.
 */
class EventBookingController extends Controller
{
    /**
     * Retrieve a paginated collection of event bookings for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index() {
        $user = Auth::user();

        // Fetch bookings MADE by this user
        $bookings = EventBooking::where('user_id', $user->id)
            ->with([
                'event', 
                'occurrence', 
                'ticketType' // Corrected to camelCase to match standard relationship naming
            ]) 
            ->latest() 
            ->paginate(10); 

        return $this->successResponse(EventBookingResource::collection($bookings));
    }
}
