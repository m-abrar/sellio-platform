<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\Auto;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Services\Partner\AutoService;
use App\Http\Requests\Partner\AutoRequest;
use App\Http\Resources\AutoResource;
use Illuminate\Http\RedirectResponse;
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
        $autos = Auto::where('user_id', Auth::id())
            ->with(['category', 'brand', 'location'])
            ->latest()
            ->paginate(10);

        return $this->successResponse(AutoResource::collection($autos));
    }

    public function create() {
        return $this->successResponse($this->getFormData());
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

    public function edit(Auto $auto) {
        $this->authorizeOwner($auto);
        $data = array_merge($this->getFormData(), ['auto' => $auto]);

        return $this->successResponse(null, 'Success');
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

    public function destroy(Auto $auto)
    {
        $this->authorizeOwner($auto);
        $auto->delete();

        if (request()->wantsJson()) {
            return $this->successResponse(null, __('Vehicle deleted successfully.')
            );
        }

        return $this->successResponse(null, __('Vehicle deleted successfully.'));
    }

    /**
     * Get the necessary data for the auto creation/edit forms.
     *
     * @return array
     */
    protected function getFormData(): array
    {
        return [
            'categories' => Category::where('is_auto', true)->get(),
            'brands'     => Brand::where('is_auto', true)->get(),
            'types'      => Type::where('is_auto', true)->get(),
            'locations'  => Location::all(), // Locations are usually shared
        ];
    }

    protected function authorizeOwner(Auto $auto): void
    {
        if (Auth::id() !== $auto->user_id) {
            abort(403, __('Unauthorized access to this vehicle.'));
        }
    }
}
