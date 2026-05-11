<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $title = $this->faker->words(3, true) . ' ' . $this->faker->randomElement(['Conference', 'Meetup', 'Workshop', 'Concert']);
        $basePrice = $this->faker->numberBetween(0, 200);

        return [
            'user_id'     => User::where('is_partner', true)->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::where('is_event', true)->inRandomOrder()->first()?->id ?? Category::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),

            'title'       => ucfirst($title),
            'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 999999),
            'description' => $this->faker->paragraphs(3, true),
            
            'base_price'  => $basePrice,
            'is_paid'     => $basePrice > 0,
            
            'start_date_time' => $this->faker->dateTimeBetween('+1 week', '+3 months'),
            'end_date_time'   => $this->faker->dateTimeBetween('+3 months', '+4 months'),
            'is_virtual'      => $this->faker->boolean(20),
            'virtual_link'    => $this->faker->boolean(20) ? $this->faker->url : null,

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
