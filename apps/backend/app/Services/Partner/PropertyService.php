<?php

namespace App\Services\Partner;

use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class PropertyService
 * Handles business logic for Partner Properties including plan limit checks.
 */
class PropertyService
{
    /**
     * Check if the user can create a new property based on their plan.
     *
     * @param User $user
     * @return bool
     */
    public function canCreateProperty(User $user): bool
    {
        return !$user->hasReachedListingLimit();
    }

    /**
     * Check if the user can feature a property.
     *
     * @param User $user
     * @return bool
     */
    public function canFeatureProperty(User $user): bool
    {
        $plan = $user->getPlan();
        $featuredCount = $user->properties()->where('is_featured', true)->count();
        $maxFeatured = (int) ($plan->max_featured_listings ?? 0);

        return $featuredCount < $maxFeatured;
    }

    /**
     * Store or Update property with amenities.
     *
     * @param User $user
     * @param array $data
     * @param Property|null $property
     * @return Property
     */
    public function saveProperty(User $user, array $data, ?Property $property = null): Property
    {
        return DB::transaction(function () use ($user, $data, $property) {
            // Exclude relational array attributes from the core table save
            $coreData = collect($data)->except([
                'amenities', 'features', 'tags', 'neighborhoods', 'seasonal_prices', 'addons', 'fees', 'scores'
            ])->toArray();

            if (! array_key_exists('maximum_guests', $coreData) || $coreData['maximum_guests'] === null || $coreData['maximum_guests'] === '') {
                $coreData['maximum_guests'] = $this->defaultGuestCapacity($coreData);
            }

            if ($property) {
                $coreData['slug'] = $coreData['slug'] ?? $this->generateUniqueSlug($coreData['title'], $property->id);
                $property->update($coreData);
            } else {
                $coreData['slug'] = $coreData['slug'] ?? $this->generateUniqueSlug($coreData['title']);
                $property = $user->properties()->create($coreData);
            }

            // 1. Sync standard Amenities (Many-to-Many)
            if (isset($data['amenities'])) {
                $property->amenities()->sync($data['amenities']);
            }

            // 2. Sync polymorphic Features (Morph-to-Many)
            if (isset($data['features'])) {
                $property->features()->sync($data['features']);
            }

            // 3. Sync polymorphic Tags (Morph-to-Many)
            if (isset($data['tags'])) {
                $tagIds = [];
                foreach ($data['tags'] as $tagName) {
                    $tag = \App\Models\Tag::firstOrCreate(
                        ['title' => trim($tagName)],
                        ['slug' => \Illuminate\Support\Str::slug($tagName), 'is_property' => true, 'is_published' => true]
                    );
                    $tagIds[] = $tag->id;
                }
                $property->tags()->sync($tagIds);
            }

            // 4. Sync dynamic Neighborhoods (One-to-Many)
            if (isset($data['neighborhoods'])) {
                $property->neighborhoods()->delete();
                foreach ($data['neighborhoods'] as $nb) {
                    if (!empty($nb['title'])) {
                        $property->neighborhoods()->create([
                            'title'          => $nb['title'],
                            'description'    => $nb['description'] ?? null,
                            'distance_miles' => (float) ($nb['distance_miles'] ?? 0),
                        ]);
                    }
                }
            }

            // 5. Sync Seasonal Prices (One-to-Many)
            if (isset($data['seasonal_prices'])) {
                $property->prices()->delete();
                foreach ($data['seasonal_prices'] as $sp) {
                    $seasonName = $sp['season_name'] ?? $sp['name'] ?? $sp['title'] ?? null;
                    if (! empty($seasonName)) {
                        $property->prices()->create([
                            'title'      => $seasonName,
                            'start_date' => $sp['start_date'],
                            'end_date'   => $sp['end_date'],
                            'price'      => (float) $sp['price'],
                        ]);
                    }
                }
            }

            // 6. Sync Addons (One-to-Many)
            if (isset($data['addons'])) {
                $property->addons()->delete();
                foreach ($data['addons'] as $addon) {
                    if (!empty($addon['title'])) {
                        $property->addons()->create([
                            'title'       => $addon['title'],
                            'description' => $addon['description'] ?? null,
                            'price'       => (float) $addon['price'],
                        ]);
                    }
                }
            }

            // 7. Sync Fees (One-to-Many)
            if (isset($data['fees'])) {
                $property->fees()->delete();
                foreach ($data['fees'] as $fee) {
                    if (!empty($fee['title'])) {
                        $property->fees()->create([
                            'title'       => $fee['title'],
                            'amount'      => (float) ($fee['amount'] ?? 0),
                            'type'        => $fee['type'] ?? 'fixed',
                            'rate'        => isset($fee['rate']) ? (float) $fee['rate'] : null,
                            'charge_type' => $fee['charge_type'] ?? 'per_stay',
                        ]);
                    }
                }
            }

            // 8. Sync Livability Scores (One-to-Many)
            if (isset($data['scores'])) {
                $property->scores()->delete();
                foreach ($data['scores'] as $score) {
                    if (! empty($score['title']) && isset($score['score']) && $score['score'] !== '') {
                        $property->scores()->create([
                            'title'       => $score['title'],
                            'score'       => (float) $score['score'],
                            'units'       => $score['units'] ?? null,
                            'description' => $score['description'] ?? null,
                        ]);
                    }
                }
            }

            return $property;
        });
    }

    protected function defaultGuestCapacity(array $data): int
    {
        if (empty($data['is_rental'])) {
            return 1;
        }

        $bedrooms = (int) ($data['number_of_bedrooms'] ?? 0);

        return $bedrooms > 0 ? max(2, $bedrooms * 2) : 1;
    }

    protected function generateUniqueSlug(string $title, ?int $currentId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while (
            Property::where('slug', $slug)
                ->when($currentId, fn ($query) => $query->where('id', '!=', $currentId))
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}
