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
            'sale_price'      => $this->faker->boolean(30) ? $basePrice * 0.9 : null,
            
            'is_subscription'  => $this->faker->boolean(20),
            'is_project_based' => $this->faker->boolean(50),
            'expertise_level'  => $this->faker->numberBetween(1, 4),
            'availability_schedule' => $this->faker->numberBetween(1, 3),
            'operating_hours' => '9AM-5PM',

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
