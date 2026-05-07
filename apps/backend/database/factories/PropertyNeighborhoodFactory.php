<?php

namespace Database\Factories;

use App\Models\PropertyNeighborhood;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Property Neighborhood Points
 *
 * This factory generates geospatial context for properties, mapping nearby
 * amenities (transit, schools, parks) with realistic distance calculations
 * and categorical grouping (Commute, Essential, Recreation).
 */
class PropertyNeighborhoodFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PropertyNeighborhood::class;

    public static function getNeighborhoodData(): array
    {
        return self::$neighborhoodData;
    }

    // Define a structured list of possible neighborhoods for consistency
    protected static $neighborhoodData = [
        [
            'title' => 'Subway Station',
            'icon_class' => 'bi-train-front',
            'category' => 'Commute',
            'units' => ['mi', 'blocks'], // Possible distance units
        ],
        [
            'title' => 'Major Bus Stop',
            'icon_class' => 'bi-bus-front',
            'category' => 'Commute',
            'units' => ['blocks', 'min walk'],
        ],
        [
            'title' => 'Downtown District',
            'icon_class' => 'bi-building',
            'category' => 'Commute',
            'units' => ['min drive', 'mi'],
        ],
        [
            'title' => 'Large Grocery Store',
            'icon_class' => 'bi-shop',
            'category' => 'Essential',
            'units' => ['mi', 'min walk'],
        ],
        [
            'title' => 'City Park',
            'icon_class' => 'bi-tree',
            'category' => 'Recreation',
            'units' => ['mi', 'blocks'],
        ],
        [
            'title' => 'Medical Center / Hospital',
            'icon_class' => 'bi-hospital',
            'category' => 'Essential',
            'units' => ['mi'],
        ],
        [
            'title' => 'Elementary School',
            'icon_class' => 'bi-mortarboard',
            'category' => 'School',
            'units' => ['mi'],
        ],
        [
            'title' => 'Community Pool & Gym',
            'icon_class' => 'bi-tools',
            'category' => 'Recreation',
            'units' => ['min walk'],
        ],
        [
            'title' => 'Local Coffee Shop',
            'icon_class' => 'bi-cup-hot',
            'category' => 'Essential',
            'units' => ['blocks', 'min walk'],
        ],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Randomly select one structured neighborhood point
        $neighborhood = $this->faker->randomElement(self::$neighborhoodData);

        // Generate dynamic distance based on the item's unit preference
        $hasDistance = $this->faker->boolean(75); // 75% chance of having a distance

        $distanceValue = null;
        $unit = null;
        
        if ($hasDistance) {
            $unit = $this->faker->randomElement($neighborhood['units']);
            
            // Define realistic range based on unit
            switch ($unit) {
                case 'min drive':
                    $distanceValue = $this->faker->numberBetween(5, 20); // 5 to 20 minutes
                    break;
                case 'blocks':
                    $distanceValue = $this->faker->numberBetween(1, 5); // 1 to 5 blocks
                    break;
                case 'min walk':
                    $distanceValue = $this->faker->numberBetween(2, 15); // 2 to 15 minutes
                    break;
                case 'mi':
                default:
                    $distanceValue = $this->faker->randomFloat(1, 0.1, 3.0); // 0.1 to 3.0 miles
                    break;
            }
        }

        return [
            // property_id will be provided when calling the factory
            'title'             => $neighborhood['title'],
            'icon_class'       => $neighborhood['icon_class'],
            'category'         => $neighborhood['category'],
            // The original 'description' field can be kept or removed if 'title' and distance suffice
            'description'      => $this->faker->boolean(30) ? $this->faker->sentence(8) : null,
            
            'distance_value'   => $hasDistance ? $distanceValue : null,
            'distance_unit'    => $hasDistance ? $unit : null,
        ];
    }
}