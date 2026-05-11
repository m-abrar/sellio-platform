<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        $title = $this->faker->city . ' ' . $this->faker->randomNumber(4);
        return [
            'title'         => $title,
            'slug'          => Str::slug($title),
            'state'         => $this->faker->stateAbbr,
            'zip_code'      => $this->faker->postcode,
            'country'       => 'USA',
            'latitude'      => $this->faker->latitude,
            'longitude'     => $this->faker->longitude,
            'is_published'  => true,
            'is_property'   => true,
            'is_auto'       => true,
            'is_event'      => true,
            'is_service'    => true,
        ];
    }
}
