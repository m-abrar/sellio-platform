<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Booking;
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
     * Display a paginated listing of all platform transactions for financial auditing.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $transactions = Transaction::with(['user', 'payable'])
            ->latest()
            ->paginate(15);

        return view('admin.transactions.index', compact('transactions'));
    }

    /**
     * Show the interface for initializing a manual financial transaction record.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $bookings    = Booking::all();
        $transaction = new Transaction();
        
        return view('admin.transactions.form', compact('transaction', 'bookings'));
    }

    /**
     * Store a newly created financial transaction and archive its associated media.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount'           => 'required|numeric',
            'payment_method'   => 'nullable|string|max:100',
            'reference_number' => 'nullable|string|max:255',
            'status'           => 'required|in:pending,completed,failed,cancelled',
            'notes'            => 'nullable|string',
            'transaction_date' => 'nullable|date',
            'media'            => 'nullable|array',
            'media.*'          => 'file|image|max:5120',
        ]);

        $transaction = Transaction::create($validated);

        // Archive Proof of Payment
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $transaction->addMedia($file)->toMediaCollection('transaction_screenshots');
            }
        }

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
        $bookings = Booking::all();
        $transaction->load(['user', 'payable']);
        
        return view('admin.transactions.form', compact('transaction', 'bookings'));
    }

    /**
     * Update an existing financial record and synchronize its audit media.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Transaction  $transaction
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Transaction $transaction): RedirectResponse
    {
        $validated = $request->validate([
            'amount'           => 'required|numeric',
            'payment_method'   => 'nullable|string|max:100',
            'reference_number' => 'nullable|string|max:255',
            'status'           => 'required|in:pending,completed,failed,cancelled',
            'notes'            => 'nullable|string',
            'transaction_date' => 'nullable|date',
            'media'            => 'nullable|array',
            'media.*'          => 'file|image|max:5120',
        ]);

        $transaction->update($validated);

        // Synchronize Audit Media: Reset and Re-archive if new files are provided
        if ($request->hasFile('media')) {
            $transaction->clearMediaCollection('transaction_screenshots');
            foreach ($request->file('media') as $file) {
                $transaction->addMedia($file)->toMediaCollection('transaction_screenshots');
            }
        }

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
        $transaction->delete();
        
        return redirect()->route('admin.transactions.index')
            ->with('success', __('Transaction entry removed from ledger successfully.'));
    }
}
