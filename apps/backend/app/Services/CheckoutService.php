<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductAttribute;
use App\Models\ProductAddon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutService
{
    /**
     * Convert a Cart into a permanent Order.
     */
    public function process(Cart $cart, array $shippingData, string $paymentMethod): Order
    {
        return DB::transaction(function () use ($cart, $shippingData, $paymentMethod) {
            
            // 1. Create the Order (The Parent)
            $order = Order::create([
                'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                'user_id'          => $cart->user_id,
                'status'           => 'pending',
                'payment_status'   => 'unpaid',
                'payment_method'   => $paymentMethod,
                'subtotal'         => $cart->calculateTotal(),
                'shipping_cost'    => $shippingData['cost'] ?? 0.00,
                'total_amount'     => $cart->calculateTotal() + ($shippingData['cost'] ?? 0.00),
                'shipping_name'    => $shippingData['name'],
                'shipping_address' => $shippingData['address'],
                'shipping_city'    => $shippingData['city'],
                'shipping_state'   => $shippingData['state'] ?? null,
                'shipping_zip'     => $shippingData['zip'],
                'shipping_country' => $shippingData['country'],
            ]);

            // 2. Loop through Cart Items to create Order Items (The Snapshots)
            foreach ($cart->items as $cartItem) {
                
                // Fetch details for the JSON snapshot
                $attributes = ProductAttribute::whereIn('id', $cartItem->attribute_ids ?? [])->get();
                $addons = ProductAddon::whereIn('id', $cartItem->addon_ids ?? [])->get();

                OrderItem::create([
                    'order_id'            => $order->id,
                    'product_id'          => $cartItem->product_id,
                    'product_name'        => $cartItem->product->title,
                    'quantity'            => $cartItem->quantity,
                    'unit_price'          => $cartItem->unit_price,
                    'total_price'         => $cartItem->total_price,
                    'selected_attributes' => $attributes->toArray(),
                    'selected_addons'     => $addons->toArray(),
                ]);

                // 3. (Optional) Reduce Stock logic here
                if ($cartItem->product->manage_stock) {
                    $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
                }
            }

            // 4. Clear the Cart
            $cart->items()->delete();
            $cart->delete();

            return $order;
        });
    }
}
