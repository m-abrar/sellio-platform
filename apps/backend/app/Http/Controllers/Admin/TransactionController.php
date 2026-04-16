<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::latest()->paginate(10);
        return view('admin.transactions.index', compact('transactions'));
    }

    public function create()
    {
        $bookings = Booking::all();
        return view('admin.transactions.form', compact('bookings'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'payment_method' => 'nullable|string|max:100',
            'reference_number' => 'nullable|string|max:255',
            'status' => 'required|in:pending,completed,failed,cancelled',
            'notes' => 'nullable|string',
            'transaction_date' => 'nullable|date',
        ]);

        $transaction = Transaction::create($request->all());

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $transaction->addMedia($file)->toMediaCollection('transaction_screenshots');
            }
        }

        return redirect()->route('admin.transactions.edit', $transaction->id)
            ->with('success', 'Transaction added successfully.');
    }

    public function edit(Transaction $transaction)
    {
        $bookings = Booking::all();
        return view('admin.transactions.form', compact('transaction', 'bookings'));
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'payment_method' => 'nullable|string|max:100',
            'reference_number' => 'nullable|string|max:255',
            'status' => 'required|in:pending,completed,failed,cancelled',
            'notes' => 'nullable|string',
            'transaction_date' => 'nullable|date',
        ]);

        $transaction->update($request->all());

        if ($request->hasFile('media')) {
            $transaction->clearMediaCollection('transaction_screenshots');
            foreach ($request->file('media') as $file) {
                $transaction->addMedia($file)->toMediaCollection('transaction_screenshots');
            }
        }

        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction updated successfully.');
    }

    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return redirect()->route('admin.transactions.index')
            ->with('success', 'Transaction deleted successfully.');
    }
}
