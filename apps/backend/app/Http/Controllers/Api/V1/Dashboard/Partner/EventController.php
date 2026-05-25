<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Services\Partner\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class EventController
 * Handles event management, scheduling, and ticketing for partners.
 */
class EventController extends Controller
{
    protected EventService $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request): JsonResponse
    {
        $events = Event::where('user_id', Auth::id())
            ->with(['media', 'category', 'ticketTypes', 'occurrences'])
            ->orderBy('start_date_time', 'desc')
            ->paginate($request->integer('per_page', 120));

        return $this->successResponse(
            EventResource::collection($events),
            null,
            200,
            ['form' => $this->eventService->getFormData()]
        );
    }

    public function create(): JsonResponse
    {
        return $this->successResponse($this->eventService->getFormData());
    }

    public function store(EventRequest $request): JsonResponse
    {
        $event = $this->eventService->saveEvent($request->validated());
        $this->handleMedia($event, $request);

        return $this->successResponse(
            new EventResource($event->load(['media', 'category', 'ticketTypes', 'occurrences.inventory'])),
            __('Event created successfully.'),
            201
        );
    }

    public function show($event): JsonResponse
    {
        $model = Event::where('user_id', Auth::id())
            ->where(is_numeric($event) ? 'id' : 'slug', $event)
            ->with(['media', 'category', 'ticketTypes', 'occurrences.inventory'])
            ->firstOrFail();

        return $this->successResponse(new EventResource($model));
    }

    public function edit(Event $event): JsonResponse
    {
        $this->authorizeOwner($event);

        return $this->successResponse(
            new EventResource($event->load(['media', 'category', 'ticketTypes', 'occurrences.inventory']))
        );
    }

    public function update(EventRequest $request, Event $event): JsonResponse
    {
        $this->authorizeOwner($event);
        $this->eventService->saveEvent($request->validated(), $event);
        $this->handleMedia($event, $request);

        return $this->successResponse(
            new EventResource($event->fresh(['media', 'category', 'ticketTypes', 'occurrences.inventory'])),
            __('Event updated successfully.')
        );
    }

    public function destroy(Event $event): JsonResponse
    {
        $this->authorizeOwner($event);
        $title = $event->title;
        $event->delete();

        return $this->successResponse(null, __('Event ":title" deleted successfully.', ['title' => $title]));
    }

    public function renderOccurrenceRow(Request $request): JsonResponse
    {
        $nextOccurrenceIndex = (int) $request->input('index');
        $currentTicketsData = json_decode($request->input('tickets', '[]'), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($currentTicketsData)) {
            return $this->errorResponse('Invalid ticket data', 400);
        }

        return $this->successResponse([
            'occurrence'           => null,
            'nextOccurrenceIndex'  => $nextOccurrenceIndex,
            'currentTicketsData'   => $currentTicketsData,
        ]);
    }

    protected function authorizeOwner(Event $event): void
    {
        if (Auth::id() !== $event->user_id) {
            abort(403, __('Unauthorized access to this event.'));
        }
    }

    protected function handleMedia(Event $event, Request $request): void
    {
        if ($request->hasFile('main_image')) {
            $event->clearMediaCollection(Event::PRIMARY_MEDIA);
            $event->addMediaFromRequest('main_image')->toMediaCollection(Event::PRIMARY_MEDIA);
        }

        if ($request->has('existing_media_ids')) {
            $keepIds = array_map('intval', (array) $request->input('existing_media_ids'));

            $event->getMedia(Event::GALLERY_MEDIA)
                ->reject(fn ($media) => in_array($media->id, $keepIds))
                ->each(fn ($media) => $media->delete());

            Media::setNewOrder($keepIds);
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $event->addMedia($file)->toMediaCollection(Event::GALLERY_MEDIA);
            }
        }
    }
}
