<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\AutoRequest;
use App\Http\Resources\AutoResource;
use App\Services\Partner\AutoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

/**
 * Class AutoController
 * Manages automotive listings according to the detailed migration schema.
 */
class AutoController extends Controller
{
    protected $autoService;

    public function __construct(AutoService $autoService)
    {
        $this->autoService = $autoService;
    }

    public function index(Request $request)
    {
        $autos = $this->autoService->getPartnerAutos(Auth::user());

        return $this->successResponse(AutoResource::collection($autos));
    }

    public function create() {
        return $this->successResponse($this->autoService->getFormData());
    }

    public function store(AutoRequest $request)
    {
        $auto = $this->autoService->saveAuto(Auth::user(), $request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(null, __('Vehicle listing created successfully.'), [
                'data' => new AutoResource($auto)
            ], 201);
        }

        return $this->successResponse(null, __('Vehicle listing created successfully.'));
    }

    public function edit(\App\Models\Auto $auto) {
        $this->authorizeOwner($auto);
        $data = array_merge($this->autoService->getFormData(), ['auto' => $auto]);

        return $this->successResponse($data);
    }

    public function update(AutoRequest $request, Auto $auto)
    {
        $this->authorizeOwner($auto);
        $this->autoService->saveAuto(Auth::user(), $request->validated(), $auto);

        if ($request->wantsJson()) {
            return $this->successResponse(null, __('Vehicle updated successfully.'), [
                'data' => new AutoResource($auto->fresh())
            ]);
        }

        return $this->successResponse(null, __('Vehicle updated successfully.'));
    }

    public function destroy(\App\Models\Auto $auto)
    {
        $this->authorizeOwner($auto);
        $this->autoService->deleteAuto($auto);

        return $this->successResponse(null, __('Vehicle deleted successfully.'));
    }

    protected function authorizeOwner(\App\Models\Auto $auto): void
    {
        if (Auth::id() !== $auto->user_id) {
            abort(403, __('Unauthorized access to this vehicle.'));
        }
    }
}
