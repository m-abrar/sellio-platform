<?php

namespace App\Services\Admin;

use App\Models\Property;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Class PropertyManagementService
 *
 * Orchestrates the business logic for Real Estate lifecycle management, 
 * including taxonomy synchronization, seasonal pricing validation, 
 * and neighborhood relationship mapping.
 */
class PropertyManagementService
{
    /**
     * Get all data required for the property listing index.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function getListingData(\Illuminate\Http\Request $request): array
    {
        $categories = \App\Models\Category::active()->forType('property')->get();
        if ($categories->isEmpty()) $categories = \App\Models\Category::active()->get();

        $locations = \App\Models\Location::active()->forType('property')->get();
        if ($locations->isEmpty()) $locations = \App\Models\Location::active()->get();

        $properties = Property::query()
            ->when($request->query('name'), fn($q) => $q->where('title', 'like', '%' . $request->query('name') . '%'))
            ->when($request->query('location_id'), fn($q) => $q->where('location_id', $request->query('location_id')))
            ->when($request->query('category_id'), fn($q) => $q->where('category_id', $request->query('category_id')))
            ->when($request->query('property_mode') === 'rental', fn($q) => $q->where('is_rental', true))
            ->when($request->query('property_mode') === 'sale', fn($q) => $q->where('is_sale', true))
            ->when($request->query('only_active'), fn($q) => $q->where('is_published', 1))
            ->with(['location', 'category', 'user', 'media', 'type'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $activePropertyMode = $request->query('property_mode', 'all');
        $propertyModeCounts = [
            'all' => Property::count(),
            'rental' => Property::where('is_rental', true)->count(),
            'sale' => Property::where('is_sale', true)->count(),
        ];

        return compact('properties', 'locations', 'categories', 'activePropertyMode', 'propertyModeCounts');
    }

    /**
     * Get all taxonomies and metadata for the property form (create/edit).
     *
     * @return array
     */
    public function getFormData(): array
    {
        $amenities  = \App\Models\Amenity::active()->forType('property')->get();
        $features   = \App\Models\Feature::active()->forType('property')->get();
        $types      = \App\Models\Type::active()->forType('property')->get();
        $tags       = \App\Models\Tag::active()->forType('property')->get();
        $categories = \App\Models\Category::active()->forType('property')->get();
        if ($categories->isEmpty()) $categories = \App\Models\Category::active()->get();

        $locations = \App\Models\Location::active()->forType('property')->get();
        if ($locations->isEmpty()) $locations = \App\Models\Location::active()->get();
        
        $titleSuggestions = Property::select('title')->distinct()->limit(20)->pluck('title');

        return compact('amenities', 'features', 'types', 'tags', 'categories', 'locations', 'titleSuggestions');
    }

    /**
     * Create or update a property listing with its complex relational data.
     *
     * @param array $data
     * @param Property|null $property
     * @return Property
     */
    public function saveProperty(array $data, ?Property $property = null): Property
    {
        return DB::transaction(function () use ($data, $property) {
            $modelData = $this->extractModelData($data);
            
            if ($property) {
                $property->update($modelData);
            } else {
                $property = Property::create($modelData);
            }

            $this->syncTaxonomies($property, $data);
            $this->syncFeatures($property, $data['features'] ?? []);
            $this->syncNeighborhoods($property, $data['neighborhoods'] ?? []);
            $this->syncSeasonalPrices($property, $data['seasonal_prices'] ?? []);

            return $property;
        });
    }

    /**
     * Replicate a property as a draft copy, maintaining all relational metadata.
     *
     * @param Property $property
     * @return Property
     */
    public function duplicateProperty(Property $property): Property
    {
        return DB::transaction(function () use ($property) {
            $clone = $property->replicate();
            $clone->title .= ' ' . __('(Copy)');
            $clone->slug   = Str::slug($clone->title) . '-' . uniqid();
            $clone->save();

            // Replicate standard taxonomies
            $clone->amenities()->sync($property->amenities->pluck('id')->toArray());
            $clone->tags()->sync($property->tags->pluck('id')->toArray());
            $clone->types()->sync($property->types->pluck('id')->toArray());

            // Replicate features with pivot values
            $featureSyncData = $property->features->mapWithKeys(fn($f) => [
                $f->id => ['value' => $f->pivot->value]
            ])->toArray();
            $clone->features()->sync($featureSyncData);

            // Replicate seasonal pricing
            foreach ($property->prices as $p) {
                $clone->prices()->create([
                    'name' => $p->title, 
                    'start_date' => $p->start_date, 
                    'end_date' => $p->end_date, 
                    'price' => $p->price
                ]);
            }

            // Replicate neighborhood data
            foreach ($property->neighborhoods as $n) {
                $clone->neighborhoods()->create([
                    'name' => $n->title, 
                    'distance' => $n->distance, 
                    'latitude' => $n->latitude, 
                    'longitude' => $n->longitude
                ]);
            }

            return $clone;
        });
    }

