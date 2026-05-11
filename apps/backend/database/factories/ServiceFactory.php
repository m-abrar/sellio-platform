<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\User;
use App\Models\Category;
use App\Models\Type;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        $title = $this->faker->words(3, true) . ' Services';
        $basePrice = $this->faker->numberBetween(50, 500);

        return [
            'user_id'     => User::where('is_partner', true)->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::where('is_service', true)->inRandomOrder()->first()?->id ?? Category::factory(),
            'type_id'     => Type::where('is_service', true)->inRandomOrder()->first()?->id ?? Type::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),

            'title'       => ucfirst($title),
            'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 999999),
            'description' => $this->faker->paragraphs(3, true),
            
            'base_price'      => $basePrice,
            'price_type'      => $this->faker->randomElement(['fixed', 'starting_at', 'hourly']),
            
            'duration_minutes' => $this->faker->randomElement([30, 60, 90, 120]),
            'is_virtual'       => $this->faker->boolean(20),

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
