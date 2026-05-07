<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\Category;
use App\Models\Location;
use App\Http\Requests\Admin\EventRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Traits\ManagesApproval;

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
     * Display a filtered and paginated list of all event listings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::where('is_event', 1)->get();
        $locations = Location::where('is_event', 1)->get();

        $events = Event::query()
            ->with(['user', 'category', 'location'])
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

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
        $categories = Category::where('is_event', 1)->get();
        $locations = Location::where('is_event', 1)->get();
        
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
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_paid'] = $request->boolean('is_paid');

        $event = Event::create($validated);

        return redirect()
            ->route('admin.events.edit', $event->id)
            ->with('success', __('Event created successfully.'));
    }

    /**
     * Show the form for editing an existing event listing and its recent bookings.
     *
     * @param  \App\Models\Event  $event
     * @return \Illuminate\View\View
     */
    public function edit(Event $event): View
    {
        $categories = Category::where('is_event', 1)->get();
        $locations = Location::where('is_event', 1)->get();
        
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
        $validated = $request->validated();
        $validated['is_published'] = $request->boolean('is_published');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_paid'] = $request->boolean('is_paid');

        $event->update($validated);

        return redirect()
            ->route('admin.events.edit', $event->id)
            ->with('success', __('Event updated successfully.'));
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
        $clone = $event->replicate();
        $clone->is_published = false;
        $clone->approved_at = null;
        $clone->title = $event->title . ' (Copy)';
        $clone->save();

        return redirect()
            ->route('admin.events.edit', $clone->id)
            ->with('success', __('Event duplicated as draft successfully.'));
    }
}
