'use client';

import React, { useState } from 'react';
import { calculateCartTotals } from '@/themes/unifieds/shared/cart';
import { CART_THUMB_PLACEHOLDER, getProductImage } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedCart } from '@/themes/unifieds/shared/useUnifiedCart';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem } = useUnifiedCart();
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useUnifiedThemeLink();

  const handleCheckout = () => {
    setSubmittingOrder(true);
    window.location.assign(themeLink('/checkout'));
  };

  const { subtotal, shipping, tax, total } = calculateCartTotals(items);

  if (loading) {
    return (
      <main className="ud-cart-page">
        <p style={{ color: 'var(--ud-slate)' }}>Loading shopping cart details...</p>
      </main>
    );
  }

  return (
    <main className="ud-cart-page">
      <div className="ud-cart-header">
        <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>CORE_CART</div>
        <h1>Shopping Cart</h1>
      </div>

      {items.length > 0 ? (
        <div className="ud-cart-layout">
          <div className="ud-cart-items">
            {items.map((item) => (
              <article className="ud-cart-item" key={item.product.id}>
                <div className="ud-cart-item-image">
                  <img src={getProductImage(item.product, CART_THUMB_PLACEHOLDER)} alt={item.product.title} />
                </div>
                <div className="ud-cart-item-meta">
                  <h2>{item.product.title}</h2>
                  <span>Unit Price: ${Number(item.product.price).toLocaleString()}</span>
                </div>
                <div className="ud-cart-qty">
                  <button type="button" onClick={() => updateQuantity(item.product.id, -1)} aria-label="Decrease quantity">-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.product.id, 1)} aria-label="Increase quantity">+</button>
                </div>
                <div className="ud-cart-line-total">
                  ${(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>
                <button type="button" className="ud-cart-remove" onClick={() => removeItem(item.product.id)} aria-label="Remove item">
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="ud-cart-summary">
            <h2>Order Summary</h2>
            <div className="ud-cart-summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            <div className="ud-cart-summary-row">
              <span>Estimated Tax (8.5%)</span>
              <strong>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="ud-cart-summary-row">
              <span>Shipping &amp; Handling</span>
              <strong>${shipping.toLocaleString()}</strong>
            </div>
            <div className="ud-cart-summary-total">
              <span>Total</span>
              <strong>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
            <button type="button" className="core-btn-primary ud-cart-checkout" onClick={handleCheckout} disabled={submittingOrder}>
              {submittingOrder ? 'CHECKING OUT...' : 'PROCEED TO CHECKOUT'}
            </button>
          </aside>
        </div>
      ) : (
        <section className="ud-cart-state" role="status">
          <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>EMPTY_CART</div>
          <h1>Your cart is empty</h1>
          <p>Add catalog records from the explore directory or product detail pages.</p>
          <a href={themeLink('/explore')} className="core-btn-primary">Browse Directory</a>
        </section>
      )}
    </main>
  );
}
