<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\Category;
use App\Models\Location;
use App\Http\Requests\Admin\EventRequest;
use App\Services\Admin\EventManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Traits\ManagesApproval;
use Illuminate\Support\Facades\Log;

/**
 * Class EventController
 * Orchestrates the event-based vertical of the marketplace, 
 * managing occurrences, ticketing configurations, and the administrative approval lifecycle.
 */
class EventController extends Controller
{
    use ManagesApproval;

    /**
     * The model class associated with the approval trait.
     *
     * @var string
     */
    protected $modelClass = Event::class;

    /**
     * @var EventManagementService
     */
    protected EventManagementService $eventService;

    /**
     * EventController constructor.
     *
     * @param EventManagementService $eventService
     */
    public function __construct(EventManagementService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Display a filtered and paginated list of all event listings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->where('is_event', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_event', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();

        $events = $this->eventService->getEvents($request->only(['title', 'category_id', 'location_id']));

        return view('admin.events.index', compact('events', 'categories', 'locations'));
    }

    /**
     * Show the form for creating a new event listing.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $event = new Event();
        $categories = Category::active()->where('is_event', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_event', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        
        return view('admin.events.form', compact('event', 'categories', 'locations'));
    }

    /**
     * Store a newly created event listing in the database.
     *
     * @param  \App\Http\Requests\Admin\EventRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(EventRequest $request): RedirectResponse
    {
        try {
            $event = $this->eventService->saveEvent($request->validated());

            return redirect()
                ->route('admin.events.edit', $event->id)
                ->with('success', __('Event created successfully.'));
        } catch (\Exception $e) {
            Log::error("Event Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure.'));
        }
    }

    /**
     * Show the form for editing an existing event listing and its recent bookings.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\View\View
     */
    public function edit(Event $event): View
    {
        $categories = Category::active()->where('is_event', 1)->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->where('is_event', 1)->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        
        $recentBookings = EventBooking::where('event_id', $event->id)->with('user')->latest()->take(5)->get();

        return view('admin.events.form', compact('event', 'categories', 'locations', 'recentBookings'));
    }

    /**
     * Update an existing event listing in the database.
     *
     * @param  \App\Http\Requests\Admin\EventRequest  $request
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(EventRequest $request, Event $event): RedirectResponse
    {
        try {
            $this->eventService->saveEvent($request->validated(), $event);

            return redirect()
                ->route('admin.events.edit', $event->id)
                ->with('success', __('Event updated successfully.'));
        } catch (\Exception $e) {
            Log::error("Event Update Failure: {$e->getMessage()}", ['id' => $event->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
        }
    }

    /**
     * Remove an event listing from the database.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();
        return redirect()->route('admin.events.index')->with('success', __('Event deleted successfully.'));
    }

    /**
     * Replicate an existing event as a draft copy for quick entry.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(Event $event): RedirectResponse
    {
        try {
            $clone = $this->eventService->duplicateEvent($event);

            return redirect()
                ->route('admin.events.edit', $clone->id)
                ->with('success', __('Event duplicated as draft successfully.'));
        } catch (\Exception $e) {
            Log::error("Event Duplication Failure: {$e->getMessage()}", ['id' => $event->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }
}
