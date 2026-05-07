<?php

namespace Database\Factories;

use App\Models\ProductAddon;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Product Add-ons
 *
 * This factory generates optional and required enhancements for products,
 * such as warranties and installation services, using template-based data
 * to ensure realistic marketplace listings.
 */
class ProductAddonFactory extends Factory
{
    protected $model = ProductAddon::class;

    public function definition(): array
    {
        $addon = $this->faker->randomElement($this->getAddonTemplates());

        return [
            'product_id'   => Product::factory(),
            'title'        => $addon['title'],
            'description'  => $addon['description'],
            'icon'         => $addon['icon'],
            'price'        => $addon['price'],
            'pricing_type' => $addon['pricing_type'], // Aligned with migration enum
            'max_qty'      => $addon['max_qty'] ?? 1,
            'is_required'  => false,
            'is_popular'   => $this->faker->boolean(20),
            'sort_order'   => 0,
            'is_published' => true,
        ];
    }

    private function getAddonTemplates(): array
    {
        return [
            [
                'title'        => 'Extended 2-Year Warranty',
                'price'        => 49.99,
                'description'  => 'Full coverage for accidental damage and technical defects.',
                'icon'         => 'bi-shield-check',
                'pricing_type' => 'one_time',
            ],
            [
                'title'        => 'Premium Gift Wrapping',
                'price'        => 5.00,
                'description'  => 'Hand-wrapped with a personalized greeting card.',
                'icon'         => 'bi-gift',
                'pricing_type' => 'per_unit',
            ],
            [
                'title'        => 'Professional Installation',
                'price'        => 85.00,
                'description'  => 'Certified technician setup and disposal of old unit.',
                'icon'         => 'bi-tools',
                'pricing_type' => 'one_time',
            ],
        ];
    }

    public function required(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => true,
        ]);
    }
}