<?php

namespace App\Services\Admin;

use App\Models\Event;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class EventManagementService
 *
 * Orchestrates the business logic for the Events vertical, managing 
 * listing lifecycles, ticketing status, and administrative workflows.
 */
class EventManagementService
{
    /**
     * Get paginated event listings with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getEvents(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Event::query()
            ->with(['user', 'category', 'location'])
            ->when($filters['title'] ?? null, fn($q, $title) => $q->where('title', 'like', '%' . $title . '%'))
            ->when($filters['category_id'] ?? null, fn($q, $cat) => $q->where('category_id', $cat))
            ->when($filters['location_id'] ?? null, fn($q, $loc) => $q->where('location_id', $loc))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create or update an event listing within an atomic transaction.
     *
     * @param array $data
     * @param Event|null $event
     * @return Event
     */
    public function saveEvent(array $data, ?Event $event = null): Event
    {
        return DB::transaction(function () use ($data, $event) {
            if (empty($data['slug']) && ! empty($data['title'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $data = $this->prepareScheduleData($data);

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
     * Replicate an existing event listing as a draft copy for rapid entry.
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

    /**
     * Map form schedule fields to columns persisted on the events table.
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    protected function prepareScheduleData(array $data): array
    {
        if (! empty($data['start_date_time']) && ! empty($data['end_date_time'])) {
            $start = Carbon::parse($data['start_date_time']);
            $end = Carbon::parse($data['end_date_time']);
            $data['duration_hours'] = max(round($start->diffInMinutes($end) / 60, 1), 0.1);
        }

        unset($data['end_date_time']);

        return $data;
    }
}
