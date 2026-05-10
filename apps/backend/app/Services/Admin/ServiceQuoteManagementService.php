<?php

namespace App\Services\Admin;

use App\Models\ServiceQuote;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class ServiceQuoteManagementService
 * Orchestrates administrative oversight for professional service inquiries, 
 * managing quoting requirements, provider coordination, and engagement tracking.
 */
class ServiceQuoteManagementService
{
    /**
     * Get paginated service quotes with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getQuotes(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return ServiceQuote::with([
            'service.category',
            'service.location',
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])
            ->when($filters['service'] ?? null, fn($q, $service) => $q->where('service_id', $service))
            ->when($filters['service_name'] ?? null, fn($q, $name) => $q->whereHas('service', fn($s) => $s->where('title', 'LIKE', "%{$name}%")))
            ->when($filters['category'] ?? null, function($q, $cat) {
                $q->whereHas('service', fn($s) => $s->where('category_id', $cat));
            })
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn($q) => $q->where('status', $filters['status']))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Securely update the "Viewed" status of a quote request upon administrative inspection.
     *
     * @param ServiceQuote $quote
     * @return bool
     */
    public function markAsViewed(ServiceQuote $quote): bool
    {
        if (!$quote->viewed_at) {
            return $quote->update(['viewed_at' => now()]);
        }
        return true;
    }

    /**
     * Securely remove a service quote request from the ledger.
     *
     * @param ServiceQuote $quote
     * @return bool|null
     */
    public function deleteQuote(ServiceQuote $quote): ?bool
    {
        return $quote->delete();
    }
}
