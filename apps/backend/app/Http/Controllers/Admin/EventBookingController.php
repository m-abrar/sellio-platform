<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\User;
use App\Http\Requests\Admin\UpdateEventBookingRequest;
use App\Services\Admin\EventBookingManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class EventBookingController
 * Orchestrates the administrative lifecycle for event ticketing, 
 * managing reservations, financial statuses, and relationship mapping between users and occurrences.
 */
class EventBookingController extends Controller
{
    /**
     * @var EventBookingManagementService
     */
    protected EventBookingManagementService $bookingService;

    /**
     * EventBookingController constructor.
     *
     * @param EventBookingManagementService $bookingService
     */
    public function __construct(EventBookingManagementService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Display a filtered and paginated list of all event bookings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $status
     * @return \Illuminate\View\View
     */
    public function index(Request $request, string $status = 'all'): View
    {
        $status = $request->route('status') ?: ($request->query('status') ?: 'all');
        $filters = array_merge($request->only(['event', 'event_name', 'category']), ['status' => $status]);

        $bookings = $this->bookingService->getBookings($filters);

        // Performance: Cap selection to prevent memory exhaustion in high-volume environments.
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $events = Event::select('id', 'title', 'category_id')->with('category:id,title')->limit(50)->get();
        $categories = Category::where('is_event', true)->select('id', 'title')->limit(50)->get();

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
        // Performance: Cap selection to prevent memory exhaustion.
        $events = Event::select('id', 'title', 'base_price')->limit(50)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();
        
        return view('admin.event-bookings.form', compact('booking', 'events', 'users'));
    }

    /**
     * Store a newly created event booking record with a unique reference.
     *
     * @param  \App\Http\Requests\Admin\UpdateEventBookingRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UpdateEventBookingRequest $request): RedirectResponse
    {
        $booking = $this->bookingService->createBooking($request->validated());

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
        // Performance: Cap selection to prevent memory exhaustion.
        $events = Event::select('id', 'title', 'base_price')->limit(50)->get();
        $users = User::select('id', 'name', 'email')->limit(100)->get();

        return view('admin.event-bookings.form', [
            'booking' => $eventBooking, 
            'events'  => $events, 
            'users'   => $users
        ]);
    }

    /**
     * Update an existing event booking record in the database.
     *
     * @param  \App\Http\Requests\Admin\UpdateEventBookingRequest  $request
     * @param  \App\Models\EventBooking  $eventBooking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateEventBookingRequest $request, EventBooking $eventBooking): RedirectResponse
    {
        $this->bookingService->updateBooking($eventBooking, $request->validated());

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
        $this->bookingService->deleteBooking($eventBooking);

        return redirect()
            ->route('admin.event-bookings.index')
            ->with('success', __('Booking deleted successfully.'));
    }
}
