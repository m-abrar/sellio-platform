<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class PlanController
 * Orchestrates the administrative lifecycle of subscription plans, coordinating 
 * pricing tiers, resource quotas, and specialized feature access for marketplace partners.
 */
class PlanController extends Controller
{
    /**
     * Display a filtered and paginated listing of all subscription tiers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $query = Plan::query();

        // Semantic Search by Title or Description
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Billing Period Filtering
        if ($request->filled('billing_period')) {
            $period = $request->query('billing_period');
            if (in_array($period, ['monthly', 'annually'])) {
                $query->where('billing_period', $period);
            }
        }

        $plans = $query
            ->orderBy('price', 'asc')
            ->paginate(15) 
            ->withQueryString(); 

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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePlan($request);
        $data = $this->normalizePlanData($request, $validated);

        Plan::create($data);
        
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
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $validated = $this->validatePlan($request);
        $data = $this->normalizePlanData($request, $validated);
        
        $plan->update($data);

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
        $plan->delete();
        
        return redirect()->route('admin.plans.index')
            ->with('success', __('Subscription plan deleted successfully.'));
    }

    /**
     * Validate the plan's configuration parameters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    protected function validatePlan(Request $request): array
    {
        return $request->validate([
            'title'                  => 'required|string|max:60',
            'description'            => 'nullable|string|max:500',
            'label_text'             => 'nullable|string|max:50',
            'price'                  => 'required|numeric|min:0',
            'billing_period'         => 'required|in:monthly,annually', 
            'max_listings'           => 'nullable|integer|min:0', 
            'max_featured_listings'  => 'nullable|integer|min:0',
            'max_addons'             => 'nullable|integer|min:0',
            'listing_duration'       => 'required|integer|min:1',
            'analytics_access'       => 'required|in:none,basic,advanced', 
            'is_active'              => 'sometimes|boolean', 
            'is_featured'            => 'sometimes|boolean',
            'is_popular'             => 'sometimes|boolean',
            'priority_support'       => 'sometimes|boolean',
            'custom_branding'        => 'sometimes|boolean',
        ]);
    }

    /**
     * Normalize plan data, ensuring proper boolean casting and nullification of unlimited quotas.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $data
     * @return array
     */
    protected function normalizePlanData(Request $request, array $data): array
    {
        $data['is_active']        = $request->boolean('is_active');
        $data['is_featured']      = $request->boolean('is_featured');
        $data['is_popular']       = $request->boolean('is_popular');
        $data['priority_support'] = $request->boolean('priority_support');
        $data['custom_branding']  = $request->boolean('custom_branding');
        
        // Normalize empty quotas to NULL for "Unlimited" handling
        foreach (['max_listings', 'max_featured_listings', 'max_addons'] as $field) {
            if (empty($data[$field])) {
                $data[$field] = null;
            }
        }

        return $data;
    }
}
