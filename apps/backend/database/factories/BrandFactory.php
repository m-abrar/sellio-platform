<?php

namespace Database\Factories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BrandFactory extends Factory
{
    protected $model = Brand::class;

    public function definition(): array
    {
        $title = $this->faker->company . ' ' . $this->faker->randomNumber(4);
        return [
            'title'         => $title,
            'slug'          => Str::slug($title),
            'description'   => $this->faker->paragraph,
            'is_published'  => true,
            'is_property'   => $this->faker->boolean(10),
            'is_auto'       => $this->faker->boolean(50),
            'is_product'    => $this->faker->boolean(50),
            'is_service'    => $this->faker->boolean(10),
        ];
    }
}
