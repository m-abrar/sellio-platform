<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiCartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the current cart.
     */
    public function index(): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product.media']);

        return $this->successResponse(new CartResource($cart));
    }

    /**
     * Add a product to the cart.
     */
    public function add(Request $request, Product $product): JsonResponse
    {
        $data = $request->validate([
            'quantity'      => 'required|integer|min:1|max:100',
            'attribute_ids' => 'nullable|array',
            'addon_ids'     => 'nullable|array',
        ]);

        $this->cartService->addItem(
            $product->id,
            $data['quantity'],
            $data['attribute_ids'] ?? [],
            $data['addon_ids'] ?? []
        );

        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product.media']);

        return $this->successResponse(
            new CartResource($cart),
            __('Item added to cart.')
        );
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate(['quantity' => 'required|integer|min:1|max:100']);

        $this->cartService->updateQuantity($id, $request->quantity);

        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product.media']);

        return $this->successResponse(
            new CartResource($cart),
            __('Cart updated.')
        );
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(int $id): JsonResponse
    {
        $this->cartService->removeItem($id);

        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product.media']);

        return $this->successResponse(
            new CartResource($cart),
            __('Item removed from cart.')
        );
    }
}
