<?php

namespace Database\Factories;

use App\Models\JobListing;
use App\Models\User;
use App\Models\Category;
use App\Models\Type;
use App\Models\Location;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobListingFactory extends Factory
{
    protected $model = JobListing::class;

    public function definition(): array
    {
        $title = $this->faker->jobTitle;
        $salaryMin = $this->faker->numberBetween(40000, 100000);

        return [
            'user_id'     => User::where('is_partner', true)->inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::where('is_job', true)->inRandomOrder()->first()?->id ?? Category::factory(),
            'type_id'     => Type::where('is_job', true)->inRandomOrder()->first()?->id ?? Type::factory(),
            'location_id' => Location::inRandomOrder()->first()?->id ?? Location::factory(),
            'brand_id'    => Brand::where('is_job', true)->inRandomOrder()->first()?->id ?? null,

            'title'       => $title,
            'slug'        => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 999999),
            'description' => $this->faker->paragraphs(3, true),
            
            'salary_min'       => $salaryMin,
            'salary_max'       => $salaryMin + $this->faker->numberBetween(10000, 50000),
            'salary_frequency' => 'yearly',

            'experience_level'   => $this->faker->numberBetween(1, 4),
            'workplace_type'     => $this->faker->numberBetween(1, 3),
            'required_education' => $this->faker->randomElement(['Bachelors Degree', 'Masters Degree', 'PhD']),
            'application_deadline' => $this->faker->dateTimeBetween('+1 week', '+2 months'),

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
