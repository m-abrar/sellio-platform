<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyBooking;
use App\Models\Amenity;
use App\Models\Type;
use App\Models\Tag;
use App\Models\Feature;
use App\Models\Category;
use App\Models\Location;
use App\Models\PropertyVisit;
use App\Http\Requests\Admin\PropertyRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\View\View;
use App\Traits\ManagesApproval;
use App\Services\Admin\PropertyManagementService;

/**
 * Class PropertyController
 * Orchestrates the administrative lifecycle of the Real Estate vertical, managing 
 * hierarchical features, neighborhood relationships, and complex seasonal pricing algorithms.
 */
class PropertyController extends Controller
{
    use ManagesApproval;

    /**
     * The model class associated with the approval trait.
     *
     * @var string
     */
    protected $modelClass = Property::class;

    /**
     * @var PropertyManagementService
     */
    protected $propertyService;

    /**
     * PropertyController constructor.
     *
     * @param PropertyManagementService $propertyService
     */
    public function __construct(PropertyManagementService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    /**
     * Display a filtered and paginated listing of all properties.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->forType('property')->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->forType('property')->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();

        $properties = Property::query()
            ->when($request->query('name'), fn($q) => $q->where('title', 'like', '%' . $request->query('name') . '%'))
            ->when($request->query('location_id'), fn($q) => $q->where('location_id', $request->query('location_id')))
            ->when($request->query('category_id'), fn($q) => $q->where('category_id', $request->query('category_id')))
            ->when($request->query('only_active'), fn($q) => $q->where('is_published', 1))
            ->with(['location', 'category', 'user'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.properties.index', compact('properties', 'locations', 'categories'));
    }

    /**
     * Show the interface for initializing a new property listing.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $amenities  = Amenity::active()->forType('property')->get();
        $features   = Feature::active()->forType('property')->get();
        $types      = Type::active()->forType('property')->get();
        $tags       = Tag::active()->forType('property')->get();
        $categories = Category::active()->forType('property')->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->forType('property')->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();
        $property   = new Property();

        return view('admin.properties.form', compact('property', 'amenities', 'features', 'types', 'tags', 'categories', 'locations'));
    }

    /**
     * Store a newly created property and its complex relational data.
     *
     * @param  \App\Http\Requests\Admin\PropertyRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(PropertyRequest $request): RedirectResponse
    {
        try {
            $property = $this->propertyService->saveProperty($request->validated());

            return redirect()->route('admin.properties.edit', $property->id)
                ->with('success', __('Property initialized successfully.'));

        } catch (\Exception $e) {
            Log::error("Property Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', $e->getMessage() ?: __('Synchronization failure.'));
        }
    }

    /**
     * Show the comprehensive edit interface, including availability calendars and interaction metrics.
     *
     * @param  \App\Models\Property  $property
     * @return \Illuminate\View\View
     */
    public function edit(Property $property): View
    {
        $property->images = json_decode($property->images, true) ?? [];
        $property->load(['features', 'neighborhoods', 'prices']);

        $amenities  = Amenity::active()->forType('property')->get();
        $features   = Feature::active()->forType('property')->get();
        $tags       = Tag::active()->forType('property')->get();
        $types      = Type::active()->forType('property')->get();
        $categories = Category::active()->forType('property')->get();
        if ($categories->isEmpty()) $categories = Category::active()->get();

        $locations = Location::active()->forType('property')->get();
        if ($locations->isEmpty()) $locations = Location::active()->get();

        $statusColors = ['confirmed' => '#ef4444', 'pending' => '#fde68a'];
        
        $bookings = PropertyBooking::where('property_id', $property->id)->get()->map(function ($b) use ($statusColors) {
            return [
                'start' => Carbon::parse($b->start_date)->toDateString(),
                'end'   => Carbon::parse($b->end_date)->toDateString(),
                'color' => $statusColors[$b->status] ?? '#e5e7eb',
            ];
        });

        $recentBookings = PropertyBooking::where('property_id', $property->id)->with('user')->latest()->take(5)->get();
        $recentVisits   = PropertyVisit::where('property_id', $property->id)->latest()->take(5)->get();

        return view('admin.properties.form', compact('property', 'bookings', 'amenities', 'features', 'tags', 'types', 'categories', 'locations', 'recentBookings', 'recentVisits'));
    }

    /**
     * Update an existing property and synchronize its complex data structure.
     *
     * @param  \App\Http\Requests\Admin\PropertyRequest  $request
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(PropertyRequest $request, Property $property): RedirectResponse
    {
        try {
            $this->propertyService->saveProperty($request->validated(), $property);

            return redirect()->route('admin.properties.index')->with('success', __('Property updated successfully.'));

        } catch (\Exception $e) {
            Log::error("Property Update Failure: {$e->getMessage()}", ['id' => $property->id]);
            return back()->withInput()->with('error', $e->getMessage() ?: __('Update synchronization failure.'));
        }
    }

    /**
     * Replicate a property as a draft copy, including all taxonomies, features, and neighborhood data.
     *
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\RedirectResponse
     */
    public function duplicate(Property $property): RedirectResponse
    {
        try {
            $newProperty = $this->propertyService->duplicateProperty($property);

            return redirect()->route('admin.properties.edit', $newProperty->id)
                ->with('success', __('Property duplicated as draft successfully.'));

        } catch (\Exception $e) {
            Log::error("Property Duplication Failure: {$e->getMessage()}", ['id' => $property->id]);
            return back()->with('error', __('Duplication failure.'));
        }
    }

    /**
     * Remove a property listing from the active database.
     *
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Property $property): RedirectResponse
    {
        $property->delete();
        return redirect()->route('admin.properties.index')->with('success', __('Property deleted successfully.'));
    }

}
