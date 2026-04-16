<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\PropertyBooking;
use Illuminate\Http\Request;
use App\Http\Resources\PropertyBookingResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class PropertyBookingController extends Controller
{
    /**
     * Display a listing of the user's property bookings.
     */
    public function index() {
        $user = Auth::user();

        // Fetch bookings MADE by this user
        $bookings = PropertyBooking::where('user_id', $user->id)
            ->with(['property'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(PropertyBookingResource::collection($bookings));
    }
}
