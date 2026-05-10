<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\SubscriptionQuota;
use App\Models\User;
use App\Services\Admin\QuotaManagementService;
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
     * @var QuotaManagementService
     */
    protected QuotaManagementService $quotaService;

    /**
     * SubscriptionQuotaController constructor.
     *
     * @param QuotaManagementService $quotaService
     */
    public function __construct(QuotaManagementService $quotaService)
    {
        $this->quotaService = $quotaService;
    }

    /**
     * Display a filtered and paginated listing of all subscription usage quotas.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $quotas = $this->quotaService->getQuotas($request->only(['user_id', 'plan_id']));
        
        // Performance: Only fetch users who actually have a subscription quota to prevent memory bloat
        // RECOMMENDATION: Replace with AJAX search for true scalability
        $users  = User::whereHas('subscriptions.quota')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->limit(100) 
            ->get();

        $plans  = Plan::select('id', 'title')->orderBy('title')->get();

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

        $this->quotaService->updateUsage($subscriptionQuota, $validated);

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
        $this->quotaService->resetUsage($subscriptionQuota);

        return back()->with('success', __('Subscription resource consumption has been reset to zero.'));
    }
}
