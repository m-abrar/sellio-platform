<?php

namespace App\Services\Admin;

use App\Models\Transaction;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Class TransactionManagementService
 * Orchestrates administrative financial auditing, coordinating ledger 
 * entries, status reconciliation, and the management of proof-of-payment assets.
 */
class TransactionManagementService
{
    /**
     * Get paginated transactions with associated audit details.
     *
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getTransactions(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Transaction::with(['user', 'booking.property'])
            ->when($filters['reference_number'] ?? null, fn ($q, $ref) => $q->where('reference_number', 'like', '%' . $ref . '%'))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Initialize a new financial transaction and archive its associated audit media.
     *
     * @param array $data
     * @return Transaction
     */
    public function createTransaction(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $media = $data['media'] ?? null;
            unset($data['media']);

            $transaction = Transaction::create($data);

            if ($media) {
                foreach ($media as $file) {
                    $transaction->addMedia($file)->toMediaCollection('transaction_screenshots');
                }
            }

            return $transaction;
        });
    }

    /**
     * Update an existing financial record and synchronize its audit assets.
     *
     * @param Transaction $transaction
     * @param array $data
     * @return bool
     */
    public function updateTransaction(Transaction $transaction, array $data): bool
    {
        return DB::transaction(function () use ($transaction, $data) {
            $media = $data['media'] ?? null;
            unset($data['media']);

            $transaction->update($data);

            if ($media) {
                $transaction->clearMediaCollection('transaction_screenshots');
                foreach ($media as $file) {
                    $transaction->addMedia($file)->toMediaCollection('transaction_screenshots');
                }
            }

            return true;
        });
    }

    /**
     * Remove a financial record from the administrative ledger.
     *
     * @param Transaction $transaction
     * @return bool|null
     */
    public function deleteTransaction(Transaction $transaction): ?bool
    {
        return $transaction->delete();
    }
}
