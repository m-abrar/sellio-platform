<?php

namespace App\Services;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\Tag;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Class EventService
 *
 * Handles the business logic for event filtering and inventory calculations.
 */
class EventService
{
    /**
     * Retrieve all taxonomies (categories, locations, etc.) for the event filter sidebar.
     * Includes counts across all marketplace verticals for enhanced discovery.
     *
     * @return array
     */
    public function getFilterTaxonomies(): array
    {
        // Define common vertical relations to count for the dashboard/sidebar
        $verticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds', 'products'];
        $locationVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];
        $tagVerticals = ['properties', 'autos', 'events', 'jobs', 'services', 'classifieds'];

        return [
            'categories' => Category::where('is_event', true)->withCount($verticals)->get(),
            'locations'  => Location::where('is_event', true)->withCount($locationVerticals)->get(),
            'types'      => Type::where('is_event', true)->withCount($verticals)->get(),
            'tags'       => Tag::where('is_event', true)->withCount($tagVerticals)->get(),
        ];
    }

    /**
     * Search and filter events based on criteria.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchEvents(array $filters, ?User $user = null): LengthAwarePaginator
    {
        return Event::latest()
            ->visibleTo($user)
            ->whereHas('occurrences', fn(Builder $q) => $q->where('start_date_time', '>=', now()))
            ->when($filters['search'] ?? null, function (Builder $q, $v) {
                $q->where(fn($sub) => $sub->where('name', 'like', "%$v%")
                    ->orWhere('description', 'like', "%$v%"));
            })
            ->when($filters['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when($filters['location'] ?? null, fn($q, $v) => $q->where('location_id', $v))
            ->when($filters['type'] ?? null,     fn($q, $v) => $q->where('type_id', $v))
            ->when($filters['tags'] ?? null, function (Builder $q, $v) {
                $q->whereHas('tags', fn($sub) => $sub->whereIn('tags.id', (array) $v));
            })
            ->when(($filters['price'] ?? null) === 'paid', fn($q) => $q->where('is_paid', true))
            ->when(($filters['price'] ?? null) === 'free', fn($q) => $q->where('is_paid', false))
            ->when($filters['start_date'] ?? null, function (Builder $q, $v) {
                $q->whereHas('occurrences', fn($sub) => $sub->whereDate('start_date_time', '>=', Carbon::parse($v)));
            })
            ->when($filters['end_date'] ?? null, function (Builder $q, $v) {
                $q->whereHas('occurrences', fn($sub) => $sub->whereDate('start_date_time', '<=', Carbon::parse($v)));
            })
            ->with([
                'category', 'location', 'type', 'user', 'tags', 'media',
                'occurrences' => fn($q) => $q->where('start_date_time', '>=', now())->orderBy('start_date_time')
            ])
            ->paginate(12);
    }

    /**
     * Format occurrence and inventory data for the frontend.
     *
     * @param Event $event
     * @return Collection
     */
    public function getFormattedTicketData(Event $event): Collection
    {
        // Optimization: Eager load inventory with bookings sum using a single query aggregate
        $event->load(['occurrences.inventory' => function ($query) {
            $query->withSum(['bookings' => function ($q) {
                $q->where('status', 'confirmed');
            }], 'quantity')->with('ticketType');
        }]);

        return $event->occurrences->mapWithKeys(function ($occurrence) use ($event) {
            $inventoryData = $occurrence->inventory->map(function ($inventory) {
                
                $sold = (int) ($inventory->bookings_sum_quantity ?? 0);
                $remaining = max(0, $inventory->available_quantity - $sold);

                $price = $inventory->sale_price 
                        ?? $inventory->override_price 
                        ?? $inventory->ticketType->base_price 
                        ?? 0.00;

                return [
                    'id'        => $inventory->event_ticket_type_id,
                    'name'      => $inventory->ticketType->title ?? __('N/A'),
                    'price'     => (float) $price,
                    'available' => (int) $remaining,
                ];
            })->values();

            return [$occurrence->id => [
                'start_date_formatted' => $occurrence->start_date_time->translatedFormat('F jS, Y') . ' ' . __('at') . ' ' . $occurrence->start_date_time->translatedFormat('h:i A'),
                'start_date_iso'       => $occurrence->start_date_time->toIso8601String(),
                'slug'                 => $event->slug,
                'inventory'            => $inventoryData->filter(fn($item) => $item['available'] > 0),
            ]];
        });
    }
}
