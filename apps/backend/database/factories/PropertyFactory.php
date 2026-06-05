<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use App\Models\Category;
use App\Models\Type;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        $title = $this->faker->words(3, true) . ' ' . $this->faker->randomElement(['Villa', 'Apartment', 'House', 'Studio']);
        $isRental = $this->faker->boolean(50);
        $basePrice = $isRental ? $this->faker->numberBetween(500, 5000) : $this->faker->numberBetween(100000, 1000000);

        return [
            'user_id'     => User::where('is_partner', true)->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::where('is_property', true)->inRandomOrder()->first()?->id ?? Category::factory(),
            'type_id'     => Type::where('is_property', true)->inRandomOrder()->first()?->id ?? Type::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),

            'title'       => ucfirst($title),
            'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(100, 999),
            'description' => $this->faker->paragraphs(4, true),
            
            'base_price'      => $basePrice,
            'price_per_night' => $isRental ? $basePrice / 30 : null,
            'is_rental'       => $isRental,
            'is_sale'         => !$isRental,

            'number_of_bedrooms'  => $this->faker->numberBetween(1, 6),
            'number_of_bathrooms' => $this->faker->numberBetween(1, 4),
            'area_sq_ft'          => $this->faker->numberBetween(500, 5000),
            'year_built'          => $this->faker->year,
            'total_units'         => 1,
            
            'address'   => $this->faker->streetAddress,
            'city'      => $this->faker->city,
            'state'     => $this->faker->stateAbbr,
            'country'   => 'USA',
            'zip_code'  => $this->faker->postcode,
            'latitude'  => $this->faker->latitude,
            'longitude' => $this->faker->longitude,

            'status'       => 'approved',
            'is_published' => true,
            'is_featured'  => $this->faker->boolean(10),
            'approved_at'  => now(),
        ];
    }
}
