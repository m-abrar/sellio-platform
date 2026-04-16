<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubscriptionQuota;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Plan;

class SubscriptionQuotaController extends Controller
{
    public function index(Request $request)
    {
        $query = SubscriptionQuota::with(['subscription.plan', 'subscription.user']);

        if ($request->filled('user_id')) {
            $query->whereHas('subscription.user', function($q) use ($request) {
                $q->where('id', $request->user_id);
            });
        }

        if ($request->filled('plan_id')) {
            $query->whereHas('subscription.plan', function($q) use ($request) {
                $q->where('id', $request->plan_id);
            });
        }

        $quotas = $query->latest()->paginate(15);
        $users = User::all();
        $plans = \App\Models\Plan::all();

        return view('admin.subscription-quotas.index', compact('quotas', 'users', 'plans'));
    }

    public function edit(SubscriptionQuota $subscriptionQuota)
    {
        $plans = Plan::all();

        return view('admin.subscription-quotas.form', compact('subscriptionQuota', 'plans'));
    }

    public function update(Request $request, SubscriptionQuota $subscriptionQuota)
    {
        $request->validate([
            'listings_used' => 'required|integer|min:0',
            'featured_used' => 'required|integer|min:0',
        ]);

        $subscriptionQuota->update([
            'listings_used' => $request->listings_used,
            'featured_used' => $request->featured_used,
        ]);

        return redirect()->route('admin.subscription-quotas.index')->with('success', 'Quota updated successfully.');
    }

    public function reset(SubscriptionQuota $subscriptionQuota)
    {
        $subscriptionQuota->update([
            'listings_used' => 0,
            'featured_used' => 0,
        ]);

        return redirect()->back()->with('success', 'Quota reset successfully.');
    }
}
