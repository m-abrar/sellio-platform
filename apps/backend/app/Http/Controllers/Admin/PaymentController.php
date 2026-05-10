<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use App\Http\Requests\Admin\StorePaymentRequest;
use App\Services\Admin\PaymentManagementService;
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
     * @var PaymentManagementService
     */
    protected PaymentManagementService $paymentService;

    /**
     * PaymentController constructor.
     *
     * @param PaymentManagementService $paymentService
     */
    public function __construct(PaymentManagementService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Display a filtered and paginated listing of all platform transactions.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $filters = $request->only(['search', 'status', 'method']);
        $payments = $this->paymentService->getPayments($filters);
        
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
        $filters = array_merge($request->only(['search', 'method']), ['status' => 'failed']);
        $payments = $this->paymentService->getPayments($filters);
        
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
        
        // Performance: Cap user selection to prevent memory bloat
        // In a production environment with >10k users, this should be replaced by an Ajax-based search.
        $users = User::select('id', 'name', 'email')->orderBy('name')->limit(100)->get();
        
        // Performance: Only show recent subscriptions for manual mapping
        $subscriptions = Subscription::with('plan')->latest()->limit(50)->get();
        
        return view('admin.payments.form', compact('payment', 'users', 'subscriptions'));
    }

    /**
     * Store a manually initialized payment record and its polymorphic mapping.
     *
     * @param  \App\Http\Requests\Admin\StorePaymentRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StorePaymentRequest $request): RedirectResponse
    {
        $this->paymentService->createPayment($request->validated());

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
        // Performance: Cap user selection to prevent memory bloat
        $users = User::select('id', 'name', 'email')->orderBy('name')->limit(100)->get();
        
        // Performance: Only show recent subscriptions for manual mapping
        $subscriptions = Subscription::with('plan')->latest()->limit(50)->get();
        
        return view('admin.payments.form', compact('payment', 'users', 'subscriptions'));
    }

    /**
     * Update an existing financial record and maintain polymorphic integrity.
     *
     * @param  \App\Http\Requests\Admin\StorePaymentRequest  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(StorePaymentRequest $request, Payment $payment): RedirectResponse
    {
        $this->paymentService->updatePayment($payment, $request->validated());

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
        $this->paymentService->deletePayment($payment);
        
        return redirect()->route('admin.payments.index')
            ->with('success', __('Payment record removed successfully.'));
    }
}
