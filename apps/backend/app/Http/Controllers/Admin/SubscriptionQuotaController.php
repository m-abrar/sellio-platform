<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\SubscriptionQuota;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class SubscriptionQuotaController
 * Orchestrates administrative oversight for subscription resource usage, coordinating 
 * consumption tracking for listings, featured slots, and manual quota reconciliations.
 */
class SubscriptionQuotaController extends Controller
{
    /**
     * Display a filtered and paginated listing of all subscription usage quotas.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $query = SubscriptionQuota::with(['subscription.plan', 'subscription.user']);

        // User-specific Filtering
        if ($request->filled('user_id')) {
            $query->whereHas('subscription.user', function($q) use ($request) {
                $q->where('id', $request->query('user_id'));
            });
        }

        // Plan-specific Filtering
        if ($request->filled('plan_id')) {
            $query->whereHas('subscription.plan', function($q) use ($request) {
                $q->where('id', $request->query('plan_id'));
            });
        }

        $quotas = $query->latest()->paginate(15)->withQueryString();
        $users  = User::select('id', 'name', 'email')->get();
        $plans  = Plan::select('id', 'title')->get();

        return view('admin.subscription-quotas.index', compact('quotas', 'users', 'plans'));
    }

    /**
     * Show the interface for manually adjusting a subscription's resource consumption.
     *
     * @param  \App\Models\SubscriptionQuota  $subscriptionQuota
     * @return \Illuminate\View\View
     */
    public function edit(SubscriptionQuota $subscriptionQuota): View
    {
        $plans = Plan::select('id', 'title')->get();

        return view('admin.subscription-quotas.form', compact('subscriptionQuota', 'plans'));
    }

    /**
     * Update the resource consumption metrics for a specific subscription.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SubscriptionQuota  $subscriptionQuota
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, SubscriptionQuota $subscriptionQuota): RedirectResponse
    {
        $validated = $request->validate([
            'listings_used' => 'required|integer|min:0',
            'featured_used' => 'required|integer|min:0',
        ]);

        $subscriptionQuota->update($validated);

        return redirect()->route('admin.subscription-quotas.index')
            ->with('success', __('Subscription resource consumption updated successfully.'));
    }

    /**
     * Reset the resource consumption metrics to zero for the specific subscription.
     *
     * @param  \App\Models\SubscriptionQuota  $subscriptionQuota
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reset(SubscriptionQuota $subscriptionQuota): RedirectResponse
    {
        $subscriptionQuota->update([
            'listings_used' => 0,
            'featured_used' => 0,
        ]);

        return back()->with('success', __('Subscription resource consumption has been reset to zero.'));
    }
}
