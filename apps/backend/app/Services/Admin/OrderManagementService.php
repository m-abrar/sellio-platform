<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderManagementService
{
    /**
     * Create a manual order.
     */
    public function createManualOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = new Order();
            $order->order_number     = 'ORD-' . strtoupper(Str::random(10));
            $order->payment_method   = 'manual';
            $order->shipping_name    = $data['shipping_name'];
            $order->shipping_address = $data['shipping_address'];
            $order->shipping_city    = $data['shipping_city'];
            $order->shipping_zip     = $data['shipping_zip'];
            $order->shipping_country = $data['shipping_country'] ?? 'USA';
            $order->tax_amount       = $data['tax_amount'] ?? 0;
            $order->discount_amount  = $data['discount_amount'] ?? 0;
            $order->notes            = $data['notes'] ?? null;
            $order->user_id          = $data['user_id'];
            $order->status           = $data['status'];
            $order->payment_status   = 'paid';
            $order->subtotal         = $data['subtotal'];
            $order->shipping_cost    = $data['shipping_cost'];
            $order->total_amount     = $data['total_amount'];
            $order->save();

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                $orderItem = new OrderItem([
                    'order_id'     => $order->id,
                    'product_id'   => $product->id,
                    'product_name' => $product->title, // Model uses 'title' in Product
                    'quantity'     => $item['quantity'],
                ]);

                $orderItem->unit_price = $item['unit_price'];
                $orderItem->total_price = $item['unit_price'] * $item['quantity'];
                $orderItem->save();

                if ($product->manage_stock) {
                    $product->decrement('stock_quantity', $item['quantity']);
                }
            }

            return $order;
        });
    }

    /**
     * Update order status and trigger notifications.
     */
    public function updateOrderStatus(Order $order, array $data): Order
    {
        $oldStatus = $order->status;
        $order->status = $data['status'];
        
        if (isset($data['tracking_number'])) {
            $order->tracking_number = $data['tracking_number'];
        }

        if ($order->status === Order::STATUS_SHIPPED && !$order->shipped_at) {
            $order->shipped_at = now();
        }

        if ($order->status === Order::STATUS_DELIVERED && !$order->delivered_at) {
            $order->delivered_at = now();
        }

        $order->save();

        if ($oldStatus !== $order->status && $order->user) {
            $order->user->notify(new OrderStatusChanged($order));
        }

        return $order;
    }

    /**
     * Perform bulk status updates.
     */
    public function bulkUpdateStatus(array $ids, string $status): int
    {
        $orders = Order::whereIn('id', $ids)->get();
        $count = 0;

        foreach ($orders as $order) {
            $this->updateOrderStatus($order, ['status' => $status]);
            $count++;
        }

        return $count;
    }
}
