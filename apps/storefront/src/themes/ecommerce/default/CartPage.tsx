'use client';

import React, { useState } from 'react';
import { calculateCartTotals } from '@/themes/unifieds/shared/cart';
import { CART_THUMB_PLACEHOLDER, getProductImage } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedCart } from '@/themes/unifieds/shared/useUnifiedCart';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem, clearCart } = useUnifiedCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useEcommerceThemeLink();

  const handleCheckout = () => {
    setSubmittingOrder(true);
    window.setTimeout(() => {
      setSubmittingOrder(false);
      setCheckoutComplete(true);
      clearCart();
    }, 1500);
  };

  const { subtotal, shipping, tax, total } = calculateCartTotals(items);

  if (loading) {
    return (
      <main className="ed-cart-page">
        <p className="ed-cart-loading">Loading cart...</p>
      </main>
    );
  }

  if (checkoutComplete) {
    return (
      <main className="ed-cart-page">
        <section className="ed-cart-state" role="status">
          <div className="ed-mono" style={{ marginBottom: '1rem' }}>
            ORDER_CONFIRMED
          </div>
          <h1>Order confirmed</h1>
          <p>Your checkout simulation completed successfully. Continue browsing the collection.</p>
          <a href={themeLink('/')} className="ed-btn-primary ed-inline-cta">
            Continue shopping
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="ed-cart-page">
      <header className="ed-cart-header">
        <a href={themeLink('/')} className="ed-detail-back">
          <span aria-hidden="true">←</span>
          Back to shop
        </a>
        <div className="ed-mono" style={{ marginBottom: '1rem' }}>
          SHOPPING_CART
        </div>
        <h1>Your cart</h1>
      </header>

      {items.length > 0 ? (
        <div className="ed-cart-layout">
          <div className="ed-cart-items">
            {items.map((item) => (
              <article className="ed-cart-item" key={item.product.id}>
                <div className="ed-cart-item-image">
                  <img
                    src={getProductImage(item.product, CART_THUMB_PLACEHOLDER)}
                    alt={item.product.title}
                  />
                </div>
                <div className="ed-cart-item-meta">
                  <h2>{item.product.title}</h2>
                  <span>Unit price: ${Number(item.product.price).toLocaleString()}</span>
                </div>
                <div className="ed-cart-qty">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, -1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="ed-cart-line-total">
                  ${(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>
                <button
                  type="button"
                  className="ed-cart-remove"
                  onClick={() => removeItem(item.product.id)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="ed-cart-summary">
            <h2>Order summary</h2>
            <div className="ed-cart-summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            <div className="ed-cart-summary-row">
              <span>Estimated tax (8.5%)</span>
              <strong>
                ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="ed-cart-summary-row">
              <span>Shipping</span>
              <strong>${shipping.toLocaleString()}</strong>
            </div>
            <div className="ed-cart-summary-total">
              <span>Total</span>
              <strong>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <button
              type="button"
              className="ed-btn-primary ed-cart-checkout"
              onClick={handleCheckout}
              disabled={submittingOrder}
            >
              {submittingOrder ? 'Processing...' : 'Proceed to checkout'}
            </button>
          </aside>
        </div>
      ) : (
        <section className="ed-cart-state" role="status">
          <div className="ed-mono" style={{ marginBottom: '1rem' }}>
            EMPTY_CART
          </div>
          <h1>Your cart is empty</h1>
          <p>Add products from explore or product detail pages.</p>
          <a href={themeLink('/explore')} className="ed-btn-primary ed-inline-cta">
            Browse collection
          </a>
        </section>
      )}
    </main>
  );
}
