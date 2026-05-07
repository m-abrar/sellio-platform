<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;
use Illuminate\Support\Carbon;

/**
 * Class SubscriptionController
 * Orchestrates administrative oversight for user subscriptions, coordinating 
 * plan assignments, renewal cycles, and platform access control.
 */
class SubscriptionController extends Controller
{
    /**
     * Display a filtered and paginated listing of all platform subscriptions.
     *
     * @param  string|null  $status
     * @return \Illuminate\View\View
     */
    public function index(?string $status = null): View
    {
        $subscriptions = Subscription::query()
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(request('user'), function ($query, $user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('name', 'like', '%' . $user . '%');
                });
            })
            ->with(['user', 'plan'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

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
        $users = User::select('id', 'name', 'email')->get();
        $plans = Plan::select('id', 'title', 'price')->get();
        
        return view('admin.subscriptions.form', compact('subscription', 'users', 'plans'));
    }

    /**
     * Store a newly created subscription and initialize its platform access.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'plan_id'   => 'required|exists:plans,id',
            'name'      => 'required|string|max:255',
            'status'    => ['required', Rule::in([
                Subscription::STATUS_ACTIVE, 
                Subscription::STATUS_ON_TRIAL, 
                Subscription::STATUS_PAST_DUE, 
                Subscription::STATUS_CANCELLED, 
                Subscription::STATUS_EXPIRED
            ])],
            'starts_at' => 'required|date',
            'ends_at'   => 'nullable|date|after_or_equal:starts_at', 
        ]);

        Subscription::create($data);

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
        // Standardize renewal window to 1 month from current expiry or today
        $newEndsAt = $subscription->ends_at ? 
                        Carbon::parse($subscription->ends_at)->addMonth() : 
                        now()->addMonth();
        
        $subscription->update([
            'ends_at' => $newEndsAt,
            'status'  => Subscription::STATUS_ACTIVE,
        ]);

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
        $users = User::select('id', 'name', 'email')->get();
        $plans = Plan::select('id', 'title', 'price')->get();
        $subscription->load('payments');
        
        return view('admin.subscriptions.form', compact('subscription', 'users', 'plans'));
    }

    /**
     * Update an existing subscription configuration and synchronize access parameters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Subscription  $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Subscription $subscription): RedirectResponse
    {
        $data = $request->validate([
            'user_id'   => 'required|exists:users,id',
            'plan_id'   => 'required|exists:plans,id',
            'name'      => 'required|string|max:255',
            'status'    => ['required', Rule::in([
                Subscription::STATUS_ACTIVE, 
                Subscription::STATUS_ON_TRIAL, 
                Subscription::STATUS_PAST_DUE, 
                Subscription::STATUS_CANCELLED, 
                Subscription::STATUS_EXPIRED
            ])],
            'starts_at' => 'required|date',
            'ends_at'   => 'nullable|date|after_or_equal:starts_at',
        ]);

        $subscription->update($data);

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
        $subscription->delete();
        
        return redirect()->route('admin.subscriptions.index')
            ->with('success', __('Subscription record removed successfully.'));
    }
}
