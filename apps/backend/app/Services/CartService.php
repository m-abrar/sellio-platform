<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductAddon;
use Illuminate\Support\Facades\{Auth, Session, DB};

class CartService
{
    /**
     * Get or Create the current active cart instance.
     */
    public function getOrCreateCart(): Cart
    {
        $identifier = Auth::check() ? ['user_id' => Auth::id()] : ['session_id' => Session::getId()];
        return Cart::firstOrCreate($identifier);
    }

    /**
     * Add or increment an item in the cart with price snapshotting.
     */
    public function addItem(int $productId, int $quantity = 1, array $attributes = [], array $addons = []): CartItem
    {
        return DB::transaction(function () use ($productId, $quantity, $attributes, $addons) {
            $product = Product::findOrFail($productId);
            $cart = $this->getOrCreateCart();

            // Calculate current snapshot price
            $unitPrice = $product->price;
            if (!empty($attributes)) {
                $unitPrice += ProductAttribute::whereIn('id', $attributes)->sum('additional_price');
            }
            if (!empty($addons)) {
                $unitPrice += ProductAddon::whereIn('id', $addons)->sum('price');
            }

            // Find match based on product and configurations
            $item = $cart->items()->where('product_id', $productId)
                ->whereJsonContains('attribute_ids', $attributes)
                ->whereJsonContains('addon_ids', $addons)
                ->first();

            if ($item) {
                $item->increment('quantity', $quantity);
                $item->unit_price = $unitPrice; // Set explicitly after removing from fillable
                $item->save();
                return $item;
            }

            $item = $cart->items()->make([
                'product_id'    => $productId,
                'quantity'      => $quantity,
                'attribute_ids' => $attributes,
                'addon_ids'     => $addons,
            ]);
            $item->unit_price = $unitPrice; // Set explicitly
            $item->save();

            return $item;
        });
    }

    /**
     * Update quantity with ownership validation.
     */
    public function updateQuantity(int $itemId, int $quantity): bool
    {
        $item = CartItem::where('id', $itemId)
            ->where('cart_id', $this->getOrCreateCart()->id)
            ->firstOrFail();

        return $item->update(['quantity' => max(1, $quantity)]);
    }

    /**
     * Remove item with ownership validation.
     */
    public function removeItem(int $itemId): void
    {
        CartItem::where('id', $itemId)
            ->where('cart_id', $this->getOrCreateCart()->id)
            ->delete();
    }

    public function clearCart(): void
    {
        $this->getOrCreateCart()->items()->delete();
    }

    public function getCount(): int
    {
        $cart = $this->getOrCreateCart();
        return (int) $cart->items()->sum('quantity');
    }

    /**
     * Transition guest items to the authenticated user.
     * This is typically called from a Login Listener or AppServiceProvider.
     */
    public function mergeGuestCart(int $userId): void
    {
        // We delegate the heavy SQL lifting to the Cart model's static method
        // which we defined earlier to handle JSON matching and quantity increments.
        \App\Models\Cart::mergeGuestCart(session()->getId(), $userId);
        
        // Mark as processed to prevent redundant merges in the same session
        session()->put('cart_merging_processed', true);
    }
}
