<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\EventBooking;
use Illuminate\Http\Request;
use App\Http\Resources\EventBookingResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class EventBookingController extends Controller
{
    /**
     * Display a listing of the user's event ticket bookings.
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
