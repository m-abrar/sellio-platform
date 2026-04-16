<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\View\View;

class OrderController extends Controller
{
    /**
     * Display a listing of product orders.
     */
    public function index(Request $request): View
    {
        $status = $request->status ?: 'all';

        $orders = Order::with(['user', 'items.product'])
            ->when($request->order_number, fn($q) => $q->where('order_number', 'LIKE', "%{$request->order_number}%"))
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->when($request->payment_status, fn($q) => $q->where('payment_status', $request->payment_status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.product-orders.index', compact('orders', 'status'));
    }

    /**
     * Display the specified order.
     */
    public function show($id): View
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        
        $statuses = [
            Order::STATUS_PENDING => 'Pending',
            Order::STATUS_PROCESSING => 'Processing (Processed)',
            Order::STATUS_SHIPPED => 'Shipped',
            Order::STATUS_OUT_FOR_DELIVERY => 'Out for Delivery',
            Order::STATUS_DELIVERED => 'Delivered',
            Order::STATUS_CANCELLED => 'Cancelled',
            Order::STATUS_REFUNDED => 'Refunded',
        ];

        return view('admin.product-orders.show', compact('order', 'statuses'));
    }

    /**
     * Update the status of the order.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'tracking_number' => 'nullable|string|max:100',
        ]);

        $oldStatus = $order->status;
        
        // Update order
        $order->status = $validated['status'];
        
        if (isset($validated['tracking_number'])) {
            $order->tracking_number = $validated['tracking_number'];
        }

        // Set timestamps based on status
        if ($order->status === Order::STATUS_SHIPPED && !$order->shipped_at) {
            $order->shipped_at = now();
        }

        if ($order->status === Order::STATUS_DELIVERED && !$order->delivered_at) {
            $order->delivered_at = now();
        }

        $order->save();

        // Notify customer if status changed
        if ($oldStatus !== $order->status && $order->user) {
            $order->user->notify(new \App\Notifications\OrderStatusChanged($order));
        }

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
}
