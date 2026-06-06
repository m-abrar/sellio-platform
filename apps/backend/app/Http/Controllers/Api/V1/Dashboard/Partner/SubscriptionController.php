<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Http\Resources\SubscriptionResource;
use Illuminate\Http\Request;
use App\Http\Requests\Partner\StoreSubscriptionRequest;
use App\Models\Plan;
use App\Models\Payment;
use Illuminate\Support\Facades\DB; 
use Illuminate\Support\Facades\Auth;
use App\Events\PlanSubscribed;
use App\Events\PlanUpgraded; 
use App\Events\PlanDowngraded; 
use Illuminate\Support\Facades\Log;
use App\Services\SubscriptionService;
use App\Services\SubscriptionCheckoutService;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Auth::user()->subscriptions()->with('plan')->get();

        return $this->successResponse(SubscriptionResource::collection($subscriptions));
    }

    public function confirmCheckout(
        Request $request,
        SubscriptionCheckoutService $checkoutService,
        SubscriptionService $service,
    ) {
        $request->validate([
            'session_id' => ['required', 'string', 'max:255'],
        ]);

        try {
            $plan = $checkoutService->confirmCheckoutSession(
                Auth::user(),
                $request->string('session_id')->toString(),
            );

            $result = $service->subscribe(Auth::user(), $plan);

            return $this->successResponse([
                'checkout_url' => null,
            ], $result['message']);
        } catch (\Exception $e) {
            Log::error('Subscription checkout confirmation error: ' . $e->getMessage());

            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function checkout(
        StoreSubscriptionRequest $request,
        SubscriptionCheckoutService $checkoutService,
        SubscriptionService $service,
    ) {
        try {
            $plan = Plan::findOrFail($request->plan_id);

            if ($plan->price > 0 && $checkoutService->isStripeCheckoutAvailable()) {
                $checkoutUrl = $checkoutService->createCheckoutSession(Auth::user(), $plan);

                return $this->successResponse([
                    'checkout_url' => $checkoutUrl,
                ], __('Redirecting to secure checkout.'));
            }

            $result = $service->subscribe(Auth::user(), $plan);

            return $this->successResponse([
                'checkout_url' => null,
            ], $result['message']);
        } catch (\Exception $e) {
            Log::error('Subscription checkout error: ' . $e->getMessage());
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    public function store(StoreSubscriptionRequest $request, SubscriptionService $service)
    {
        try {
            $plan = Plan::findOrFail($request->plan_id);
            $result = $service->subscribe(Auth::user(), $plan);
            
            return $this->successResponse(null, $result['message']);
        } catch (\Exception $e) {
            Log::error('Subscription store error: ' . $e->getMessage());
            return $this->errorResponse($e->getMessage(), 422);
        }
    }
    
    public function destroy(Subscription $subscription)
    {
        if ($subscription->user_id !== Auth::id()) {
            abort(403, __('Unauthorized access to this subscription.'));
        }

        $subscription->forceFill([
            'status' => Subscription::STATUS_CANCELLED,
            'ends_at' => now(),
        ])->save();

        return $this->successResponse(null, __('Subscription cancelled successfully.'));
    }

    public function scheduleDowngrade(StoreSubscriptionRequest $request)
    {

        $user = Auth::user();
        $newPlan = Plan::findOrFail($request->plan_id);
        
        $currentSubscription = $user->subscription('default')->with('plan')->first();

        if (!$currentSubscription || $currentSubscription->ends_at === null) {
            return $this->errorResponse('You do not have an active, non-scheduled subscription to downgrade.', 422);
        }

        if ($newPlan->price >= $currentSubscription->plan->price) {
            return $this->errorResponse('The selected plan is not a downgrade or is the same price. Please use the upgrade feature if needed.', 422);
        }

        try {
            DB::transaction(function () use ($currentSubscription, $newPlan) {
                $currentSubscription->update([
                    'scheduled_plan_id' => $newPlan->id,
                ]);
                
            });

            PlanDowngraded::dispatch($user, $newPlan, $currentSubscription);
            
            return $this->successResponse(null, "Your subscription change to the **{$newPlan->title}** plan is scheduled. It will take effect on **{$currentSubscription->ends_at->toFormattedDateString()}**."
            );

        } catch (\Exception $e) {
            Log::error('Subscription downgrade scheduling error: ' . $e->getMessage());
            return $this->errorResponse('Failed to schedule downgrade. Please try again.');
        }
    }
}
