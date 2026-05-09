<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class OrderController
 * Orchestrates the administrative lifecycle of product orders, managing fulfillment, 
 * inventory synchronization, and automated customer notifications.
 */
class OrderController extends Controller
{
    /**
     * Display a filtered and paginated list of all product orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        $status = $request->query('status', 'all');

        $orders = Order::with(['user', 'items.product'])
            ->when($request->order_number, fn($q) => $q->where('order_number', 'LIKE', "%{$request->order_number}%"))
            ->when($request->product_name, fn($q) => $q->whereHas('items.product', fn($pq) => $pq->where('name', 'LIKE', "%{$request->product_name}%")))
            ->when($status !== 'all', fn($q) => $q->where('status', $status))
            ->when($request->payment_status, fn($q) => $q->where('payment_status', $request->payment_status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.product-orders.index', compact('orders', 'status'));
    }

    /**
     * Show the interface for initializing a new manual order.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $users = User::select('id', 'name', 'email')->get();
        $products = Product::where('is_published', true)->select('id', 'name', 'price', 'manage_stock', 'stock_quantity')->get();
        
        return view('admin.product-orders.create', compact('users', 'products'));
    }

    /**
     * Store a manually created order and synchronize inventory and line items.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id'          => 'required|exists:users,id',
            'items'            => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'status'           => 'required|string|max:255',
            'shipping_name'    => 'required|string|max:255',
            'shipping_address' => 'required|string',
            'shipping_city'    => 'required|string|max:255',
            'shipping_zip'     => 'required|string|max:20',
        ]);

        try {
            DB::transaction(function () use ($request) {
                $order = new Order([
                    'order_number'     => 'ORD-' . strtoupper(Str::random(10)),
                    'payment_method'   => 'manual',
                    'shipping_name'    => $request->shipping_name,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city'    => $request->shipping_city,
                    'shipping_zip'     => $request->shipping_zip,
                    'notes'            => $request->notes,
                ]);

                $order->user_id = $request->user_id;
                $order->status = $request->status;
                $order->payment_status = 'paid';
                $order->subtotal = $request->subtotal;
                $order->shipping_cost = $request->shipping_cost;
                $order->total_amount = $request->total_amount;
                $order->save();

                foreach ($request->items as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    
                    $orderItem = new OrderItem([
                        'order_id'     => $order->id,
                        'product_id'   => $product->id,
                        'product_name' => $product->name,
                        'quantity'     => $item['quantity'],
                    ]);

                    $orderItem->unit_price = $item['unit_price'];
                    $orderItem->total_price = $item['unit_price'] * $item['quantity'];
                    $orderItem->save();

                    if ($product->manage_stock) {
                        $product->decrement('stock_quantity', $item['quantity']);
                    }
                }
            });

            return redirect()->route('admin.product-orders.index')
                             ->with('success', __('Manual order initialized and synchronized successfully.'));

        } catch (\Exception $e) {
            return back()->with('error', __('Critical synchronization error: :msg', ['msg' => $e->getMessage()]));
        }
    }

    /**
     * Display the comprehensive details of a specific order.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\View\View
     */
    public function show(Order $order): View
    {
        $order->load(['user', 'items.product']);
        
        $statuses = [
            Order::STATUS_PENDING           => __('Pending'),
            Order::STATUS_PROCESSING        => __('Processing'),
            Order::STATUS_SHIPPED           => __('Shipped'),
            Order::STATUS_OUT_FOR_DELIVERY  => __('Out for Delivery'),
            Order::STATUS_DELIVERED         => __('Delivered'),
            Order::STATUS_CANCELLED         => __('Cancelled'),
            Order::STATUS_REFUNDED          => __('Refunded'),
        ];

        return view('admin.product-orders.show', compact('order', 'statuses'));
    }

    /**
     * Update the fulfillment status of an order and trigger relevant notifications.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status'          => 'required|string|max:255',
            'tracking_number' => 'nullable|string|max:100',
        ]);

        $oldStatus = $order->status;
        $order->status = $validated['status'];
        
        if (isset($validated['tracking_number'])) {
            $order->tracking_number = $validated['tracking_number'];
        }

        // Fulfillment timestamp audit
        if ($order->status === Order::STATUS_SHIPPED && !$order->shipped_at) {
            $order->shipped_at = now();
        }

        if ($order->status === Order::STATUS_DELIVERED && !$order->delivered_at) {
            $order->delivered_at = now();
        }

        $order->save();

        // Automated Notification Dispatch
        if ($oldStatus !== $order->status && $order->user) {
            $order->user->notify(new OrderStatusChanged($order));
        }

        return redirect()->back()->with('success', __('Order status updated successfully.'));
    }

    /**
     * Batch update multiple orders to a specified fulfillment status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids'         => 'required|array',
            'ids.*'       => 'exists:orders,id',
            'bulk_status' => 'required|string|max:255',
        ]);

        $orders = Order::whereIn('id', $validated['ids'])->get();
        $count = 0;

        foreach ($orders as $order) {
            $oldStatus = $order->status;
            $order->status = $validated['bulk_status'];
            
            if ($order->status === Order::STATUS_SHIPPED && !$order->shipped_at) {
                $order->shipped_at = now();
            }

            if ($order->status === Order::STATUS_DELIVERED && !$order->delivered_at) {
                $order->delivered_at = now();
            }

            $order->save();
            $count++;

            if ($oldStatus !== $order->status && $order->user) {
                $order->user->notify(new OrderStatusChanged($order));
            }
        }

        return redirect()->back()->with('success', __(':count orders updated successfully.', ['count' => $count]));
    }
}
