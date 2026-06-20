<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchAutoRequest;
use App\Models\Auto;
use App\Services\AutoService;
use Illuminate\Contracts\View\View;

/**
 * Class AutoController
 * * Handles the display and searching of automobile listings.
 * * @package App\Http\Controllers
 */
class AutoController extends Controller
{
    /**
     * @var AutoService
     */
    protected AutoService $autoService;

    /**
     * AutoController constructor.
     * * @param AutoService $autoService
     */
    public function __construct(AutoService $autoService)
    {
        $this->autoService = $autoService;
    }

    /**
     * Display the initial listing or search results.
     * * @param SearchAutoRequest $request
     * @return View
     */
    public function index(SearchAutoRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform the search logic and return the filtered view.
     * * @param SearchAutoRequest $request
     * @return View
     */
    public function search(SearchAutoRequest $request): View
    {
        $data = $this->autoService->getSearchPageData($request->validated());

        return view('frontend.autos.index', $data);
    }

    /**
     * Display a specific auto listing with related suggestions.
     * * @param Auto $auto
     * @return View
     */
    public function show(Auto $auto): View
    {
        if (!$auto->is_published || !in_array($auto->status, ['active', 'approved', 'published']) || is_null($auto->approved_at)) {
            abort(404);
        }

        $auto->load(['category', 'location', 'user', 'tags', 'media']);

        $relatedAutos = $this->autoService->getRelatedAutos($auto);

        return view('frontend.autos.show.vehicle-detail', [
            'auto' => $auto,
            'relatedAutos' => $relatedAutos,
        ]);
    }
}
