<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService) 
    {
        $this->cartService = $cartService;
    }

    public function index()
    {
        $cart = $this->cartService->getOrCreateCart();
        $cart->load(['items.product', 'items.product.media']);

        return view('frontend.products.cart', compact('cart'));
    }

    public function add(Request $request, Product $product)
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

        return $request->expectsJson() 
            ? response()->json(['message' => __('Success'), 'count' => $this->cartService->getCount()])
            : redirect()->route('cart.index')->with('success', __('Added to cart'));
    }

    public function update(Request $request, int $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);
        
        $this->cartService->updateQuantity($id, $request->quantity);

        return response()->json(['status' => 'success']);
    }

    public function remove(int $id)
    {
        $this->cartService->removeItem($id);
        return redirect()->back()->with('success', __('Item removed'));
    }
}
