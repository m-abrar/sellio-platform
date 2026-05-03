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
            ->when($request->product_name, fn($q) => $q->whereHas('items.product', fn($pq) => $pq->where('name', 'LIKE', "%{$request->product_name}%")))->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->when($request->payment_status, fn($q) => $q->where('payment_status', $request->payment_status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.product-orders.index', compact('orders', 'status'));
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(): View
    {
        $users = \App\Models\User::all();
        $products = \App\Models\Product::where('is_published', 1)->get();
        
        return view('admin.product-orders.create', compact('users', 'products'));
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric',
            'status' => 'required|string',
            'shipping_name' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_zip' => 'required|string',
        ]);

        try {
            \Illuminate\Support\Facades\DB::transaction(function () use ($request) {
                $order = Order::create([
                    'order_number' => 'ORD-' . strtoupper(\Illuminate\Support\Str::random(10)),
                    'user_id' => $request->user_id,
                    'status' => $request->status,
                    'payment_status' => 'paid', // Assuming manual entry usually implies payment received
                    'payment_method' => 'manual',
                    'subtotal' => $request->subtotal,
                    'shipping_cost' => $request->shipping_cost,
                    'total_amount' => $request->total_amount,
                    'shipping_name' => $request->shipping_name,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city' => $request->shipping_city,
                    'shipping_zip' => $request->shipping_zip,
                    'notes' => $request->notes,
                ]);

                foreach ($request->items as $item) {
                    $product = \App\Models\Product::find($item['product_id']);
                    
                    \App\Models\OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'product_name' => $product->name,
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $item['unit_price'] * $item['quantity'],
                    ]);

                    // Inventory adjustment if applicable
                    if ($product->manage_stock) {
                        $product->decrement('stock_quantity', $item['quantity']);
                    }
                }
            });

            return redirect()->route('admin.product-orders.index')->with('success', 'Manual order has been successfully initialized and synchronized.');
        } catch (\Exception $e) {
            return back()->with('error', 'Critical synchronization error: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): View
    {
        $order->load(['user', 'items.product']);
        
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

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:orders,id',
            'bulk_status' => 'required|string',
        ]);

        $orders = Order::whereIn('id', $validated['ids'])->get();
        $count = 0;

        foreach ($orders as $order) {
            $oldStatus = $order->status;
            $order->status = $validated['bulk_status'];
            
            // Set timestamps based on status
            if ($order->status === Order::STATUS_SHIPPED && !$order->shipped_at) {
                $order->shipped_at = now();
            }

            if ($order->status === Order::STATUS_DELIVERED && !$order->delivered_at) {
                $order->delivered_at = now();
            }

            $order->save();
            $count++;

            // Notify customer if status changed
            if ($oldStatus !== $order->status && $order->user) {
                $order->user->notify(new \App\Notifications\OrderStatusChanged($order));
            }
        }

        return redirect()->back()->with('success', $count . ' orders updated successfully.');
    }
}
