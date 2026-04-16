<?php

namespace Database\Factories;

use App\Models\ProductSpecification;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductSpecificationFactory extends Factory
{
    protected $model = ProductSpecification::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $spec = $this->faker->randomElement($this->getTechSpecs());

        return [
            'product_id' => Product::factory(),
            'label'      => $spec['label'],
            'value'      => $this->generateValueForLabel($spec['label']),
            'icon_class' => $spec['icon_class'],
            'group'      => $spec['group'],
            'is_visible' => true,
        ];
    }

    /**
     * Predefined technical specifications used by the Seeder.
     */
    public function getTechSpecs(): array
    {
        return [
            ['label' => 'Material',       'icon_class' => 'bi-box',           'group' => 'Build'],
            ['label' => 'Weight',         'icon_class' => 'bi-speedometer2',  'group' => 'Physical'],
            ['label' => 'Dimensions',     'icon_class' => 'bi-aspect-ratio',  'group' => 'Physical'],
            ['label' => 'Battery Life',   'icon_class' => 'bi-battery-full',  'group' => 'Power'],
            ['label' => 'Connectivity',   'icon_class' => 'bi-wifi',          'group' => 'Technical'],
            ['label' => 'Warranty',       'icon_class' => 'bi-shield-check',  'group' => 'Service'],
            ['label' => 'Waterproof',     'icon_class' => 'bi-droplet',       'group' => 'Build'],
            ['label' => 'Operating Temp', 'icon_class' => 'bi-thermometer',   'group' => 'Technical'],
        ];
    }

    /**
     * Generates a realistic value based on the specification label.
     */
    private function generateValueForLabel(string $label): string
    {
        return match ($label) {
            'Material'       => $this->faker->randomElement(['Aluminum', 'Stainless Steel', 'Polycarbonate', 'Vegan Leather']),
            'Weight'         => $this->faker->numberBetween(100, 2000) . 'g',
            'Dimensions'     => $this->faker->numberBetween(10, 50) . ' x ' . $this->faker->numberBetween(5, 30) . ' cm',
            'Battery Life'   => $this->faker->numberBetween(5, 48) . ' Hours',
            'Connectivity'   => $this->faker->randomElement(['Bluetooth 5.2', 'Wi-Fi 6', 'USB-C', 'NFC']),
            'Warranty'       => $this->faker->randomElement(['1 Year Limited', '2 Years Global', 'Lifetime']),
            'Waterproof'     => $this->faker->randomElement(['IP67 Rated', 'IP68 Rated', '5ATM', 'Splash Resistant']),
            'Operating Temp' => '-10°C to 45°C',
            default          => $this->faker->word(),
        };
    }
}