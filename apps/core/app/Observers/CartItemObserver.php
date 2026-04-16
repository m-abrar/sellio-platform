<?php

namespace App\Observers;

use App\Models\CartItem;

class CartItemObserver
{
    /**
     * Handle the CartItem "created" event.
     */
    public function created(CartItem $cartItem): void
    {
        $this->updateCartTotal($cartItem);
    }

    /**
     * Handle the CartItem "updated" event.
     */
    public function updated(CartItem $cartItem): void
    {
        // Only refresh if quantity or unit_price actually changed
        if ($cartItem->isDirty(['quantity', 'unit_price'])) {
            $this->updateCartTotal($cartItem);
        }
    }

    /**
     * Handle the CartItem "deleted" event.
     */
    public function deleted(CartItem $cartItem): void
    {
        $this->updateCartTotal($cartItem);
    }

    /**
     * Recalculate and persist the grand total to the parent Cart.
     * This prevents N+1 issues when displaying the cart total in headers.
     */
    protected function updateCartTotal(CartItem $cartItem): void
    {
        $cart = $cartItem->cart;

        if ($cart) {
            // We use a fresh query to get the sum of all items to ensure accuracy
            $newTotal = $cart->items()->sum(\DB::raw('quantity * unit_price'));
            
            $cart->update([
                'temp_total' => $newTotal
            ]);
        }
    }
}
