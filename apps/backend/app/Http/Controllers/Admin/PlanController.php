<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PlanRequest;
use App\Models\Plan;
use App\Services\Admin\PlanManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class PlanController
 * Orchestrates the administrative lifecycle of subscription plans, coordinating 
 * pricing tiers, resource quotas, and specialized feature access.
 */
class PlanController extends Controller
{
    /**
     * @var PlanManagementService
     */
    protected PlanManagementService $planService;

    /**
     * PlanController constructor.
     *
     * @param PlanManagementService $planService
     */
    public function __construct(PlanManagementService $planService)
    {
        $this->planService = $planService;
    }

    /**
     * Display a filtered and paginated listing of all subscription tiers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $plans = $this->planService->getPlans($request->only(['search', 'billing_period']));

        return view('admin.plans.index', compact('plans'));
    }

    /**
     * Show the interface for initializing a new subscription plan.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $plan = new Plan();
        return view('admin.plans.form', compact('plan'));
    }

    /**
     * Store a newly created subscription plan and normalize its quota parameters.
     *
     * @param  \App\Http\Requests\Admin\PlanRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(PlanRequest $request): RedirectResponse
    {
        $this->planService->createPlan($request->validated());
        
        return redirect()->route('admin.plans.index')
            ->with('success', __('Subscription plan created successfully.'));
    }

    /**
     * Show the interface for editing an existing subscription plan.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\View\View
     */
    public function edit(Plan $plan): View
    {
        return view('admin.plans.form', compact('plan'));
    }

    /**
     * Update an existing subscription plan and synchronize its resource quotas.
     *
     * @param  \App\Http\Requests\Admin\PlanRequest  $request
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(PlanRequest $request, Plan $plan): RedirectResponse
    {
        $this->planService->updatePlan($plan, $request->validated());

        return redirect()->route('admin.plans.index')
            ->with('success', __('Subscription plan updated successfully.'));
    }

    /**
     * Remove a subscription plan from the marketplace.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Plan $plan): RedirectResponse
    {
        $this->planService->deletePlan($plan);
        
        return redirect()->route('admin.plans.index')
            ->with('success', __('Subscription plan deleted successfully.'));
    }
}
