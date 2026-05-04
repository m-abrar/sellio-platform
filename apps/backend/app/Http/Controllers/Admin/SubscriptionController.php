<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubscriptionController extends Controller
{
    public function index($status = null)
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
            ->paginate(15);

        return view('admin.subscriptions.index', compact('subscriptions', 'status'));
    }

    public function create()
    {
        $subscription = new Subscription();
        $users = User::all();
        $plans = Plan::all();
        return view('admin.subscriptions.form', compact('subscription', 'users', 'plans'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'name' => 'required|string|max:255',
            'status' => ['required', Rule::in([
                Subscription::STATUS_ACTIVE, 
                Subscription::STATUS_ON_TRIAL, 
                Subscription::STATUS_PAST_DUE, 
                Subscription::STATUS_CANCELLED, 
                Subscription::STATUS_EXPIRED
            ])],
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at', 
        ]);

        Subscription::create($data);

        return redirect()->route('admin.subscriptions.index')->with('success', 'Subscription created successfully.');
    }

    public function renew(Subscription $subscription)
    {
        $new_ends_at = $subscription->ends_at ? 
                        $subscription->ends_at->addMonth() : 
                        now()->addMonth();
        
        $subscription->ends_at = $new_ends_at; 
        $subscription->status = Subscription::STATUS_ACTIVE;
        $subscription->save();

        return redirect()->back()->with('success', 'Subscription renewed successfully.');
    }

    public function edit(Subscription $subscription)
    {
        $users = User::all();
        $plans = Plan::all();
        $subscription->load('payments');
        return view('admin.subscriptions.form', compact('subscription', 'users', 'plans'));
    }

    public function update(Request $request, Subscription $subscription)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'name' => 'required|string|max:255',
            'status' => ['required', Rule::in([
                Subscription::STATUS_ACTIVE, 
                Subscription::STATUS_ON_TRIAL, 
                Subscription::STATUS_PAST_DUE, 
                Subscription::STATUS_CANCELLED, 
                Subscription::STATUS_EXPIRED
            ])],
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
        ]);

        $subscription->update($data);

        return redirect()->route('admin.subscriptions.index')->with('success', 'Subscription updated successfully.');
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        return redirect()->route('admin.subscriptions.index')->with('success', 'Subscription deleted successfully.');
    }
}
