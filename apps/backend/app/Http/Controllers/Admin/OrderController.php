<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use App\Services\Admin\OrderManagementService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
     * @var \App\Services\Admin\OrderManagementService
     */
    protected $orderService;

    /**
     * OrderController constructor.
     *
     * @param \App\Services\Admin\OrderManagementService $orderService
     */
    public function __construct(OrderManagementService $orderService)
    {
        $this->orderService = $orderService;
    }

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
            ->when($request->product_name, fn($q) => $q->whereHas('items.product', fn($pq) => $pq->where('title', 'LIKE', "%{$request->product_name}%")))
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
        $products = Product::active()->select('id', 'title', 'base_price', 'sale_price', 'on_sale', 'manage_stock', 'stock_quantity')->get();

        
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
        $validated = $request->validate([
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
            'subtotal'         => 'required|numeric',
            'shipping_cost'    => 'required|numeric',
            'total_amount'     => 'required|numeric',
            'notes'            => 'nullable|string'
        ]);

        try {
            $this->orderService->createManualOrder($validated);

            return redirect()->route('admin.product-orders.index')
                             ->with('success', __('Manual order initialized and synchronized successfully.'));

        } catch (Exception $e) {
            Log::error("Order Creation Failed: " . $e->getMessage());
            return back()->withInput()->with('error', __('Critical synchronization error: :msg', ['msg' => $e->getMessage()]));
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

        $this->orderService->updateOrderStatus($order, $validated);

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

        $count = $this->orderService->bulkUpdateStatus($validated['ids'], $validated['bulk_status']);

        return redirect()->back()->with('success', __(':count orders updated successfully.', ['count' => $count]));
    }
}