    /**
     * Extract core model data from request payload.
     *
     * @param array $data
     * @return array
     */
    protected function extractModelData(array $data): array
    {
        $filtered = collect($data)->except([
            'amenities', 'features', 'tags', 'types', 'neighborhoods', 'seasonal_prices', 'status'
        ])->toArray();

        if (empty($filtered['slug']) && ! empty($filtered['title'])) {
            $filtered['slug'] = Str::slug($filtered['title']);
        }

        if (! isset($filtered['user_id'])) {
            $filtered['user_id'] = auth()->id();
        }

        $filtered['is_published'] = isset($data['status'])
            ? (bool) $data['status']
            : (isset($data['is_published']) ? (bool) $data['is_published'] : false);
        $filtered['is_featured'] = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
        $filtered['is_rental']   = isset($data['is_rental']) ? (bool)$data['is_rental'] : false;
        $filtered['is_sale']     = isset($data['is_sale']) ? (bool)$data['is_sale'] : true;

        foreach ([
            'number_of_bedrooms' => 0,
            'number_of_bathrooms' => 0,
            'number_of_parking_spots' => 0,
            'maximum_guests' => 1,
        ] as $field => $default) {
            if (! array_key_exists($field, $filtered) || $filtered[$field] === null || $filtered[$field] === '') {
                $filtered[$field] = $default;
            }
        }

        if (isset($data['images']) && is_array($data['images'])) {
            $filtered['images'] = json_encode($data['images'], JSON_UNESCAPED_SLASHES);
        }

        return $filtered;
    }

    /**
     * Synchronize standard taxonomies.
     *
     * @param Property $property
     * @param array $data
     * @return void
     */
    protected function syncTaxonomies(Property $property, array $data): void
    {
        $property->amenities()->sync($data['amenities'] ?? []);
        $property->tags()->sync($data['tags'] ?? []);

        if (array_key_exists('types', $data)) {
            $typeIds = array_values(array_filter($data['types'] ?? []));
            $property->update(['type_id' => $typeIds !== [] ? (int) $typeIds[0] : null]);
        }
    }

    /**
     * Synchronize hierarchical features with pivot values.
     *
     * @param Property $property
     * @param array $features
     * @return void
     */
    protected function syncFeatures(Property $property, array $features): void
    {
        $syncData = collect($features)
            ->filter(fn($v) => !is_null($v) && $v !== '')
            ->mapWithKeys(fn($v, $id) => [$id => ['value' => $v]])
            ->toArray();

        $property->features()->sync($syncData);
    }

    /**
     * Synchronize neighborhood metrics.
     *
     * @param Property $property
     * @param array $neighborhoods
     * @return void
     */
    protected function syncNeighborhoods(Property $property, array $neighborhoods): void
    {
        $property->neighborhoods()->delete();
        
        foreach ($neighborhoods as $nb) {
            if (!empty($nb['name'])) {
                $property->neighborhoods()->create($nb);
            }
        }
    }

    /**
     * Synchronize seasonal pricing with overlap validation.
     *
     * @param Property $property
     * @param array $prices
     * @return void
     * @throws \Exception
     */
    protected function syncSeasonalPrices(Property $property, array $prices): void
    {
        // Filter out empty entries
        $prices = array_filter($prices, fn($p) => !empty($p['start_date']) && !empty($p['end_date']));

        // Overlap Detection
        $count = count($prices);
        for ($i = 0; $i < $count; $i++) {
            for ($j = $i + 1; $j < $count; $j++) {
                $aStart = Carbon::parse($prices[$i]['start_date']);
                $aEnd   = Carbon::parse($prices[$i]['end_date']);
                $bStart = Carbon::parse($prices[$j]['start_date']);
                $bEnd   = Carbon::parse($prices[$j]['end_date']);

                if ($aStart <= $bEnd && $bStart <= $aEnd) {
                    throw new \Exception(__('Overlap detected in seasonal pricing ranges.'));
                }
            }
        }

        $property->prices()->delete();
        foreach ($prices as $p) {
            $property->prices()->create([
                'title' => $p['name'] ?? $p['title'] ?? 'Season',
                'start_date' => $p['start_date'],
                'end_date' => $p['end_date'],
                'price' => $p['price'],
            ]);
        }
    }
}
