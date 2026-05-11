<?php

namespace Database\Factories;

use App\Models\Auto;
use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Type;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AutoFactory extends Factory
{
    protected $model = Auto::class;

    public function definition(): array
    {
        $make = $this->faker->randomElement(['BMW', 'Audi', 'Mercedes', 'Tesla', 'Toyota', 'Ford']);
        $model = $this->faker->word;
        $title = "{$this->faker->year} {$make} {$model}";
        $basePrice = $this->faker->numberBetween(15000, 80000);

        return [
            'user_id'     => User::where('is_partner', true)->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::where('is_auto', true)->inRandomOrder()->first()?->id ?? Category::factory(),
            'brand_id'    => Brand::where('is_auto', true)->inRandomOrder()->first()?->id ?? Brand::factory(),
            'type_id'     => Type::where('is_auto', true)->inRandomOrder()->first()?->id ?? Type::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),

            'title'       => $title,
            'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 999999),
            'description' => $this->faker->paragraphs(2, true),
            'base_price'  => $basePrice,
            'sale_price'  => $this->faker->boolean(20) ? $basePrice * 0.9 : null,

            'year'           => $this->faker->numberBetween(2015, 2024),
            'make'           => $make,
            'model'          => ucfirst($model),
            'engine_type'    => $this->faker->randomElement(['Gasoline', 'Diesel', 'Electric', 'Hybrid']),
            'transmission'   => $this->faker->randomElement(['Automatic', 'Manual', 'CVT']),
            'fuel_economy'   => $this->faker->numberBetween(5, 15) . ' L/100km',
            'drivetrain'     => $this->faker->randomElement(['FWD', 'RWD', 'AWD', '4WD']),
            'exterior_color' => $this->faker->safeColorName,

            'mileage_value'    => $this->faker->numberBetween(0, 150000),
            'mileage_units'    => 'km',
            'condition_rating' => $this->faker->numberBetween(1, 10),
            'vin_number'       => strtoupper(Str::random(17)),
            'warranty_months'  => $this->faker->randomElement([0, 12, 24, 36]),
            
            'address'   => $this->faker->streetAddress,
            'city'      => $this->faker->city,
            'state'     => $this->faker->stateAbbr,
            'country'   => 'USA',
            'zip_code'  => $this->faker->postcode,
            'latitude'  => $this->faker->latitude,
            'longitude' => $this->faker->longitude,

            'status'       => 'active',
            'is_published' => true,
            'is_featured'  => $this->faker->boolean(10),
            'approved_at'  => now(),
        ];
    }
}
