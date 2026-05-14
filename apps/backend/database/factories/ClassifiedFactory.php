<?php

namespace Database\Factories;

use App\Models\Classified;
use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ClassifiedFactory extends Factory
{
    protected $model = Classified::class;

    public function definition(): array
    {
        $title = $this->faker->words(3, true);
        $price = $this->faker->numberBetween(10, 5000);

        return [
            'user_id'     => User::inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::where('is_classified', true)->inRandomOrder()->first()?->id ?? Category::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),

            'title'       => ucfirst($title),
            'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 999999),
            'description' => $this->faker->paragraphs(2, true),
            
            'base_price'       => $price,
            'item_condition'   => $this->faker->numberBetween(1, 10),
            'is_negotiable' => $this->faker->boolean(50),

            'address'   => $this->faker->streetAddress,
            'city'      => $this->faker->city,
            'state'     => $this->faker->stateAbbr,
            'country'   => 'USA',
            'zip_code'  => $this->faker->postcode,
            'latitude'  => $this->faker->latitude,
            'longitude' => $this->faker->longitude,

            'status'       => 'active',
            'is_published' => true,
            'is_featured'  => $this->faker->boolean(5),
            'approved_at'  => now(),
        ];
    }
}
