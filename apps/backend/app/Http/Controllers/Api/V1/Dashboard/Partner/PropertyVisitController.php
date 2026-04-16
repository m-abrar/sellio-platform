<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Models\PropertyVisit;
use App\Services\Partner\PropertyVisitService;
use App\Http\Resources\PropertyVisitResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

/**
 * Class PropertyVisitController
 * * Manages property visit requests for authenticated partners.
 * * @package App\Http\Controllers\Dashboard\Partner
 */
class PropertyVisitController extends Controller
{
    /**
     * @var PropertyVisitService
     */
    protected $visitService;

    /**
     * PropertyVisitController constructor.
     *
     * @param PropertyVisitService $visitService
     */
    public function __construct(PropertyVisitService $visitService)
    {
        $this->visitService = $visitService;
    }

    /**
     * Display a listing of all property visits associated with the partner's properties.
     *
     * @return View
     */
    public function index() {
        $propertyVisits = $this->visitService->getPartnerVisits(Auth::user());

        return $this->successResponse(PropertyVisitResource::collection($propertyVisits));
    }

    /**
     * Display the specified property visit details.
     *
     * @param PropertyVisit $propertyVisit
     * @return View|RedirectResponse
     */
    public function show(PropertyVisit $propertyVisit): mixed
    {
        if (!$this->visitService->authorizeVisit(Auth::user(), $propertyVisit)) {
            abort(403, __('Unauthorized action.'));
        }

        $propertyVisit->load(['property', 'user']);

        // Mark as viewed if not already viewed
        if (!$propertyVisit->viewed_at) {
            $propertyVisit->update(['viewed_at' => now()]);
        }

        return $this->successResponse(new PropertyVisitResource($propertyVisit));
    }
}
