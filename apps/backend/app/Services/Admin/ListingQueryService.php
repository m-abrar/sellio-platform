<?php

namespace App\Services\Admin;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\{Property, Auto, Event, JobListing, Service, Classified};
use Illuminate\Pagination\LengthAwarePaginator;

class ListingQueryService
{
    /**
     * Map of route identifiers to Model classes.
     */
    public const MODEL_MAP = [
        'property'   => Property::class,
        'auto'       => Auto::class,
        'event'      => Event::class,
        'joblisting' => JobListing::class,
        'service'    => Service::class,
        'classified' => Classified::class,
    ];

    /**
     * Build a unified paginated list of all listing types.
     */
    public function getUnifiedListings(string $status, ?string $type = null, int $perPage = 15): LengthAwarePaginator
    {
        $query = null;

        foreach (self::MODEL_MAP as $key => $modelClass) {
            if ($type && $type !== 'all' && $type !== $key) {
                continue;
            }
            $subQuery = $modelClass::query()
                ->select(
                    'id',
                    'title',
                    'created_at',
                    'user_id',
                    'is_published',
                    'approved_at',
                    'expires_at',
                    \DB::raw("'" . \Str::afterLast($modelClass, '\\') . "' as listing_type")
                );

            if ($status === 'active') {
                $subQuery->where('is_published', true)
                         ->whereNotNull('approved_at');
            } elseif ($status === 'expired') {
                $subQuery->whereNotNull('expires_at')
                         ->where('expires_at', '<=', now());
            } elseif ($status === 'pending') {
                $subQuery->where('is_published', true)
                         ->whereNull('approved_at');
            } elseif ($status === 'all') {
                // No status restriction, pull all
            } else {
                $subQuery->where('is_published', false);
            }

            $query = ($query === null) ? $subQuery : $query->unionAll($subQuery);
        }

        // Apply global ordering and pagination
        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    /**
     * Resolve a specific listing instance by type and ID.
     */
    public function resolveListing(string $type, int $id)
    {
        $modelClass = self::MODEL_MAP[strtolower($type)] ?? null;
        return $modelClass ? $modelClass::find($id) : null;
    }
}
