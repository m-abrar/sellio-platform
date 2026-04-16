<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Category;
use App\Models\Event;
use App\Models\Location;
use App\Models\Tag;
use App\Models\Type;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiEventController extends Controller
{
    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    /**
     * List / search events with sidebar filter metadata.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $events = $this->eventService->searchEvents($request->all(), auth()->user());

        return EventResource::collection($events)->additional([
            'sidebar' => [
                'categories' => Category::where('is_event', true)->get(),
                'locations'  => Location::where('is_event', true)->get(),
                'types'      => Type::where('is_event', true)->get(),
                'tags'       => Tag::where('is_event', true)->get(),
            ]
        ]);
    }

    /**
     * Show a single event with ticket/occurrence data.
     */
    public function show(string $slug): JsonResponse
    {
        $event = Event::where('slug', $slug)
            ->visibleTo(auth()->user())
            ->with([
                'category', 'location', 'tags', 'ticketTypes', 'media',
                'occurrences' => function ($query) {
                    $query->where('start_date_time', '>', now())
                        ->orderBy('start_date_time')
                        ->with(['inventory.ticketType', 'bookings']);
                },
            ])
            ->firstOrFail();

        $allTicketData = $this->eventService->getFormattedTicketData($event);

        return $this->successResponse(
            new EventResource($event),
            null,
            200,
            [
                'ticket_data' => $allTicketData,
            ]
        );
    }

    /**
     * Filter events by category slug.
     */
    public function category(string $categorySlug): AnonymousResourceCollection
    {
        return $this->index(new Request(['category' => $categorySlug]));
    }
}
