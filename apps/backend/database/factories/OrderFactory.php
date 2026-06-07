<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Database\Factories\Concerns\ResolvesExistingRecords;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Data Factory for Core Orders
 *
 * This factory generates complex order data, orchestrating financial calculations
 * (subtotal, tax, shipping), status states, and detailed logistical snapshots
 * for the e-commerce fulfillment workflow.
 */
class OrderFactory extends Factory
{
    use ResolvesExistingRecords;

    protected $model = Order::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 50, 1000);
        $shipping = $this->faker->randomElement([0.00, 5.00, 15.00]);
        $tax = $subtotal * 0.08; // 8% tax
        
        return [
            'order_number'    => 'ORD-' . now()->year . '-' . strtoupper($this->faker->unique()->bothify('####??')),
            'user_id'         => $this->existingUserId(),
            
            // Statuses
            'status'          => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered']),
            'payment_status'  => $this->faker->randomElement(['unpaid', 'paid']),
            'payment_method'  => $this->faker->randomElement(['stripe', 'paypal', 'cod']),
            
            // Financials
            'subtotal'        => $subtotal,
            'shipping_cost'   => $shipping,
            'tax_amount'      => $tax,
            'discount_amount' => 0.00,
            'total_amount'    => $subtotal + $shipping + $tax,
            
            // Shipping Snapshot
            'shipping_name'    => $this->faker->name(),
            'shipping_address' => $this->faker->streetAddress(),
            'shipping_city'    => $this->faker->city(),
            'shipping_state'   => $this->faker->state(),
            'shipping_zip'     => $this->faker->postcode(),
            'shipping_country' => $this->faker->country(),
            'tracking_number'  => $this->faker->boolean(50) ? strtoupper($this->faker->bothify('TRK#########')) : null,

            'notes'            => $this->faker->sentence(),
            'created_at'       => $this->faker->dateTimeBetween('-2 months', 'now'),
        ];
    }
}