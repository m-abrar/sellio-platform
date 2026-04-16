<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TypeResource;
use App\Models\Type;
use App\Services\TypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApiTypeController extends Controller
{
    protected TypeService $typeService;

    public function __construct(TypeService $typeService)
    {
        $this->typeService = $typeService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $types = $this->typeService->getTypeList(
            $request->only(['is_published', 'type', 'search'])
        );

        return TypeResource::collection($types);
    }

    public function show(string $slug): JsonResponse
    {
        $type = Type::where('slug', $slug)
            ->active() // Ensure your Model has this scope
            ->with(['media'])
            ->firstOrFail();

        return $this->successResponse(
            new TypeResource($type),
            null,
            200,
            ['related_count' => $this->typeService->getRelatedCount($type)]
        );
    }
}
