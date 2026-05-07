<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class EventBookingController
 * Orchestrates the administrative lifecycle for event ticketing, 
 * managing reservations, financial statuses, and relationship mapping between users and occurrences.
 */
class EventBookingController extends Controller
{
    /**
     * Display a filtered and paginated list of all event bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $bookings = EventBooking::with(['event.category', 'event.location', 'user', 'payments'])
            ->when($request->event, fn($q) => $q->where('event_id', $request->event))
            ->when($request->event_name, fn($q) => $q->whereHas('event', fn($ev) => $ev->where('title', 'LIKE', "%{$request->event_name}%")))
            ->when($request->category, function($q) use ($request) {
                $q->whereHas('event', fn($ev) => $ev->where('category_id', $request->category));
            })
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $events = Event::select('id', 'title', 'category_id')->with('category:id,title')->get();
        $categories = Category::where('is_event', true)->select('id', 'title')->get();

        return view('admin.event-bookings.index', compact('bookings', 'events', 'categories', 'status'));
    }

    /**
     * Show the form for creating a new manual event booking.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $booking = new EventBooking();
        $events = Event::select('id', 'title', 'base_price')->get();
        $users = User::select('id', 'name', 'email')->get();
        
        return view('admin.event-bookings.form', compact('booking', 'events', 'users'));
    }

    /**
     * Store a newly created event booking record with a unique reference.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'user_id'     => 'required|exists:users,id',
            'quantity'    => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status'      => 'required|string|max:255',
            'admin_note'  => 'nullable|string',
        ]);

        $validated['booking_reference'] = 'EVT-' . strtoupper(Str::random(8));

        $booking = EventBooking::create($validated);

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking created successfully. Reference: :ref', ['ref' => $booking->booking_reference]));
    }

    /**
     * Show the form for editing an existing event booking.
     *
     * @param  \App\Models\EventBooking  $eventBooking
     * @return \Illuminate\View\View
     */
    public function edit(EventBooking $eventBooking): View
    {
        $events = Event::select('id', 'title', 'base_price')->get();
        $users = User::select('id', 'name', 'email')->get();

        return view('admin.event-bookings.form', [
            'booking' => $eventBooking, 
            'events'  => $events, 
            'users'   => $users
        ]);
    }

    /**
     * Update an existing event booking record in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EventBooking  $eventBooking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, EventBooking $eventBooking): RedirectResponse
    {
        $validated = $request->validate([
            'event_id'    => 'required|exists:events,id',
            'user_id'     => 'required|exists:users,id',
            'quantity'    => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status'      => 'required|string|max:255',
            'admin_note'  => 'nullable|string',
        ]);

        $eventBooking->update($validated);

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking updated successfully.'));
    }

    /**
     * Remove an event booking record from the database.
     *
     * @param  \App\Models\EventBooking  $eventBooking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(EventBooking $eventBooking): RedirectResponse
    {
        $eventBooking->delete();

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking deleted successfully.'));
    }
}
