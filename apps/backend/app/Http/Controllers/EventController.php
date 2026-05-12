<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchEventRequest;
use App\Models\Event;
use App\Services\EventService;
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
    public function index(SearchEventRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Search and filter events.
     *
     * @param Request $request
     * @return View
     */
    public function search(SearchEventRequest $request): View
    {
        $taxonomies = $this->eventService->getFilterTaxonomies();
        $events = $this->eventService->searchEvents($request->validated());

        return view('frontend.events.index', array_merge($taxonomies, [
            'events' => $events,
        ]));
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
            'category', 'location', 'user', 'brand', 'tags', 'ticketTypes', 'media',
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
