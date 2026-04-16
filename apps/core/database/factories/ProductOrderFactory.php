<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $qty = $this->faker->numberBetween(1, 5);
        $unitPrice = $this->faker->randomFloat(2, 20, 500);
        $tax = $unitPrice * 0.075;
        $shipping = $this->faker->randomElement([0, 5.99, 12.50, 19.99]);

        return [
            // Foreign Keys (usually overridden in Seeder, but defaults provided)
            'product_id' => Product::factory(),
            'user_id'    => User::factory(),

            // Order Identifiers
            'order_number' => 'ORD-' . strtoupper($this->faker->bothify('??###??')),
            'transaction_id' => $this->faker->boolean(80) ? 'txn_' . $this->faker->uuid : null,

            // Financials
            'quantity'     => $qty,
            'unit_price'   => $unitPrice,
            'tax_amount'   => $tax,
            'shipping_fee' => $shipping,
            'total_price'  => ($unitPrice * $qty) + $tax + $shipping,

            // Customer Info (Snapshot in case user profile changes)
            'full_name'    => $this->faker->name(),
            'email'        => $this->faker->safeEmail(),
            'phone'        => $this->faker->phoneNumber(),
            'shipping_address' => $this->faker->streetAddress,
            'city'         => $this->faker->city,
            'postal_code'  => $this->faker->postcode,
            'country'      => $this->faker->countryCode,

            // Status Logic
            'status' => $this->faker->randomElement([
                'pending', 
                'processing', 
                'shipped', 
                'delivered', 
                'cancelled'
            ]),
            'payment_status' => $this->faker->randomElement(['paid', 'unpaid', 'refunded']),
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'stripe', 'bank_transfer']),

            // Timestamps
            'order_date'   => $this->faker->dateTimeBetween('-6 months', 'now'),
            'shipped_at'   => $this->faker->boolean(60) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'created_at'   => now(),
            'updated_at'   => now(),
        ];
    }

    /**
     * Indicate that the order is delivered.
     */
    public function delivered(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'delivered',
            'payment_status' => 'paid',
            'shipped_at' => now()->subDays(2),
        ]);
    }

    /**
     * Indicate that the order was cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'payment_status' => 'refunded',
            'transaction_id' => null,
        ]);
    }
}