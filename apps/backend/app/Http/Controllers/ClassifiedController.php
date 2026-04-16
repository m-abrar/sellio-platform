<?php

namespace App\Http\Controllers;

use App\Models\Classified;
use App\Models\Category;
use App\Models\Location;
use App\Models\Type;
use App\Models\Tag;
use App\Services\ClassifiedManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Contracts\View\View;

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
    public function index(Request $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform an advanced search for classified items.
     *
     * @param Request $request
     * @return View
     */
    public function search(Request $request): View
    {
        $categories = Category::where('is_classified', true)->get();
        $locations  = Location::where('is_classified', true)->get();
        $types      = Type::where('is_classified', true)->get();
        $tags       = Tag::where('is_classified', true)->get();

        $classifieds = $this->classifiedService->getPaginatedClassifieds($request->all());

        return view("frontend.classifieds.index", [
            'classifieds'      => $classifieds,
            'categories'       => $categories,
            'locations'        => $locations,
            'types'            => $types,
            'tags'             => $tags,
            'currentRouteName' => Route::currentRouteName(),
        ]);
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
