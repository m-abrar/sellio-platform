<?php
// File: apps/backend/app/Http/Controllers/Api/V1/Dashboard/Partner/PayoutMethodController.php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\PayoutMethod;
use App\Http\Resources\PayoutMethodResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayoutMethodController extends Controller
{
    /**
     * Display a listing of the partner's payout methods.
     */
    public function index(): JsonResponse
    {
        $payoutMethods = Auth::user()->payoutMethods()->orderBy('is_primary', 'desc')->get();

        return $this->successResponse(PayoutMethodResource::collection($payoutMethods));
    }

    /**
     * Store a newly created payout method in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:bank_transfer,paypal,stripe',
            'details' => 'required|array',
        ]);

        $user = Auth::user();
        
        // If this is the user's first payout method, make it primary
        $isPrimary = $user->payoutMethods()->count() === 0;

        $payoutMethod = $user->payoutMethods()->create([
            'type' => $validated['type'],
            'details' => $validated['details'],
            'is_primary' => $isPrimary,
        ]);

        return $this->successResponse(
            new PayoutMethodResource($payoutMethod),
            __('Payout method added successfully.')
        );
    }

    /**
     * Remove the specified payout method from storage.
     */
    public function destroy(PayoutMethod $payoutMethod): JsonResponse
    {
        if ($payoutMethod->user_id !== Auth::id()) {
            abort(403, __('Unauthorized access to this payout method.'));
        }

        $payoutMethod->delete();

        return $this->successResponse(
            null,
            __('Payout method removed successfully.')
        );
    }

    /**
     * Mark the specified payout method as primary.
     */
    public function setPrimary(PayoutMethod $payoutMethod): JsonResponse
    {
        if ($payoutMethod->user_id !== Auth::id()) {
            abort(403, __('Unauthorized access to this payout method.'));
        }

        $payoutMethod->update(['is_primary' => true]);

        return $this->successResponse(
            new PayoutMethodResource($payoutMethod),
            __('Payout method marked as primary.')
        );
    }
}
