<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TransactionRequest;
use App\Models\Transaction;
use App\Models\PropertyBooking;
use App\Services\Admin\TransactionManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class TransactionController
 * Orchestrates administrative financial auditing, coordinating ledger 
 * entries, status reconciliation, and the management of proof-of-payment assets.
 */
class TransactionController extends Controller
{
    /**
     * @var TransactionManagementService
     */
    protected TransactionManagementService $transactionService;

    /**
     * TransactionController constructor.
     *
     * @param TransactionManagementService $transactionService
     */
    public function __construct(TransactionManagementService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Display a paginated listing of all platform transactions for financial auditing.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $transactions = $this->transactionService->getTransactions(request()->only(['reference_number', 'status']));

        return view('admin.transactions.index', compact('transactions'));
    }

    /**
     * Show the interface for initializing a manual financial transaction record.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        // RECOMMENDATION: For large datasets, replace with AJAX search endpoint
        $bookings    = PropertyBooking::latest()->limit(100)->get();
        $transaction = new Transaction();
        
        return view('admin.transactions.form', compact('transaction', 'bookings'));
    }

    /**
     * Store a newly created financial transaction and archive its associated media.
     *
     * @param  \App\Http\Requests\Admin\TransactionRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(TransactionRequest $request): RedirectResponse
    {
        $transaction = $this->transactionService->createTransaction($request->validated());

        return redirect()->route('admin.transactions.edit', $transaction->id)
            ->with('success', __('Transaction entry initialized and archived successfully.'));
    }

    /**
     * Show the interface for editing an existing financial record and its associated assets.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\View\View
     */
    public function edit(Transaction $transaction): View
    {
        // RECOMMENDATION: For large datasets, replace with AJAX search endpoint
        $bookings = PropertyBooking::latest()->limit(100)->get();
        $transaction->load(['user', 'booking']);
        
        return view('admin.transactions.form', compact('transaction', 'bookings'));
    }

    /**
     * Update an existing financial record and synchronize its audit media.
     *
     * @param  \App\Http\Requests\Admin\TransactionRequest  $request
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(TransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $this->transactionService->updateTransaction($transaction, $request->validated());

        return redirect()->route('admin.transactions.index')
            ->with('success', __('Transaction audit details updated successfully.'));
    }

    /**
     * Remove a financial record from the administrative ledger.
     *
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Transaction $transaction): RedirectResponse
    {
        $this->transactionService->deleteTransaction($transaction);
        
        return redirect()->route('admin.transactions.index')
            ->with('success', __('Transaction entry removed from ledger successfully.'));
    }
}
