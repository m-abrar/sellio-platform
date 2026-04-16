<?php

namespace App\Services\Partner;

use App\Models\Event;
use App\Models\EventOccurrence;
use App\Models\EventTicketType;
use App\Models\EventOccurrenceTicket;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

/**
 * Class EventService
 * Manages complex event scheduling, ticket types, and occurrence inventory.
 */
class EventService
{
    /**
     * Process and save event data including all nested relationships.
     *
     * @param array $data
     * @param Event|null $event
     * @return Event
     */
    public function saveEvent(array $data, ?Event $event = null): Event
    {
        return DB::transaction(function () use ($data, $event) {
            $eventData = $this->prepareBaseData($data);

            if ($event) {
                $event->update($eventData);
            } else {
                $eventData['user_id'] = auth()->id();
                $event = Event::create($eventData);
            }

            $ticketIdMap = $this->syncTicketTypes($event, $data['tickets'] ?? []);
            $this->syncOccurrences($event, $data['occurrences'] ?? [], $ticketIdMap);

            return $event;
        });
    }

    /**
     * Prepare base event attributes and booleans.
     *
     * @param array $data
     * @return array
     */
    protected function prepareBaseData(array $data): array
    {
        $data['slug'] = Str::slug($data['title']);
        $data['is_paid'] = (bool) ($data['is_paid'] ?? false);
        $data['is_published'] = (bool) ($data['is_published'] ?? false);
        $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
        $data['is_virtual'] = (bool) ($data['is_virtual'] ?? false);

        if (!$data['is_paid']) {
            $data['base_price'] = 0.00;
            $data['sale_price'] = null;
        }

        return $data;
    }

    /**
     * Sync event ticket categories.
     *
     * @param Event $event
     * @param array $ticketData
     * @return array Map of temporary IDs to real database IDs
     */
    protected function syncTicketTypes(Event $event, array $ticketData): array
    {
        $updatedIds = [];
        $idMap = [];

        foreach ($ticketData as $item) {
            $id = $item['id'];
            $attributes = [
                'title' => $item['title'],
                'base_price' => (float) ($item['base_price'] ?? 0.00),
            ];

            $ticket = Str::startsWith($id, 'NEW_') 
                ? $event->tickettypes()->create($attributes)
                : EventTicketType::updateOrCreate(['id' => $id], $attributes);

            $idMap[$id] = $ticket->id;
            $updatedIds[] = $ticket->id;
        }

        $event->tickettypes()->whereNotIn('id', $updatedIds)->delete();
        return $idMap;
    }

    /**
     * Sync event dates and times.
     *
     * @param Event $event
     * @param array $occurrenceData
     * @param array $ticketIdMap
     * @return void
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

            $occurrence = Str::startsWith($id, 'NEW_')
                ? $event->occurrences()->create($attributes)
                : EventOccurrence::updateOrCreate(['id' => $id], $attributes);

            $updatedIds[] = $occurrence->id;
            $this->syncInventory($occurrence, $item['inventory'] ?? [], $ticketIdMap);
        }

        $event->occurrences()->whereNotIn('id', $updatedIds)->delete();
    }

    /**
     * Sync ticket availability per specific occurrence.
     *
     * @param EventOccurrence $occurrence
     * @param array $inventoryData
     * @param array $ticketIdMap
     * @return void
     */
    protected function syncInventory(EventOccurrence $occurrence, array $inventoryData, array $ticketIdMap): void
    {
        $updatedIds = [];

        foreach ($inventoryData as $tempTicketId => $inventory) {
            $actualTicketId = $ticketIdMap[$tempTicketId] ?? null;

            if ($actualTicketId) {
                $eot = EventOccurrenceTicket::updateOrCreate(
                    [
                        'event_occurrence_id' => $occurrence->id,
                        'event_ticket_type_id' => $actualTicketId
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
}
