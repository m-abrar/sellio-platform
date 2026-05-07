<?php

namespace Database\Factories;

use App\Models\ProductMetric;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Product Metrics
 *
 * This factory generates performance and quality metrics for products,
 * such as Build Quality, Ease of Use, and Durability, providing quantitative
 * data points for consumer evaluation.
 */
class ProductMetricFactory extends Factory
{
    protected $model = ProductMetric::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $metric = $this->faker->randomElement(self::getAvailableMetrics());

        return [
            'product_id' => Product::factory(),
            'title'      => $metric['title'],
            'score'      => $this->faker->randomFloat(1, 3.5, 5.0), // High scores for demo data
            'icon_class' => $metric['icon_class'],
            'color_hex'  => $metric['color_hex'],
            'description'=> $this->faker->sentence(10),
        ];
    }

    /**
     * Predefined metrics specifically for Product performance evaluation.
     */
    public static function getAvailableMetrics(): array
    {
        return [
            [
                'title'      => 'Build Quality',
                'icon_class' => 'bi-hammer',
                'color_hex'  => '#4e73df', // Primary Blue
            ],
            [
                'title'      => 'Value for Money',
                'icon_class' => 'bi-cash-stack',
                'color_hex'  => '#1cc88a', // Success Green
            ],
            [
                'title'      => 'Ease of Use',
                'icon_class' => 'bi-hand-index-thumb',
                'color_hex'  => '#f6c23e', // Warning Yellow
            ],
            [
                'title'      => 'Battery Performance',
                'icon_class' => 'bi-battery-charging',
                'color_hex'  => '#36b9cc', // Info Cyan
            ],
            [
                'title'      => 'Durability',
                'icon_class' => 'bi-shield-shaded',
                'color_hex'  => '#e74a3b', // Danger Red
            ],
            [
                'title'      => 'Packaging Design',
                'icon_class' => 'bi-archive',
                'color_hex'  => '#858796', // Secondary Gray
            ],
        ];
    }

    /**
     * State helper to assign a specific metric from the list.
     */
    public function withSpecificMetric(array $metricData): static
    {
        return $this->state(fn (array $attributes) => [
            'title'      => $metricData['title'],
            'icon_class' => $metricData['icon_class'],
            'color_hex'  => $metricData['color_hex'],
        ]);
    }
}