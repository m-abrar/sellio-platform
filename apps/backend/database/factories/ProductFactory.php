<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Type;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Data Factory for Core Products
 *
 * This factory generates comprehensive e-commerce product listings,
 * including dynamic pricing, inventory management, physical dimensions,
 * and polymorphic categorization/branding.
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $title = $this->faker->words(3, true) . ' ' . $this->faker->colorName;
        $basePrice = $this->faker->randomFloat(2, 20, 2000);
        $onSale = $this->faker->boolean(30);

        return [
            // Foreign Keys (Lazy loading to prevent O(n) query storm)
            'user_id'     => User::factory(),
            'category_id' => Category::factory(),
            'brand_id'    => Brand::factory(),
            'type_id'     => Type::factory(),

            // Basic Info
            'title'             => ucfirst($title),
            'slug'              => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(100, 999),
            'sku'               => strtoupper($this->faker->bothify('??-####-???')),
            'description'       => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(15),

            // Pricing
            'base_price'  => $basePrice,
            'sale_price'  => $onSale ? $basePrice * 0.8 : null,
            'cost_price'  => $basePrice * 0.5,
            'on_sale'     => $onSale,

            // Inventory
            'stock_quantity'      => $this->faker->numberBetween(0, 100),
            'low_stock_threshold' => 5,
            'manage_stock'        => true,
            'in_stock'            => true,

            // Physical
            'weight' => $this->faker->randomFloat(2, 0.5, 10),
            'length' => $this->faker->randomFloat(2, 10, 100),
            'width'  => $this->faker->randomFloat(2, 10, 100),
            'height' => $this->faker->randomFloat(2, 10, 100),

            // Flags
            'is_published' => true,
            'is_featured'  => $this->faker->boolean(10),
            'is_digital'   => false,
            'approved_at'  => now(),
        ];
    }
}