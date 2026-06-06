<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\ProductAttribute;
use App\Models\ProductAddon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class CheckoutService
 *
 * Handles the conversion of a temporary shopping cart into a permanent, legal Order record.
 * Manages inventory locking, JSON snapshotting of product variants, and database transactions.
 */
class CheckoutService
{
    /**
     * Convert a Cart into a permanent Order record.
     *
     * This process is wrapped in a database transaction to ensure atomicity.
     * It handles:
     * 1. Parent order creation with calculated totals.
     * 2. Snapshotting of product attributes and addons to prevent future price/name changes from affecting history.
     * 3. Secure stock reduction with pessimistic locking.
     * 4. Cart cleanup.
     *
     * @param Cart $cart The source cart to be processed.
     * @param array $shippingData Validated shipping and cost data from the checkout form.
     * @param string $paymentMethod The slug of the selected payment gateway.
     * @return Order The newly created order record.
     * @throws \Exception If stock is insufficient or a database error occurs.
     */
    public function process(Cart $cart, array $shippingData, string $paymentMethod): Order
    {
        return DB::transaction(function () use ($cart, $shippingData, $paymentMethod) {
            
            $shippingCost = (float) ($shippingData['shipping_cost'] ?? $shippingData['cost'] ?? 0.00);
            $shippingName = $shippingData['shipping_name'] ?? $shippingData['name'];
            $shippingAddress = $shippingData['shipping_address'] ?? $shippingData['address'];
            $shippingCity = $shippingData['shipping_city'] ?? $shippingData['city'];
            $shippingState = $shippingData['shipping_state'] ?? $shippingData['state'] ?? null;
            $shippingZip = $shippingData['shipping_zip'] ?? $shippingData['zip'];
            $shippingCountry = $shippingData['shipping_country'] ?? $shippingData['country'];

            // 1. Create the Order (The Parent)
            $order = new Order([
                'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                'payment_method'   => $paymentMethod,
                'shipping_cost'    => $shippingCost,
                'shipping_name'    => $shippingName,
                'shipping_address' => $shippingAddress,
                'shipping_city'    => $shippingCity,
                'shipping_state'   => $shippingState,
                'shipping_zip'     => $shippingZip,
                'shipping_country' => $shippingCountry,
            ]);

            $order->user_id = $cart->user_id;
            $order->status = 'pending';
            $order->payment_status = 'unpaid';
            $order->subtotal = $cart->calculateTotal();
            $order->total_amount = $cart->calculateTotal() + $shippingCost;
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
                        throw new \Exception(__('Insufficient stock for product: :title', ['title' => $product->title ?? 'Unknown']));
                    }
                }
            }

            // 4. Clear the Cart
            $cart->items()->delete();
            $cart->delete();

            return $order;
        });
    }

    public function recordOrderPayment(
        Order $order,
        string $gateway,
        float $amount,
        string $status,
        ?string $reference = null,
        ?string $message = null
    ): Payment {
        return DB::transaction(function () use ($order, $gateway, $amount, $status, $reference, $message) {
            $payment = Payment::query()
                ->where('payable_type', Order::class)
                ->where('payable_id', $order->id)
                ->when($reference, fn ($query) => $query->where('transaction_id', $reference))
                ->first();

            if (!$payment) {
                $payment = new Payment([
                    'payable_type' => Order::class,
                    'payable_id' => $order->id,
                ]);
            }

            $payment->user_id = $order->user_id;
            $payment->amount = $amount;
            $payment->currency = 'USD';
            $payment->transaction_id = $reference;
            $payment->payment_method = $gateway;
            $payment->status = $status;
            $payment->paid_at = $status === Payment::STATUS_COMPLETED ? now() : null;
            $payment->admin_note = $message;
            $payment->save();

            return $payment;
        });
    }
}
