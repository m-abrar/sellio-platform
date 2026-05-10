<?php

namespace App\Services\Admin;

use App\Models\Payment;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Class PaymentManagementService
 * Orchestrates the administrative financial ledger, managing the lifecycle of 
 * polymorphic payments, transaction auditing, and manual reconciliation.
 */
class PaymentManagementService
{
    /**
     * Get paginated payments with associated metadata and filters.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPayments(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Payment::with(['user', 'payable'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id', $search)
                        ->orWhere('transaction_id', 'like', '%' . $search . '%');
                });
            })
            ->when($filters['status'] ?? null, fn($q, $status) => $q->where('status', $status))
            ->when($filters['method'] ?? null, fn($q, $method) => $q->where('payment_method', 'like', '%' . $method . '%'))
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Store a newly created payment record in the financial ledger.
     *
     * @param array $data
     * @return Payment
     */
    public function createPayment(array $data): Payment
    {
        return Payment::create($data);
    }

    /**
     * Update an existing financial record and maintain polymorphic integrity.
     *
     * @param Payment $payment
     * @param array $data
     * @return bool
     */
    public function updatePayment(Payment $payment, array $data): bool
    {
        return $payment->update($data);
    }

    /**
     * Securely remove a financial record from the ledger.
     *
     * @param Payment $payment
     * @return bool|null
     */
    public function deletePayment(Payment $payment): ?bool
    {
        return $payment->delete();
    }
}
