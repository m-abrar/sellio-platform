<?php

namespace App\Services\Admin;

use App\Models\Event;
use Illuminate\Support\Facades\DB;

/**
 * Class EventManagementService
 *
 * Orchestrates the business logic for the Events vertical, managing 
 * listing lifecycles, ticketing status, and administrative workflows.
 */
class EventManagementService
{
    /**
     * Create or update an event listing.
     *
     * @param array $data
     * @param Event|null $event
     * @return Event
     */
    public function saveEvent(array $data, ?Event $event = null): Event
    {
        return DB::transaction(function () use ($data, $event) {
            $data['is_published'] = isset($data['is_published']) ? (bool)$data['is_published'] : false;
            $data['is_featured']  = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
            $data['is_paid']      = isset($data['is_paid']) ? (bool)$data['is_paid'] : false;

            if ($event) {
                $event->update($data);
                return $event;
            }

            if (!isset($data['user_id'])) {
                $data['user_id'] = auth()->id();
            }

            return Event::create($data);
        });
    }

    /**
     * Replicate an existing event listing as a draft copy.
     *
     * @param Event $event
     * @return Event
     */
    public function duplicateEvent(Event $event): Event
    {
        return DB::transaction(function () use ($event) {
            $clone = $event->replicate();
            $clone->is_published = false;
            $clone->approved_at = null;
            $clone->title = $event->title . ' ' . __('(Copy)');
            $clone->save();

            return $clone;
        });
    }
}
