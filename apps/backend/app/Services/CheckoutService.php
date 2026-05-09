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
            $order = new Order([
                'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                'payment_method'   => $paymentMethod,
                'shipping_cost'    => $shippingData['cost'] ?? 0.00,
                'shipping_name'    => $shippingData['name'],
                'shipping_address' => $shippingData['address'],
                'shipping_city'    => $shippingData['city'],
                'shipping_state'   => $shippingData['state'] ?? null,
                'shipping_zip'     => $shippingData['zip'],
                'shipping_country' => $shippingData['country'],
            ]);

            $order->user_id = $cart->user_id;
            $order->status = 'pending';
            $order->payment_status = 'unpaid';
            $order->subtotal = $cart->calculateTotal();
            $order->total_amount = $cart->calculateTotal() + ($shippingData['cost'] ?? 0.00);
            $order->save();

            // 2. Loop through Cart Items to create Order Items (The Snapshots)
            foreach ($cart->items as $cartItem) {
                
                // Fetch details for the JSON snapshot
                $attributes = ProductAttribute::whereIn('id', $cartItem->attribute_ids ?? [])->get();
                $addons = ProductAddon::whereIn('id', $cartItem->addon_ids ?? [])->get();

                $orderItem = new OrderItem([
                    'order_id'            => $order->id,
                    'product_id'          => $cartItem->product_id,
                    'product_name'        => $cartItem->product->title,
                    'quantity'            => $cartItem->quantity,
                    'selected_attributes' => $attributes->toArray(),
                    'selected_addons'     => $addons->toArray(),
                ]);

                $orderItem->unit_price = $cartItem->unit_price;
                $orderItem->total_price = $cartItem->total_price;
                $orderItem->save();

                // 3. Secure Stock Reduction (Prevents Race Conditions)
                if ($cartItem->product->manage_stock) {
                    $product = \App\Models\Product::where('id', $cartItem->product_id)->lockForUpdate()->first();
                    if ($product && $product->stock_quantity >= $cartItem->quantity) {
                        $product->decrement('stock_quantity', $cartItem->quantity);
                    } else {
                        throw new \Exception("Insufficient stock for product: " . ($product->title ?? 'Unknown'));
                    }
                }
            }

            // 4. Clear the Cart
            $cart->items()->delete();
            $cart->delete();

            return $order;
        });
    }
}
