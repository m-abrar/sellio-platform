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
use Illuminate\Http\Request;
use App\Http\Requests\Admin\PropertyRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

use App\Traits\ManagesApproval;

class PropertyController extends Controller
{
    use ManagesApproval;

    protected $modelClass = Property::class;

    public function index()
    {
        $categories = Category::where('is_property', 1)->get();
        $locations = Location::where('is_property', 1)->get();

        $properties = Property::query()
            ->when(request('name'), fn($q) => $q->where('title', 'like', '%' . request('name') . '%'))
            ->when(request('location_id'), fn($q) => $q->where('location_id', request('location_id')))
            ->when(request('category_id'), fn($q) => $q->where('category_id', request('category_id')))
            ->when(request('only_active'), fn($q) => $q->where('is_published', 1))
            ->with(['location', 'category'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.properties.index', compact('properties', 'locations', 'categories'));
    }

    public function create()
    {
        $amenities = Amenity::all();
        $features = Feature::all();
        $types = Type::all();
        $tags = Tag::all();
        $categories = Category::all();
        $property = new Property();
        $locations = Location::all();

        return view('admin.properties.form', compact('property', 'amenities', 'features', 'types', 'tags', 'categories', 'locations'));
    }

    public function store(PropertyRequest $request)
    {

        $data = $request->except(['amenities', 'features', 'tags', 'types', 'neighborhoods', 'seasonal_prices']);
        $data['status'] = $request->boolean('status');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_rental'] = $request->boolean('is_rental');
        $data['is_sale'] = $request->boolean('is_sale');

        $property = Property::create($data);

        if ($request->has('images')) {
            $property->images = json_encode($request->images, JSON_UNESCAPED_SLASHES);
        }

        $property->amenities()->sync($request->input('amenities', []));
        $property->tags()->sync($request->input('tags', []));
        $property->types()->sync($request->input('types', []));

        $features = $request->input('features', []);

        $property->features()->sync(
            collect($features)
                ->filter(fn($value) => !is_null($value) && $value !== '')
                ->mapWithKeys(function ($value, $featureId) {
                    return [$featureId => ['value' => $value]];
                })
                ->toArray()
        );

        if ($request->has('neighborhoods')) {
            foreach ($request->input('neighborhoods') as $neighborhoodData) {
                $property->neighborhoods()->create($neighborhoodData);
            }
        }

        if ($request->has('seasonal_prices')) {
            foreach ($request->input('seasonal_prices') as $price) {
                $property->prices()->create([
                    'name' => $price['name'],
                    'start_date' => $price['start_date'],
                    'end_date' => $price['end_date'],
                    'price' => $price['price'],
                ]);
            }
        }

        return redirect()->route('admin.properties.edit', $property->id)
            ->with('success', 'Property added successfully.');
    }

    public function edit(Property $property)
    {
        $property->images = json_decode($property->images, true) ?? [];
        $property->load('features');
        $property->load('neighborhoods');

        $amenities = Amenity::all();
        $features = Feature::all();
        $tags = Tag::all();
        $types = Type::all();
        $categories = Category::all();
        $locations = Location::all();

        $statusColors = [
            'confirmed' => '#ef4444',
            'pending' => '#fde68a',
        ];
        $bookings = PropertyBooking::where('property_id', $property->id)
            ->get()
            ->map(function ($b) use ($statusColors) {
                return [
                    'start' => Carbon::parse($b->start_date)->toDateString(),
                    'end' => Carbon::parse($b->end_date)->toDateString(),
                    'color' => $statusColors[$b->status] ?? '#e5e7eb',
                ];
            });

        $recentBookings = PropertyBooking::where('property_id', $property->id)->with('user')->latest()->take(5)->get();
        $recentVisits = \App\Models\PropertyVisit::where('property_id', $property->id)->latest()->take(5)->get();

        return view('admin.properties.form', compact('property', 'bookings', 'amenities', 'features', 'tags', 'types', 'categories', 'locations', 'recentBookings', 'recentVisits'));
    }

    public function update(PropertyRequest $request, Property $property)
    {

        $data = $request->except(['amenities', 'features', 'tags', 'types', 'neighborhoods']);
        $data['status'] = $request->boolean('status');
        $data['is_featured'] = $request->boolean('is_featured');
        $data['is_rental'] = $request->boolean('is_rental');
        $data['is_sale'] = $request->boolean('is_sale');

        $property->update($data);

        $property->amenities()->sync($request->input('amenities', []));
        $property->tags()->sync($request->input('tags', []));
        $property->types()->sync($request->input('types', []));

        $features = $request->input('features', []);

        $property->features()->sync(
            collect($features)
                ->filter(fn($value) => !is_null($value) && $value !== '')
                ->mapWithKeys(function ($value, $featureId) {
                    return [$featureId => ['value' => $value]];
                })
                ->toArray()
        );

        if ($request->has('neighborhoods')) {
            $property->neighborhoods()->delete();
            foreach ($request->input('neighborhoods') as $neighborhoodData) {
                $property->neighborhoods()->create($neighborhoodData);
            }
        }
        $property->save();

        if ($request->has('seasonal_prices')) {
            $seasonalPrices = $request->input('seasonal_prices');

            $overlapWarning = false;
            for ($i = 0; $i < count($seasonalPrices); $i++) {
                for ($j = $i + 1; $j < count($seasonalPrices); $j++) {
                    $aStart = Carbon::parse($seasonalPrices[$i]['start_date']);
                    $aEnd = Carbon::parse($seasonalPrices[$i]['end_date']);
                    $bStart = Carbon::parse($seasonalPrices[$j]['start_date']);
                    $bEnd = Carbon::parse($seasonalPrices[$j]['end_date']);

                    if ($aStart <= $bEnd && $bStart <= $aEnd) {
                        $overlapWarning = true;
                        break 2;
                    }
                }
            }

            if ($overlapWarning) {
                return back()->with('warning', 'Some seasonal price ranges overlap.');
            }

            $property->prices()->delete();

            foreach ($seasonalPrices as $seasonalPrice) {
                if (!empty($seasonalPrice['start_date']) && !empty($seasonalPrice['end_date']) && isset($seasonalPrice['price'])) {
                    $property->prices()->create([
                        'name' => $seasonalPrice['name'],
                        'start_date' => $seasonalPrice['start_date'],
                        'end_date' => $seasonalPrice['end_date'],
                        'price' => $seasonalPrice['price'],
                    ]);
                }
            }
        }

        return redirect()->route('admin.properties.index')->with('success', 'Property updated successfully.');
    }

    public function duplicate(Property $property)
    {
        $newProperty = $property->replicate();
        $newProperty->title .= ' (Copy)';
        $newProperty->slug = \Str::slug($newProperty->title) . '-' . uniqid();
        $newProperty->save();

        $newProperty->amenities()->sync($property->amenities->pluck('id')->toArray());
        $newProperty->tags()->sync($property->tags->pluck('id')->toArray());
        $newProperty->types()->sync($property->types->pluck('id')->toArray());

        $featureSyncData = $property->features->mapWithKeys(function ($feature) {
            return [$feature->id => ['value' => $feature->pivot->value]];
        })->toArray();
        $newProperty->features()->sync($featureSyncData);

        foreach ($property->prices as $seasonalPrice) {
            $newProperty->prices()->create([
                'name' => $seasonalPrice->title,
                'start_date' => $seasonalPrice->start_date,
                'end_date' => $seasonalPrice->end_date,
                'price' => $seasonalPrice->price,
            ]);
        }

        foreach ($property->neighborhoods as $neighborhood) {
            $newProperty->neighborhoods()->create([
                'name' => $neighborhood->title,
                'distance' => $neighborhood->distance,
                'latitude' => $neighborhood->latitude,
                'longitude' => $neighborhood->longitude,
            ]);
        }

        return redirect()->route('admin.properties.edit', $newProperty->id)
            ->with('success', 'Property duplicated successfully.');
    }

    public function destroy(Property $property)
    {
        $property->delete();
        return redirect()->route('admin.properties.index')->with('success', 'Property deleted successfully.');
    }
}
