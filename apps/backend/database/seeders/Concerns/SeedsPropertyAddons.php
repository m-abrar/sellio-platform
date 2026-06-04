<?php

namespace Database\Seeders\Concerns;

use App\Models\Property;
use App\Models\PropertyAddon;

trait SeedsPropertyAddons
{
    /**
     * @return array<string, array{type: string, icon: string, is_popular: bool, max_qty: int}>
     */
    protected function propertyAddonDefinitions(): array
    {
        return [
            'Daily Breakfast'  => ['type' => 'per_night', 'icon' => 'bi-cup-hot', 'is_popular' => true, 'max_qty' => 10],
            'Airport Shuttle'  => ['type' => 'per_stay',  'icon' => 'bi-car-front', 'is_popular' => false, 'max_qty' => 2],
            'Pet Fee'          => ['type' => 'per_stay',  'icon' => 'bi-dog', 'is_popular' => false, 'max_qty' => 1],
            'Late Checkout'    => ['type' => 'per_stay',  'icon' => 'bi-clock-history', 'is_popular' => true, 'max_qty' => 1],
            'High-Speed Wi-Fi' => ['type' => 'per_night', 'icon' => 'bi-wifi', 'is_popular' => false, 'max_qty' => 1],
            'Extra Towels'     => ['type' => 'per_stay',  'icon' => 'bi-moisture', 'is_popular' => false, 'max_qty' => 5],
            'Private Parking'  => ['type' => 'per_night', 'icon' => 'bi-p-circle', 'is_popular' => false, 'max_qty' => 1],
            'Spa Access'       => ['type' => 'per_night', 'icon' => 'bi-water', 'is_popular' => true, 'max_qty' => 10],
            'Early Checkin'    => ['type' => 'per_stay',  'icon' => 'bi-door-open', 'is_popular' => false, 'max_qty' => 1],
        ];
    }

    protected function seedPropertyAddonsIfMissing(Property $property): int
    {
        if (! $property->is_rental || $property->addons()->exists()) {
            return 0;
        }

        $definitions = $this->propertyAddonDefinitions();
        $selectedTitles = collect($definitions)->keys()->shuffle()->take(random_int(2, 4));

        foreach ($selectedTitles as $title) {
            $meta = $definitions[$title];

            PropertyAddon::factory()->create([
                'property_id' => $property->id,
                'title'       => $title,
                'type'        => $meta['type'],
                'icon'        => $meta['icon'],
                'is_popular'  => $meta['is_popular'],
                'max_qty'     => $meta['max_qty'],
            ]);
        }

        return $selectedTitles->count();
    }
}
