<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Plan; 
use App\Http\Resources\PlanResource;
use Illuminate\Http\Request;

/**
 * Class PlanController
 * Orchestrates the API-driven discovery of subscription plans for partners,
 * managing tier retrieval and detailed plan metadata transformation.
 */
class PlanController extends Controller
{
    /**
     * Retrieve a collection of all active subscription plans.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $plans = Plan::where('is_active', true)
                     ->orderBy('price')
                     ->get();
                     
        return $this->successResponse(PlanResource::collection($plans));
    }

    /**
     * Display the specified subscription plan details.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Plan $plan)
    {
        return $this->successResponse(new PlanResource($plan));
    }
}
