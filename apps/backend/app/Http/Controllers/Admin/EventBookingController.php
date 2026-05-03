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
        $categories = \App\Models\Category::where('is_event', true)->select('id', 'title')->get();

        return view('admin.event-bookings.index', compact('bookings', 'events', 'categories', 'status'));
    }

    /**
     * Show the form for creating a new event booking.
     */
    public function create(): View
    {
        $booking = new EventBooking();
        $events = Event::select('id', 'title', 'base_price')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();
        
        return view('admin.event-bookings.form', compact('booking', 'events', 'users'));
    }

    /**
     * Store a newly created event booking.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'user_id' => 'required|exists:users,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|string',
            'admin_note' => 'nullable|string',
        ]);

        $validated['booking_reference'] = 'EVT-' . strtoupper(\Illuminate\Support\Str::random(8));

        $booking = EventBooking::create($validated);

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking created successfully. Reference: :ref', ['ref' => $booking->booking_reference]));
    }

    /**
     * Show the form for editing the specified event booking.
     */
    public function edit(int $id): View
    {
        $booking = EventBooking::findOrFail($id);
        $events = Event::select('id', 'title', 'base_price')->get();
        $users = \App\Models\User::select('id', 'name', 'email')->get();

        return view('admin.event-bookings.form', compact('booking', 'events', 'users'));
    }

    /**
     * Update the specified event booking.
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $booking = EventBooking::findOrFail($id);

        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'user_id' => 'required|exists:users,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'status' => 'required|string',
            'admin_note' => 'nullable|string',
        ]);

        $booking->update($validated);

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking updated successfully.'));
    }

    /**
     * Remove the specified event booking.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $booking = EventBooking::findOrFail($id);
        $booking->delete();

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking deleted successfully.'));
    }
}
