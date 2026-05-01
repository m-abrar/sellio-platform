<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plan;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $query = Plan::query();

        if ($request->filled('name')) {
            $search = $request->input('name');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('billing_period')) {
            $period = $request->input('billing_period');
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

    public function create() {
        $plan = new Plan();
        return view('admin.plans.form', compact('plan'));
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title' => 'required|string|max:60',
            'description' => 'nullable|string|max:500',
            'label_text' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:monthly,annually', 
            'max_listings' => 'nullable|integer|min:0', 
            'max_featured_listings' => 'nullable|integer|min:0',
            'max_addons' => 'nullable|integer|min:0',
            'listing_duration' => 'required|integer|min:1',
            'analytics_access' => 'required|in:none,basic,advanced', 
            
            'is_active' => 'sometimes|boolean', 
            'is_featured' => 'sometimes|boolean',
            'is_popular' => 'sometimes|boolean',
            'priority_support' => 'sometimes|boolean',
            'custom_branding' => 'sometimes|boolean',
        ]);

        $data['is_active'] = $request->boolean('is_active');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_popular'] = $request->boolean('is_popular');
        $data['priority_support'] = $request->boolean('priority_support');
        $data['custom_branding'] = $request->boolean('custom_branding');
        
        foreach (['max_listings', 'max_featured_listings', 'max_addons'] as $field) {
            if (empty($data[$field])) {
                $data[$field] = null;
            }
        }

        $plan = Plan::create($data);
        
        return redirect()->route('admin.plans.index')->with('success', 'Plan created successfully.');
    }

    public function edit(Plan $plan) {
        return view('admin.plans.form', compact('plan'));
    }

    public function update(Request $request, Plan $plan) {
        $data = $request->validate([
            'title' => 'required|string|max:60',
            'description' => 'nullable|string|max:500',
            'label_text' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:monthly,annually', 
            'max_listings' => 'nullable|integer|min:0', 
            'max_featured_listings' => 'nullable|integer|min:0',
            'max_addons' => 'nullable|integer|min:0',
            'listing_duration' => 'required|integer|min:1',
            'analytics_access' => 'required|in:none,basic,advanced', 
            'is_active' => 'sometimes|boolean', 
            'is_featured' => 'sometimes|boolean',
            'is_popular' => 'sometimes|boolean',
            'priority_support' => 'sometimes|boolean',
            'custom_branding' => 'sometimes|boolean',
        ]);

        $data['is_active'] = $request->boolean('is_active');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_popular'] = $request->boolean('is_popular');
        $data['priority_support'] = $request->boolean('priority_support');
        $data['custom_branding'] = $request->boolean('custom_branding');
        
        foreach (['max_listings', 'max_featured_listings', 'max_addons'] as $field) {
            if (empty($data[$field])) {
                $data[$field] = null;
            }
        }
        
        $plan->update($data);

        return redirect()->route('admin.plans.index')->with('success', 'Plan updated successfully.');
    }

    public function destroy(Plan $plan) {
        $plan->delete();
        return redirect()->route('admin.plans.index')->with('success', 'Plan deleted successfully.');
    }
}
