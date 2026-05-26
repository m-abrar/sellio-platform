<?php

namespace App\Services\Admin;

use App\Models\ClassifiedInquiry;
use App\Events\Partner\PartnerLeadCreated;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class ClassifiedInquiryManagementService
 * Orchestrates administrative lead management for the general classifieds vertical, 
 * including inquiry tracking, status updates, and view-state persistence.
 */
class ClassifiedInquiryManagementService
{
    /**
     * Get paginated classified inquiries with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getInquiries(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return ClassifiedInquiry::with(['classifiedAd.category', 'classifiedAd.location', 'user'])
            ->when($filters['classifiedad'] ?? null, fn($q, $adId) => $q->where('classified_id', $adId))
            ->when($filters['ad_name'] ?? null, fn($q, $name) => $q->whereHas('classifiedAd', fn($c) => $c->where('title', 'LIKE', "%{$name}%")))
            ->when($filters['category'] ?? null, function($q, $catId) {
                $q->whereHas('classifiedAd', fn($c) => $c->where('category_id', $catId));
            })
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn($q) => $q->where('status', $filters['status']))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Securely update the "Viewed" status of an inquiry upon administrative inspection.
     *
     * @param ClassifiedInquiry $inquiry
     * @return bool
     */
    public function markAsViewed(ClassifiedInquiry $inquiry): bool
    {
        if (!$inquiry->viewed_at) {
            return $inquiry->update(['viewed_at' => now()]);
        }
        return true;
    }

    /**
     * Store a newly created classified inquiry record in the administrative ledger.
     *
     * @param array $data
     * @return ClassifiedInquiry
     */
    public function createInquiry(array $data): ClassifiedInquiry
    {
        $inquiry = ClassifiedInquiry::create($data);

        PartnerLeadCreated::dispatch($inquiry);

        return $inquiry;
    }

    /**
     * Update an existing classified inquiry and synchronize its status.
     *
     * @param ClassifiedInquiry $inquiry
     * @param array $data
     * @return bool
     */
    public function updateInquiry(ClassifiedInquiry $inquiry, array $data): bool
    {
        return $inquiry->update($data);
    }

    /**
     * Securely remove a classified inquiry record from the database.
     *
     * @param ClassifiedInquiry $inquiry
     * @return bool|null
     */
    public function deleteInquiry(ClassifiedInquiry $inquiry): ?bool
    {
        return $inquiry->delete();
    }
}
