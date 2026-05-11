<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $title = $this->faker->words(2, true) . ' ' . $this->faker->randomNumber(4);
        return [
            'title'         => ucfirst($title),
            'slug'          => Str::slug($title),
            'description'   => $this->faker->sentence(),
            'is_published'  => true,
            'is_property'   => $this->faker->boolean(20),
            'is_event'      => $this->faker->boolean(20),
            'is_auto'       => $this->faker->boolean(20),
            'is_service'    => $this->faker->boolean(20),
            'is_job'        => $this->faker->boolean(20),
            'is_classified' => $this->faker->boolean(20),
            'is_product'    => $this->faker->boolean(20),
            'is_blog'       => $this->faker->boolean(10),
        ];
    }
}
