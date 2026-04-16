<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Category;
use App\Models\Type;
use App\Models\Location;
use App\Models\Tag;
use App\Services\EventService;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

/**
 * Class EventController
 *
 * Manages event views and coordinates with EventService for data processing.
 */
class EventController extends Controller
{
    /**
     * @var EventService
     */
    protected $eventService;

    /**
     * EventController constructor.
     *
     * @param EventService $eventService
     */
    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * Display the event listing index.
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request): View
    {
        return $this->search($request);
    }

    /**
     * Search and filter events.
     *
     * @param Request $request
     * @return View
     */
    public function search(Request $request): View
    {
        $categories = Category::where('is_event', true)->get();
        $types      = Type::where('is_event', true)->get();
        $locations  = Location::where('is_event', true)->get();
        $tags       = Tag::where('is_event', true)->get();

        $events = $this->eventService->searchEvents($request->all());

        return view('frontend.events.index', compact(
            'events', 
            'categories', 
            'locations', 
            'types', 
            'tags'
        ));
    }

    /**
     * Show detailed information and tickets for a specific event.
     *
     * @param Event $event
     * @return View
     */
    public function show(Event $event): View
    {
        $event->load([
            'category', 'location', 'tags', 'ticketTypes', 'media',
            'occurrences' => function ($query) {
                $query->where('start_date_time', '>', now())
                    ->orderBy('start_date_time')
                    ->with(['inventory.ticketType', 'bookings']);
            },
        ]);

        $allTicketData = $this->eventService->getFormattedTicketData($event);

        return view('frontend.events.show.event-detail', [
            'event'         => $event,
            'allTicketData' => $allTicketData,
            'bookings'      => []
        ]);
    }

    /**
     * Show the event calendar view.
     *
     * @param Event $event
     * @return View
     */
    public function calendar(Event $event): View
    {
        $event->load(['occurrences' => fn($q) => $q->where('start_date_time', '>=', now())]);

        return view('frontend.events.calendar', compact('event'));
    }
}
