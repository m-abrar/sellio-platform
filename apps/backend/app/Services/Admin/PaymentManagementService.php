<?php

namespace App\Services\Admin;

use App\Models\EventBooking;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PropertyBooking;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

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

    /**
     * Get paginated pending manual (bank transfer) payments awaiting admin approval.
     */
    public function getPendingManualPayments(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return Payment::with(['user', 'payable'])
            ->where('payment_method', 'manual')
            ->where('status', Payment::STATUS_PENDING)
            ->when($filters['search'] ?? null, fn($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('id', $s)->orWhere('transaction_id', 'like', '%' . $s . '%');
            }))
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
    }

    /**
     * Approve a pending manual payment and confirm the associated payable.
     */
    public function approveManualPayment(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status'  => Payment::STATUS_COMPLETED,
                'paid_at' => now(),
            ]);

            $payable = $payment->payable;

            if ($payable instanceof PropertyBooking) {
                $payable->update(['status' => PropertyBooking::STATUS_CONFIRMED]);
            } elseif ($payable instanceof EventBooking) {
                $payable->update(['status' => EventBooking::STATUS_CONFIRMED]);
            } elseif ($payable instanceof Order) {
                $payable->update(['payment_status' => 'paid', 'status' => Order::STATUS_PROCESSING]);
            }
        });
    }

    /**
     * Reject a pending manual payment, leaving the payable in pending for retry.
     */
    public function rejectManualPayment(Payment $payment): void
    {
        $payment->update(['status' => Payment::STATUS_FAILED]);
    }
}
