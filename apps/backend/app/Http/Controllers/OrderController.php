<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $checkoutService;

    /**
     * Inject the CheckoutService to handle the heavy lifting.
     */
    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    /**
     * Handle the final step of the checkout process.
     */
    public function store(Request $request)
    {
        // 1. Find the user's cart
        $cart = Cart::where('user_id', Auth::id())
                    ->with(['items.product', 'items.cart'])
                    ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->back()->with('error', 'Your cart is empty.');
        }

        // 2. Validate the request (Shipping & Payment)
        $validated = $request->validate([
            'shipping_name'    => 'required|string|max:255',
            'shipping_address' => 'required|string',
            'shipping_city'    => 'required|string',
            'shipping_zip'     => 'required|string|max:20',
            'shipping_country' => 'required|string',
            'payment_method'   => 'required|string',
        ]);

        try {
            // 3. Use the service to convert Cart -> Order
            $order = $this->checkoutService->process($cart, $validated, $request->payment_method);

            // 4. Redirect to a success page or the specific order details
            return redirect()->route('orders.show', $order->order_number)
                             ->with('success', 'Thank you! Your order has been placed.');
                             
        } catch (\Exception $e) {
            // Log the error and tell the user something went wrong
            logger()->error("Order failed: " . $e->getMessage());
            return redirect()->back()->with('error', 'There was an issue processing your order. Please try again.');
        }
    }

    /**
     * Display the order confirmation/invoice.
     */
    public function show($orderNumber)
    {
        $order = Auth::user()->orders()
                    ->where('order_number', $orderNumber)
                    ->with('items')
                    ->firstOrFail();

        return view('frontend.orders.show', compact('order'));
    }
}
