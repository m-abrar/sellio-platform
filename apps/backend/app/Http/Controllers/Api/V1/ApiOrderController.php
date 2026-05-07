<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class ApiOrderController
 * Orchestrates the API-driven lifecycle of marketplace orders, managing 
 * transactional processing, order history retrieval, and checkout coordination.
 */
class ApiOrderController extends Controller
{
    /**
     * Internal service coordinator for order processing and checkout logic.
     * @var CheckoutService
     */
    protected CheckoutService $checkoutService;

    /**
     * ApiOrderController constructor.
     * @param CheckoutService $checkoutService
     */
    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    /**
     * List all orders for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('items.product')
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return $this->successResponse(OrderResource::collection($orders));
    }

    /**
     * Display a specific order by order number.
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::where('user_id', Auth::id())
            ->where('order_number', $orderNumber)
            ->with('items.product')
            ->firstOrFail();

        return $this->successResponse(new OrderResource($order));
    }

    /**
     * Place a new order from the authenticated user's cart.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_name'    => 'required|string|max:255',
            'shipping_address' => 'required|string',
            'shipping_city'    => 'required|string',
            'shipping_state'   => 'nullable|string',
            'shipping_zip'     => 'required|string|max:20',
            'shipping_country' => 'required|string',
            'payment_method'   => 'required|string',
        ]);

        $cart = Cart::where('user_id', Auth::id())
            ->with(['items.product', 'items.cart'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return $this->errorResponse(__('Your cart is empty.'), 422);
        }

        try {
            $order = $this->checkoutService->process(
                $cart,
                [
                    'name'    => $validated['shipping_name'],
                    'address' => $validated['shipping_address'],
                    'city'    => $validated['shipping_city'],
                    'state'   => $validated['shipping_state'] ?? null,
                    'zip'     => $validated['shipping_zip'],
                    'country' => $validated['shipping_country'],
                ],
                $validated['payment_method']
            );

            $order->load('items.product');

            return $this->successResponse(
                new OrderResource($order),
                __('Order placed successfully.'),
                201
            );
        } catch (\Exception $e) {
            logger()->error('API Order failed: ' . $e->getMessage());
            return $this->errorResponse(__('Failed to process your order. Please try again.'), 500);
        }
    }
}
