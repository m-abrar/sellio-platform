'use client';

import React, { useState } from 'react';
import { calculateCartTotals } from '@/themes/unifieds/shared/cart';
import { CART_THUMB_PLACEHOLDER, getProductImage } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedCart } from '@/themes/unifieds/shared/useUnifiedCart';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import './subpages.css';

export type UnifiedCartPageProps = {
  eyebrow?: string;
  title?: string;
  primaryButtonClass?: string;
};

export default function UnifiedCartPage({
  eyebrow = 'SHOPPING_CART',
  title = 'Shopping Cart',
  primaryButtonClass = 'uni-btn-primary',
}: UnifiedCartPageProps) {
  const { items, loading, updateQuantity, removeItem } = useUnifiedCart();
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useUnifiedThemeLink();
  const buttonClass = `${primaryButtonClass} uni-cart-checkout`.trim();

  const handleCheckout = () => {
    setSubmittingOrder(true);
    window.location.assign(themeLink('/checkout'));
  };

  const { subtotal, shipping, tax, total } = calculateCartTotals(items);

  if (loading) {
    return (
      <main className="uni-cart-page">
        <p style={{ color: '#64748b' }}>Loading shopping cart details...</p>
      </main>
    );
  }

  return (
    <main className="uni-cart-page">
      <div className="uni-cart-header">
        <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>
          {eyebrow}
        </div>
        <h1>{title}</h1>
      </div>

      {items.length > 0 ? (
        <div className="uni-cart-layout">
          <div className="uni-cart-items">
            {items.map((item) => (
              <article className="uni-cart-item" key={item.product.id}>
                <div className="uni-cart-item-image">
                  <img
                    src={getProductImage(item.product, CART_THUMB_PLACEHOLDER)}
                    alt={item.product.title}
                  />
                </div>
                <div className="uni-cart-item-meta">
                  <h2>{item.product.title}</h2>
                  <span>Unit Price: ${Number(item.product.price).toLocaleString()}</span>
                </div>
                <div className="uni-cart-qty">
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
                <div className="uni-cart-line-total">
                  ${(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>
                <button
                  type="button"
                  className="uni-cart-remove"
                  onClick={() => removeItem(item.product.id)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="uni-cart-summary">
            <h2>Order Summary</h2>
            <div className="uni-cart-summary-row">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            <div className="uni-cart-summary-row">
              <span>Estimated Tax (8.5%)</span>
              <strong>
                ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div className="uni-cart-summary-row">
              <span>Shipping &amp; Handling</span>
              <strong>${shipping.toLocaleString()}</strong>
            </div>
            <div className="uni-cart-summary-total">
              <span>Total</span>
              <strong>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <button
              type="button"
              className={buttonClass}
              onClick={handleCheckout}
              disabled={submittingOrder}
            >
              {submittingOrder ? 'CHECKING OUT...' : 'PROCEED TO CHECKOUT'}
            </button>
          </aside>
        </div>
      ) : (
        <section className="uni-cart-state" role="status">
          <div className="uni-mono" style={{ color: '#2563eb', marginBottom: '1rem' }}>
            EMPTY_CART
          </div>
          <h1>Your cart is empty</h1>
          <p>Add listings from the explore directory or product detail pages.</p>
          <a href={themeLink('/explore')} className={primaryButtonClass}>
            Browse Directory
          </a>
        </section>
      )}
    </main>
  );
}
