<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchClassifiedRequest;
use App\Models\Classified;
use App\Services\ClassifiedManagementService;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Route;

/**
 * Class ClassifiedController
 *
 * Manages discovery, filtering, and detailed viewing of classified listings.
 */
class ClassifiedController extends Controller
{
    /**
     * @var ClassifiedManagementService
     */
    protected $classifiedService;

    /**
     * ClassifiedController constructor.
     *
     * @param ClassifiedManagementService $classifiedService
     */
    public function __construct(ClassifiedManagementService $classifiedService)
    {
        $this->classifiedService = $classifiedService;
    }

    /**
     * Display the index page for classifieds.
     *
     * @param Request $request
     * @return View
     */
    public function index(SearchClassifiedRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform an advanced search for classified items.
     *
     * @param Request $request
     * @return View
     */
    public function search(SearchClassifiedRequest $request): View
    {
        $taxonomies = $this->classifiedService->getFilterTaxonomies();
        $classifieds = $this->classifiedService->getPaginatedClassifieds($request->validated());

        return view("frontend.classifieds.index", array_merge($taxonomies, [
            'classifieds'      => $classifieds,
            'currentRouteName' => Route::currentRouteName(),
        ]));
    }

    /**
     * Display a single classified item listing.
     *
     * @param string $slug
     * @return View
     */
    public function show(string $slug): View
    {
        $classified = Classified::where('slug', $slug)
            ->active()
            // Eager load media and relationships
            ->with(['media', 'user', 'category', 'type', 'location', 'tags', 'user.reviews'])
            ->firstOrFail();

        $relatedItems = $this->classifiedService->getRelatedItems($classified);

        return view('frontend.classifieds.show.show', [
            'classified'   => $classified,
            'allPhotos'    => $classified->all_photos, // Using our new attribute
            'related_items' => $relatedItems,
        ]);
    }
}
