<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Plan; 
use App\Http\Resources\PlanResource;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::where('is_active', true)
                     ->orderBy('price')
                     ->get();
                     
        return $this->successResponse(PlanResource::collection($plans));
    }

    public function show(Plan $plan)
    {
        return $this->successResponse(new PlanResource($plan));
    }
}
