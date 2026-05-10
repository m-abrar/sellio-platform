<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

/**
 * Class OrderController
 * Handles the finalization of the checkout lifecycle, including cart-to-order conversion
 * and subsequent order presentation.
 */
class OrderController extends Controller
{
    /**
     * The order processing service.
     *
     * @var \App\Services\CheckoutService
     */
    protected $checkoutService;

    /**
     * OrderController constructor.
     *
     * @param  \App\Services\CheckoutService  $checkoutService
     */
    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    /**
     * Process the conversion of a validated cart into a formal Order.
     *
     * @param  \App\Http\Requests\StoreOrderRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(\App\Http\Requests\StoreOrderRequest $request): RedirectResponse
    {
        $cart = Cart::where('user_id', Auth::id())
                    ->with(['items.product', 'items.cart'])
                    ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->back()->with('error', __('Your cart is empty.'));
        }

        try {
            $order = $this->checkoutService->process($cart, $request->validated(), $request->payment_method);

            return redirect()->route('orders.show', $order->order_number)
                             ->with('success', __('Thank you! Your order has been placed.'));
                             
        } catch (\Exception $e) {
            Log::error("Order Processing Failed: " . $e->getMessage());
            return redirect()->back()->with('error', __('There was an issue processing your order. Please try again.'));
        }
    }

    /**
     * Display the details and status of a specific order.
     *
     * @param  string  $orderNumber
     * @return \Illuminate\View\View
     */
    public function show(string $orderNumber): View
    {
        $order = Auth::user()->orders()
                    ->where('order_number', $orderNumber)
                    ->with('items')
                    ->firstOrFail();

        return view('frontend.orders.show', compact('order'));
    }
}
