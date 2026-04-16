<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\EventRequest;
use App\Models\Event;
use App\Services\Partner\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Http\Resources\EventResource;

/**
 * Class EventController
 * Handles event management, scheduling, and ticketing for partners.
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
     * Display a listing of the partner's events.
     *
     * @return View
     */
    public function index()
    {
        $events = Event::where('user_id', Auth::id())
            ->orderBy('start_date_time', 'desc')
            ->paginate(10);

        return $this->successResponse(EventResource::collection($events));
    }

    /**
     * Show the form for creating a new event.
     *
     * @return View
     */
    public function create() {
        return $this->successResponse(null, 'Success');
    }

    /**
     * Store a newly created event in storage.
     *
     * @param EventRequest $request
     * @return RedirectResponse
     */
    public function store(EventRequest $request)
    {
        $event = $this->eventService->saveEvent($request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new EventResource($event),
                __('Event created successfully.'),
                201
            );
        }

        return $this->successResponse(null, __('Event ":title" created and schedule/tickets configured.', ['title' => $event->title]));
    }

    /**
     * Display the specified event.
     *
     * @param Event $event
     * @return View
     */
    public function show(Event $event)
    {
        $this->authorizeOwner($event);

        return $this->successResponse(new EventResource($event->load(['tickettypes', 'occurrences.inventory'])));
    }

    /**
     * Show the form for editing the specified event.
     *
     * @param Event $event
     * @return View
     */
    public function edit(Event $event) {
        $this->authorizeOwner($event);

        return $this->successResponse(new EventResource($event->load(['tickettypes', 'occurrences.inventory'])));
    }

    /**
     * Update the specified event in storage.
     *
     * @param EventRequest $request
     * @param Event $event
     * @return RedirectResponse
     */
    public function update(EventRequest $request, Event $event)
    {
        $this->authorizeOwner($event);
        $this->eventService->saveEvent($request->validated(), $event);

        if ($request->wantsJson()) {
            return $this->successResponse(
                new EventResource($event->fresh()),
                __('Event updated successfully.')
            );
        }

        return $this->successResponse(null, __('Event ":title" updated successfully!', ['title' => $event->title]));
    }

    /**
     * Remove the specified event from storage.
     *
     * @param Event $event
     * @return RedirectResponse
     */
    public function destroy(Event $event)
    {
        $this->authorizeOwner($event);
        $title = $event->title;
        $event->delete();

        if (request()->wantsJson()) {
            return $this->successResponse(null, __('Event ":title" deleted successfully.', ['title' => $title]));
        }

        return $this->successResponse(null, __('Event ":title" deleted successfully.', ['title' => $title]));
    }

    /**
     * Render a dynamic row for event occurrences via AJAX.
     *
     * @param Request $request
     * @return string|JsonResponse
     */
    public function renderOccurrenceRow(Request $request)
    {
        $nextOccurrenceIndex = (int) $request->input('index');
        $currentTicketsData = json_decode($request->input('tickets', '[]'), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($currentTicketsData)) {
            return $this->errorResponse('Invalid ticket data', 400);
        }

        return $this->successResponse([
            'occurrence' => null,
            'nextOccurrenceIndex' => $nextOccurrenceIndex,
            'currentTicketsData' => $currentTicketsData,
        ]);
    }

    /**
     * Authorization helper to ensure partner owns the event.
     *
     * @param Event $event
     * @return void
     */
    protected function authorizeOwner(Event $event): void
    {
        if (Auth::id() !== $event->user_id) {
            abort(403, __('Unauthorized access to this event.'));
        }
    }
}
