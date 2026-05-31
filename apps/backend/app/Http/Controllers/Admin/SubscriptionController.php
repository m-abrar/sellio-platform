<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SubscriptionRequest;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Plan;
use App\Services\Admin\SubscriptionManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class SubscriptionController
 * Orchestrates administrative oversight for user subscriptions, coordinating 
 * plan assignments, renewal cycles, and platform access control.
 */
class SubscriptionController extends Controller
{
    /**
     * @var SubscriptionManagementService
     */
    protected SubscriptionManagementService $subscriptionService;

    /**
     * SubscriptionController constructor.
     *
     * @param SubscriptionManagementService $subscriptionService
     */
    public function __construct(SubscriptionManagementService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Display a filtered and paginated listing of all platform subscriptions.
     *
     * @param  string|null  $status
     * @return \Illuminate\View\View
     */
    public function index(?string $status = null): View
    {
        $filters = array_merge(request()->only(['user']), ['status' => $status]);
        $subscriptions = $this->subscriptionService->getSubscriptions($filters);

        return view('admin.subscriptions.index', compact('subscriptions', 'status'));
    }

    /**
     * Show the interface for initializing a manual subscription for a user.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $subscription = new Subscription();
        
        // RECOMMENDATION: For large datasets, replace these with AJAX search endpoints
        $users = User::select('id', 'name', 'email')->latest()->limit(100)->get();
        $plans = Plan::select('id', 'title', 'price')->get();
        
        return view('admin.subscriptions.form', compact('subscription', 'users', 'plans'));
    }

    /**
     * Store a newly created subscription and initialize its platform access.
     *
     * @param  \App\Http\Requests\Admin\SubscriptionRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(SubscriptionRequest $request): RedirectResponse
    {
        $this->subscriptionService->createSubscription($request->validated());

        return redirect()->route('admin.subscriptions.index')
            ->with('success', __('Subscription initialized successfully.'));
    }

    /**
     * Manually extend the subscription duration by one month.
     *
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function renew(Subscription $subscription): RedirectResponse
    {
        $this->subscriptionService->renewSubscription($subscription);

        return back()->with('success', __('Subscription renewed and access extended successfully.'));
    }

    /**
     * Show the interface for modifying an existing subscription's configuration.
     *
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\View\View
     */
    public function edit(Subscription $subscription): View
    {
        // RECOMMENDATION: For large datasets, replace these with AJAX search endpoints
        $users = User::select('id', 'name', 'email')->latest()->limit(100)->get();
        $plans = Plan::select('id', 'title', 'price')->get();
        $subscription->load(['payments', 'plan', 'user']);
        
        return view('admin.subscriptions.form', compact('subscription', 'users', 'plans'));
    }

    /**
     * Update an existing subscription configuration and synchronize access parameters.
     *
     * @param  \App\Http\Requests\Admin\SubscriptionRequest  $request
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(SubscriptionRequest $request, Subscription $subscription): RedirectResponse
    {
        $this->subscriptionService->updateSubscription($subscription, $request->validated());

        return redirect()->route('admin.subscriptions.index')
            ->with('success', __('Subscription configuration updated successfully.'));
    }

    /**
     * Remove a subscription record and terminate associated platform access.
     *
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Subscription $subscription): RedirectResponse
    {
        $this->subscriptionService->deleteSubscription($subscription);
        
        return redirect()->route('admin.subscriptions.index')
            ->with('success', __('Subscription record removed successfully.'));
    }
}
