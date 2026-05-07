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
     * Display a filtered and paginated listing of all properties.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $categories = Category::active()->forType('property')->get();
        $locations  = Location::active()->forType('property')->get();

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
        $locations  = Location::active()->forType('property')->get();
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
        $validated = $request->validated();

        try {
            $property = DB::transaction(function () use ($request, $validated) {
                $data = $request->except(['amenities', 'features', 'tags', 'types', 'neighborhoods', 'seasonal_prices']);
                $data['status']      = $request->boolean('status');
                $data['is_featured'] = $request->boolean('is_featured');
                $data['is_rental']   = $request->boolean('is_rental');
                $data['is_sale']     = $request->boolean('is_sale');

                if ($request->has('images')) {
                    $data['images'] = json_encode($request->images, JSON_UNESCAPED_SLASHES);
                }

                $property = Property::create($data);

                // Synchronize Taxonomies
                $property->amenities()->sync($request->input('amenities', []));
                $property->tags()->sync($request->input('tags', []));
                $property->types()->sync($request->input('types', []));

                // Synchronize Hierarchical Features with Pivot Values
                $features = $request->input('features', []);
                $property->features()->sync(
                    collect($features)->filter(fn($v) => !is_null($v) && $v !== '')
                        ->mapWithKeys(fn($v, $id) => [$id => ['value' => $v]])->toArray()
                );

                // Synchronize Neighborhood Metrics
                if ($request->has('neighborhoods')) {
                    foreach ($request->input('neighborhoods') as $nb) {
                        $property->neighborhoods()->create($nb);
                    }
                }

                // Synchronize Seasonal Pricing
                if ($request->has('seasonal_prices')) {
                    foreach ($request->input('seasonal_prices') as $price) {
                        $property->prices()->create($price);
                    }
                }

                return $property;
            });

            return redirect()->route('admin.properties.edit', $property->id)
                ->with('success', __('Property initialized successfully.'));

        } catch (\Exception $e) {
            Log::error("Property Creation Failure: {$e->getMessage()}");
            return back()->withInput()->with('error', __('Synchronization failure.'));
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
        $locations  = Location::active()->forType('property')->get();

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
            DB::transaction(function () use ($request, $property) {
                $data = $request->except(['amenities', 'features', 'tags', 'types', 'neighborhoods', 'seasonal_prices']);
                $data['status']      = $request->boolean('status');
                $data['is_featured'] = $request->boolean('is_featured');
                $data['is_rental']   = $request->boolean('is_rental');
                $data['is_sale']     = $request->boolean('is_sale');

                $property->update($data);

                $property->amenities()->sync($request->input('amenities', []));
                $property->tags()->sync($request->input('tags', []));
                $property->types()->sync($request->input('types', []));

                $features = $request->input('features', []);
                $property->features()->sync(
                    collect($features)->filter(fn($v) => !is_null($v) && $v !== '')
                        ->mapWithKeys(fn($v, $id) => [$id => ['value' => $v]])->toArray()
                );

                if ($request->has('neighborhoods')) {
                    $property->neighborhoods()->delete();
                    foreach ($request->input('neighborhoods') as $nb) {
                        $property->neighborhoods()->create($nb);
                    }
                }

                if ($request->has('seasonal_prices')) {
                    $this->syncSeasonalPrices($property, $request->input('seasonal_prices'));
                }
            });

            return redirect()->route('admin.properties.index')->with('success', __('Property updated successfully.'));

        } catch (\Exception $e) {
            Log::error("Property Update Failure: {$e->getMessage()}", ['id' => $property->id]);
            return back()->withInput()->with('error', __('Update synchronization failure.'));
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
            $newProperty = DB::transaction(function () use ($property) {
                $clone = $property->replicate();
                $clone->title .= ' ' . __('(Copy)');
                $clone->slug   = Str::slug($clone->title) . '-' . uniqid();
                $clone->save();

                $clone->amenities()->sync($property->amenities->pluck('id')->toArray());
                $clone->tags()->sync($property->tags->pluck('id')->toArray());
                $clone->types()->sync($property->types->pluck('id')->toArray());

                $featureSyncData = $property->features->mapWithKeys(fn($f) => [$f->id => ['value' => $f->pivot->value]])->toArray();
                $clone->features()->sync($featureSyncData);

                foreach ($property->prices as $p) {
                    $clone->prices()->create(['name' => $p->title, 'start_date' => $p->start_date, 'end_date' => $p->end_date, 'price' => $p->price]);
                }

                foreach ($property->neighborhoods as $n) {
                    $clone->neighborhoods()->create(['name' => $n->title, 'distance' => $n->distance, 'latitude' => $n->latitude, 'longitude' => $n->longitude]);
                }

                return $clone;
            });

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

    /**
     * Synchronize seasonal prices while performing overlap validation.
     *
     * @param  \App\Models\Property  $property
     * @param  array  $seasonalPrices
     * @return void
     */
    protected function syncSeasonalPrices(Property $property, array $seasonalPrices): void
    {
        // Internal Overlap Detection
        for ($i = 0; $i < count($seasonalPrices); $i++) {
            for ($j = $i + 1; $j < count($seasonalPrices); $j++) {
                $aStart = Carbon::parse($seasonalPrices[$i]['start_date']);
                $aEnd   = Carbon::parse($seasonalPrices[$i]['end_date']);
                $bStart = Carbon::parse($seasonalPrices[$j]['start_date']);
                $bEnd   = Carbon::parse($seasonalPrices[$j]['end_date']);

                if ($aStart <= $bEnd && $bStart <= $aEnd) {
                    throw new \Exception(__('Overlap detected in seasonal pricing ranges.'));
                }
            }
        }

        $property->prices()->delete();
        foreach ($seasonalPrices as $sp) {
            if (!empty($sp['start_date']) && !empty($sp['end_date'])) {
                $property->prices()->create($sp);
            }
        }
    }
}
