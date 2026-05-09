<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartQuantityRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

/**
 * Class CartController
 * Manages the shopping cart lifecycle, including item additions, quantity updates, and persistence.
 */
class CartController extends Controller
{
    /**
     * The cart management service.
     *
     * @var \App\Services\CartService
     */
    protected $cartService;

    /**
     * CartController constructor.
     *
     * @param  \App\Services\CartService  $cartService
     */
    public function __construct(CartService $cartService) 
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the current shopping cart contents.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product', 'items.product.media']);

        return view('frontend.products.cart', compact('cart'));
    }

    /**
     * Add a product to the cart with optional attributes and addons.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function add(AddToCartRequest $request, Product $product): JsonResponse|RedirectResponse
    {
        $data = $request->validated();

        $this->cartService->addItem(
            $product->id, 
            $data['quantity'], 
            $data['attribute_ids'] ?? [], 
            $data['addon_ids'] ?? []
        );

        return $request->expectsJson() 
            ? response()->json(['message' => __('Success'), 'count' => $this->cartService->getCount()])
            : redirect()->route('cart.index')->with('success', __('Added to cart'));
    }

    /**
     * Update the quantity of a specific cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateCartQuantityRequest $request, int $id): JsonResponse
    {
        $this->cartService->updateQuantity($id, $request->validated()['quantity']);

        return response()->json(['status' => 'success']);
    }

    /**
     * Remove an item from the cart.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function remove(int $id): RedirectResponse
    {
        $this->cartService->removeItem($id);
        return redirect()->back()->with('success', __('Item removed'));
    }
}
