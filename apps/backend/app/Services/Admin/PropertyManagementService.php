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
            'amenities', 'features', 'tags', 'types', 'neighborhoods', 'seasonal_prices'
        ])->toArray();

        $filtered['status']      = isset($data['status']) ? (bool)$data['status'] : false;
        $filtered['is_featured'] = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;
        $filtered['is_rental']   = isset($data['is_rental']) ? (bool)$data['is_rental'] : false;
        $filtered['is_sale']     = isset($data['is_sale']) ? (bool)$data['is_sale'] : false;

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
        $property->types()->sync($data['types'] ?? []);
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
            $property->prices()->create($p);
        }
    }
}
