<?php

namespace App\Services\Admin;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\{PropertyBooking, AutoInquiry, EventBooking, JobApplication, ServiceQuote, ServiceAppointment, ClassifiedInquiry};

class BookingManagementService
{
    /**
     * Define the map of models and their specific related listing relationships.
     */

    public const MODEL_MAP = [
        PropertyBooking::class    => ['relation' => 'property', 'table' => 'property_bookings', 'foreign_key' => 'property_id'],
        AutoInquiry::class        => ['relation' => 'auto', 'table' => 'auto_inquiries', 'foreign_key' => 'auto_id'],
        EventBooking::class       => ['relation' => 'event', 'table' => 'event_bookings', 'foreign_key' => 'event_id'],
        JobApplication::class     => ['relation' => 'job', 'table' => 'job_applications', 'foreign_key' => 'job_listing_id'], // Corrected here
        ServiceQuote::class       => ['relation' => 'service', 'table' => 'service_quotes', 'foreign_key' => 'service_id'],
        ServiceAppointment::class => ['relation' => 'service', 'table' => 'service_appointments', 'foreign_key' => 'service_id'],
        ClassifiedInquiry::class  => ['relation' => 'classifiedAd', 'table' => 'classified_inquiries', 'foreign_key' => 'classified_id'],
    ];

    /**
     * Get a unified, paginated list of all bookings using a UNION query.
     */
    public function getUnifiedBookings(string $status = 'all', string $type = 'all', int $perPage = 20): LengthAwarePaginator
    {
        $cacheKey = "unified_bookings_{$status}_{$type}_{$perPage}_page_" . request('page', 1);

        return cache()->remember($cacheKey, 60, function () use ($status, $type, $perPage) {
            $query = null;
            $cutoffDate = now()->subDays(90); // Only scan last 90 days for the unified feed by default

            foreach (self::MODEL_MAP as $modelClass => $config) {
                if ($type !== 'all' && $config['relation'] !== $type) {
                    continue;
                }

                $subQuery = DB::table($config['table'])
                    ->select(
                        'id',
                        'user_id',
                        'status',
                        'created_at',
                        $config['foreign_key'] . " as item_id",
                        DB::raw("'" . class_basename($modelClass) . "' as booking_type"),
                        DB::raw("'" . $config['relation'] . "' as relation_name"),
                        DB::raw("'" . $config['foreign_key'] . "' as actual_foreign_key")
                    )
                    ->where('created_at', '>=', $cutoffDate); // Performance: Limit scan range

                if ($status !== 'all') {
                    $subQuery->where('status', $status);
                }

                if (request('item_id')) {
                    $subQuery->where($config['foreign_key'], request('item_id'));
                }

                $query = ($query === null) ? $subQuery : $query->unionAll($subQuery);
            }

            if ($query === null) {
                return new LengthAwarePaginator([], 0, $perPage);
            }

            $results = DB::query()
                ->fromSub($query, 'bookings')
                ->orderByDesc('created_at')
                ->paginate($perPage);

            return $this->hydrateBookings($results);
        });
    }


    /**
     * Get the list of allowed model class names (basenames) for dynamic resolution.
     */
    public function getAllowedModels(): array
    {
        return collect(self::MODEL_MAP)->keys()->map(fn($m) => class_basename($m))->toArray();
    }

    protected function hydrateBookings(LengthAwarePaginator $paginator): LengthAwarePaginator
    {
        $allowedBasenames = $this->getAllowedModels();

        $models = $paginator->getCollection()->map(function ($raw) use ($allowedBasenames) {
            if (!in_array($raw->booking_type, $allowedBasenames)) {
                return null;
            }

            $fullClassName = "App\\Models\\" . $raw->booking_type;
            $model = new $fullClassName();
            
            $data = (array) $raw;
            // Map item_id back to job_listing_id (or whatever the real key is)
            $data[$raw->actual_foreign_key] = $raw->item_id;

            $model->setRawAttributes($data, true);
            $model->exists = true; 
            $model->booking_type = $raw->booking_type;
            $model->relation_name = $raw->relation_name;

            if ($raw->created_at) {
                $model->created_at = \Illuminate\Support\Carbon::parse($raw->created_at);
            }

            return $model;
        })->filter();

        $items = new \Illuminate\Database\Eloquent\Collection($models);
        
        // Eager load relationships
        $items->load('user');
        $groupedByRelation = $items->groupBy('relation_name');
        foreach ($groupedByRelation as $relation => $group) {
            $group->load($relation);
        }

        return $paginator->setCollection($items);
    }
    /**
     * Resolve the specific administrative URL for a booking type and ID.
     */
    public function resolveRedirectUrl(string $type, int $id): string
    {
        // Pluralize and kebab-case for standard Laravel route patterns
        $pluralName = \Illuminate\Support\Str::plural($type); 
        $routePrefix = \Illuminate\Support\Str::kebab($pluralName);
        
        return url('/admin/' . $routePrefix . '/' . $id);
    }

    /**
     * Delete a booking or inquiry record atomically.
     */
    public function deleteBooking(string $type, int $id): bool
    {
        $modelClass = "App\\Models\\" . $type;
        return (bool) $modelClass::destroy($id);
    }
}
