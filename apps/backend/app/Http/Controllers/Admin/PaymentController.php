<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class PaymentController
 * Orchestrates the administrative financial ledger, managing the lifecycle of 
 * polymorphic payments, transaction auditing, and manual reconciliation for subscriptions.
 */
class PaymentController extends Controller
{
    /**
     * Display a filtered and paginated listing of all platform transactions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $perPage = 15;
        $paymentsQuery = Payment::with(['user', 'payable']);

        // Semantic Search by ID or Transaction Reference
        if ($search = $request->query('search')) {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('id', $search)
                    ->orWhere('transaction_id', 'like', '%' . $search . '%');
            });
        }

        // Status-based Filtering (pending, completed, failed, refunded)
        if ($status = $request->query('status')) {
            $paymentsQuery->where('status', $status);
        }
        
        // Payment Method Filtering
        if ($method = $request->query('method')) {
            $paymentsQuery->where('payment_method', 'like', '%' . $method . '%');
        }

        $payments = $paymentsQuery->orderBy('created_at', 'desc')->paginate($perPage); 
        $payments->appends($request->query());
        
        return view('admin.payments.index', compact('payments'));
    }

    /**
     * Display a paginated listing exclusively focused on failed financial attempts for reconciliation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function failed(Request $request): View
    {
        $perPage = 15;
        $paymentsQuery = Payment::with(['user', 'payable'])->where('status', 'failed');

        if ($search = $request->query('search')) {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('id', $search)
                    ->orWhere('transaction_id', 'like', '%' . $search . '%');
            });
        }

        $payments = $paymentsQuery->orderBy('created_at', 'desc')->paginate($perPage); 
        $payments->appends($request->query());
        
        $pageTitle = __('Failed Payments'); 

        return view('admin.payments.index', compact('payments', 'pageTitle'));
    }

    /**
     * Show the form for creating a new manual payment entry.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $payment = new Payment();
        $users = User::select('id', 'name', 'email')->get();
        $subscriptions = Subscription::all();
        
        return view('admin.payments.form', compact('payment', 'users', 'subscriptions'));
    }

    /**
     * Store a manually initialized payment record and its polymorphic mapping.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'payable_id'     => 'required|exists:subscriptions,id', 
            'amount'         => 'required|numeric|min:0',
            'currency'       => 'required|string|size:3',
            'payment_method' => 'required|string|max:255', 
            'status'         => 'required|in:pending,completed,failed,refunded', 
            'transaction_id' => 'nullable|string|max:255',
            'paid_at'        => 'nullable|date',
        ]);

        // Explicitly hydrate the polymorphic relationship mapping
        $validated['payable_type'] = Subscription::class;

        Payment::create($validated);

        return redirect()->route('admin.payments.index')
            ->with('success', __('Payment recorded successfully.'));
    }

    /**
     * Show the form for editing an existing financial record.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\View\View
     */
    public function edit(Payment $payment): View
    {
        $users = User::select('id', 'name', 'email')->get();
        $subscriptions = Subscription::all();
        
        return view('admin.payments.form', compact('payment', 'users', 'subscriptions'));
    }

    /**
     * Update an existing financial record and maintain polymorphic integrity.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'payable_id'     => 'required|exists:subscriptions,id',
            'amount'         => 'required|numeric|min:0',
            'currency'       => 'required|string|size:3',
            'payment_method' => 'required|string|max:255',
            'status'         => 'required|in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string|max:255',
            'paid_at'        => 'nullable|date',
        ]);

        $validated['payable_type'] = Subscription::class;

        $payment->update($validated);

        return redirect()->route('admin.payments.index')
            ->with('success', __('Payment details updated successfully.'));
    }

    /**
     * Remove a financial record from the ledger.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();
        
        return redirect()->route('admin.payments.index')
            ->with('success', __('Payment record removed successfully.'));
    }
}
