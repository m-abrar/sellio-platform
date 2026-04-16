<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventBooking;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EventBookingController extends Controller
{
    /**
     * Display a listing of event bookings with advanced filters.
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->status ?: 'all');

        $bookings = EventBooking::with(['event', 'user', 'payments'])
            ->when($request->event, fn($q) => $q->where('event_id', $request->event))
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $events = Event::select('id', 'title')->get();

        return view('admin.event-bookings.index', compact('bookings', 'events', 'status'));
    }

    /**
     * Display the specified event booking.
     */
    public function show(int $id): View
    {
        // Eager load the event details and the attendee (user)
        $booking = EventBooking::with(['event', 'user', 'payments'])
            ->findOrFail($id);

        return view('admin.event-bookings.show', compact('booking'));
    }
}
