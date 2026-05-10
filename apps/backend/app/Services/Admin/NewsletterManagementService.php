<?php

namespace App\Services\Admin;

use App\Models\NewsletterSubscriber;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Class NewsletterManagementService
 * Orchestrates administrative audience management, coordinating subscriber 
 * verification, metadata updates, and high-volume data exportation.
 */
class NewsletterManagementService
{
    /**
     * Get paginated subscribers with filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getSubscribers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::latest()
            ->when($filters['search'] ?? null, function ($q, $search) {
                return $q->where('email', 'LIKE', "%{$search}%");
            })
            ->when($filters['source'] ?? null, function ($q, $source) {
                return $q->where('source', $source);
            })
            ->when(isset($filters['confirmed']) && $filters['confirmed'] !== '', function ($q) use ($filters) {
                return $q->where('is_confirmed', $filters['confirmed']);
            })
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get unique sources for filtering.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getSources()
    {
        return NewsletterSubscriber::distinct()->whereNotNull('source')->pluck('source');
    }

    /**
     * Export the entire subscriber database to a standardized CSV format.
     *
     * @return StreamedResponse
     */
    public function exportToCsv(): StreamedResponse
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=subscribers_" . date('Y-m-d') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, [
                __('ID'), 
                __('Email'), 
                __('Source'), 
                __('Confirmed'), 
                __('Created At')
            ]);

            NewsletterSubscriber::query()->chunk(500, function ($subscribers) use ($file) {
                foreach ($subscribers as $subscriber) {
                    fputcsv($file, [
                        $subscriber->id,
                        $subscriber->email,
                        $subscriber->source ?? __('Main Website'),
                        $subscriber->is_confirmed ? __('Yes') : __('No'),
                        $subscriber->created_at ? $subscriber->created_at->format('Y-m-d H:i:s') : ''
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Update an existing subscriber record.
     *
     * @param NewsletterSubscriber $subscriber
     * @param array $data
     * @return bool
     */
    public function updateSubscriber(NewsletterSubscriber $subscriber, array $data): bool
    {
        return $subscriber->update($data);
    }

    /**
     * Remove a subscriber record from the database.
     *
     * @param NewsletterSubscriber $subscriber
     * @return bool|null
     */
    public function deleteSubscriber(NewsletterSubscriber $subscriber): ?bool
    {
        return $subscriber->delete();
    }
}
