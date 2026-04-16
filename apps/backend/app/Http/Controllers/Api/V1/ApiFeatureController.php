<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeatureResource;
use App\Models\Feature;
use App\Services\FeatureService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiFeatureController extends Controller
{
    protected FeatureService $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Display a listing of features.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $features = $this->featureService->getFeatureList(
            $request->only(['type', 'is_published', 'search'])
        );

        return FeatureResource::collection($features);
    }

    /**
     * Display the specified feature.
     */
    public function show(string $slug): JsonResponse
    {
        $feature = Feature::where('slug', $slug)
            ->where('is_published', true)
            ->with(['media'])
            ->firstOrFail();

        return $this->successResponse(new FeatureResource($feature));
    }
}
