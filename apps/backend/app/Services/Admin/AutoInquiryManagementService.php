<?php

namespace App\Services\Admin;

use App\Models\AutoInquiry;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class AutoInquiryManagementService
 * Orchestrates administrative lead management for the automotive vertical, 
 * including inquiry tracking, status updates, and relationship mapping.
 */
class AutoInquiryManagementService
{
    /**
     * Get paginated automotive inquiries with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getInquiries(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return AutoInquiry::with(['auto', 'user'])
            ->when($filters['auto'] ?? null, fn($q, $auto) => $q->where('auto_id', $auto))
            ->when($filters['search'] ?? null, fn($q, $search) => $q->where(function($query) use ($search) {
                $query->where('full_name', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', fn($uq) => $uq->where('name', 'LIKE', "%{$search}%"))
                    ->orWhereHas('auto', fn($aq) => $aq->where('title', 'LIKE', "%{$search}%"));
            }))
            ->when(isset($filters['status']) && $filters['status'] !== 'all', fn($q) => $q->where('status', $filters['status']))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Store a newly created automotive inquiry record in the administrative ledger.
     *
     * @param array $data
     * @return AutoInquiry
     */
    public function createInquiry(array $data): AutoInquiry
    {
        return AutoInquiry::create($data);
    }

    /**
     * Update an existing automotive inquiry and synchronize its status.
     *
     * @param AutoInquiry $inquiry
     * @param array $data
     * @return bool
     */
    public function updateInquiry(AutoInquiry $inquiry, array $data): bool
    {
        return $inquiry->update($data);
    }

    /**
     * Securely remove an automotive inquiry record from the database.
     *
     * @param AutoInquiry $inquiry
     * @return bool|null
     */
    public function deleteInquiry(AutoInquiry $inquiry): ?bool
    {
        return $inquiry->delete();
    }
}
