<?php

namespace App\Services\Partner;

use App\Models\Category;
use App\Models\Event;
use App\Models\EventOccurrence;
use App\Models\EventOccurrenceTicket;
use App\Models\EventTicketType;
use App\Models\Location;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class EventService
 * Manages complex event scheduling, ticket types, and occurrence inventory.
 */
class EventService
{
    /**
     * Get discovery data for event forms.
     */
    public function getFormData(): array
    {
        return [
            'categories' => Category::where('is_event', true)->get(['id', 'title']),
            'types'      => Type::where('is_event', true)->get(['id', 'title']),
            'locations'  => Location::where('is_event', true)->get(['id', 'title']),
            'google_maps_api_key' => config('services.google_maps.api_key') ?: setting('google_map_api_key'),
        ];
    }

    /**
     * Process and save event data including all nested relationships.
     */
    public function saveEvent(array $data, ?Event $event = null): Event
    {
        return DB::transaction(function () use ($data, $event) {
            $tickets = $data['tickets'] ?? [];
            $occurrences = $data['occurrences'] ?? [];

            $eventData = $this->prepareBaseData($data, $occurrences, $event?->id);

            if ($event) {
                $event->update($eventData);
            } else {
                $eventData['user_id'] = auth()->id();
                $event = Event::create($eventData);
            }

            $ticketIdMap = $this->syncTicketTypes($event, $tickets);
            $this->syncOccurrences($event, $occurrences, $ticketIdMap);

            // Sync polymorphic Tags
            if (isset($data['tags'])) {
                $tagIds = [];
                foreach ($data['tags'] as $tagName) {
                    $tag = \App\Models\Tag::firstOrCreate(
                        ['title' => trim($tagName)],
                        ['slug' => \Illuminate\Support\Str::slug($tagName), 'is_event' => true, 'is_published' => true]
                    );
                    $tagIds[] = $tag->id;
                }
                $event->tags()->sync($tagIds);
            } else {
                $event->tags()->sync([]);
            }

            return $event->fresh(['ticketTypes', 'occurrences.inventory', 'tags']);
        });
    }

    /**
     * Prepare base event attributes and booleans.
     */
    protected function prepareBaseData(array $data, array $occurrences, ?int $currentId = null): array
    {
        unset($data['tickets'], $data['occurrences'], $data['tags'], $data['main_image'], $data['gallery'], $data['existing_media_ids']);

        if (!empty($occurrences[0])) {
            $first = $occurrences[0];
            $start = Carbon::parse($first['start_date_time']);

            $data['start_date_time'] = $start;
            $data['end_date_time'] = $start->copy()->addHours((float) ($first['duration_hours'] ?? 3));
            $data['duration_hours'] = (float) ($first['duration_hours'] ?? 3);
            $data['max_attendees'] = (int) ($first['max_attendees'] ?? 0);
        }

        $data['slug'] = $this->generateUniqueSlug($data['title'], $currentId);
        $data['is_paid'] = (bool) ($data['is_paid'] ?? false);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
        $data['is_virtual'] = (bool) ($data['is_virtual'] ?? false);

        if (!$data['is_paid']) {
            $data['base_price'] = 0.00;
            $data['sale_price'] = null;
        }

        return Arr::only($data, (new Event())->getFillable());
    }

    /**
     * Sync event ticket categories.
     *
     * @return array Map of temporary IDs to real database IDs
     */
    protected function syncTicketTypes(Event $event, array $ticketData): array
    {
        $updatedIds = [];
        $idMap = [];

        foreach ($ticketData as $item) {
            $id = $item['id'];
            $attributes = [
                'title'      => $item['title'],
                'base_price' => (float) ($item['base_price'] ?? 0.00),
            ];

            $ticket = Str::startsWith((string) $id, 'NEW_')
                ? $event->ticketTypes()->create($attributes)
                : tap(
                    EventTicketType::where('event_id', $event->id)->findOrFail($id),
                    fn (EventTicketType $model) => $model->update($attributes)
                );

            $idMap[$id] = $ticket->id;
            $updatedIds[] = $ticket->id;
        }

        $staleTicketIds = $event->ticketTypes()
            ->whereNotIn('id', $updatedIds)
            ->pluck('id');

        if ($staleTicketIds->isNotEmpty()) {
            EventOccurrenceTicket::whereIn('event_ticket_type_id', $staleTicketIds)->delete();
            $event->ticketTypes()->whereIn('id', $staleTicketIds)->delete();
        }

        return $idMap;
    }

    /**
     * Sync event dates and times.
     */
    protected function syncOccurrences(Event $event, array $occurrenceData, array $ticketIdMap): void
    {
        $updatedIds = [];

        foreach ($occurrenceData as $item) {
            $id = $item['id'];
            $start = Carbon::parse($item['start_date_time']);

            $attributes = [
                'start_date_time' => $start,
                'end_date_time'   => $start->copy()->addHours((float) $item['duration_hours']),
                'duration_hours'  => (float) $item['duration_hours'],
                'max_attendees'   => (int) ($item['max_attendees'] ?? 0),
                'venue_details'   => $item['venue_details'] ?? null,
            ];

            $occurrence = Str::startsWith((string) $id, 'NEW_')
                ? $event->occurrences()->create($attributes)
                : tap(
                    EventOccurrence::where('event_id', $event->id)->findOrFail($id),
                    fn (EventOccurrence $model) => $model->update($attributes)
                );

            $updatedIds[] = $occurrence->id;
            $this->syncInventory($occurrence, $item['inventory'] ?? [], $ticketIdMap);
        }

        $event->occurrences()->whereNotIn('id', $updatedIds)->delete();
    }

    /**
     * Sync ticket availability per specific occurrence.
     */
    protected function syncInventory(EventOccurrence $occurrence, array $inventoryData, array $ticketIdMap): void
    {
        $updatedIds = [];

        foreach ($inventoryData as $tempTicketId => $inventory) {
            $actualTicketId = $ticketIdMap[$tempTicketId] ?? null;

            if ($actualTicketId) {
                $eot = EventOccurrenceTicket::updateOrCreate(
                    [
                        'event_occurrence_id'  => $occurrence->id,
                        'event_ticket_type_id' => $actualTicketId,
                    ],
                    [
                        'available_quantity' => (int) ($inventory['available_quantity'] ?? 0),
                        'override_price'     => (float) ($inventory['override_price'] ?? 0.00),
                    ]
                );
                $updatedIds[] = $eot->id;
            }
        }

        $occurrence->inventory()->whereNotIn('id', $updatedIds)->delete();
    }

    protected function generateUniqueSlug(string $title, ?int $currentId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            Event::where('slug', $slug)
                ->when($currentId, fn ($query) => $query->where('id', '!=', $currentId))
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
