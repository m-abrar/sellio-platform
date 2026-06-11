'use client';

import React, { useState } from 'react';
import { LuxuryHeader } from './components';
import { calculateCartTotals } from '@/themes/unifieds/shared/cart';
import { CART_THUMB_PLACEHOLDER, getProductImage } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedCart } from '@/themes/unifieds/shared/useUnifiedCart';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem } = useUnifiedCart();
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useEcommerceThemeLink();

  const handleCheckout = () => {
    setSubmittingOrder(true);
    window.location.assign(themeLink('/checkout'));
  };

  const { subtotal, shipping, tax, total } = calculateCartTotals(items);

  if (loading) {
    return (
      <>
        <LuxuryHeader />
        <div className="ecl-cart-page">
          <p className="ecl-cart-loading">Loading bag...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <LuxuryHeader />
      <div className="ecl-cart-page">
        <header className="ecl-cart-header">
          <a href={themeLink('/')} className="ecl-detail-back">
            <span aria-hidden="true">&larr;</span>
            Back to maison
          </a>
          <h2 className="ecl-hero-subtitle">Your selection</h2>
          <h1 className="ecl-heading">Shopping bag</h1>
        </header>

        {items.length > 0 ? (
          <div className="ecl-cart-layout">
            <div className="ecl-cart-items">
              {items.map((item) => (
                <article className="ecl-cart-item" key={item.product.id}>
                  <div className="ecl-cart-item-image">
                    <img
                      src={getProductImage(item.product, CART_THUMB_PLACEHOLDER)}
                      alt={item.product.title}
                    />
                  </div>
                  <div className="ecl-cart-item-meta">
                    <h2 className="ecl-product-title">{item.product.title}</h2>
                    <p className="ecl-product-price">
                      ${Number(item.product.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="ecl-cart-qty">
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
                  <div className="ecl-cart-line-total">
                    ${(Number(item.product.price) * item.quantity).toLocaleString()}
                  </div>
                  <button
                    type="button"
                    className="ecl-cart-remove"
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>

            <aside className="ecl-cart-summary">
              <h2 className="ecl-heading">Order summary</h2>
              <div className="ecl-cart-summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toLocaleString()}</strong>
              </div>
              <div className="ecl-cart-summary-row">
                <span>Estimated tax</span>
                <strong>
                  ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
              <div className="ecl-cart-summary-row">
                <span>Shipping</span>
                <strong>${shipping.toLocaleString()}</strong>
              </div>
              <div className="ecl-cart-summary-total">
                <span>Total</span>
                <strong>
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
              <button
                type="button"
                className="ecl-btn-gold ecl-cart-checkout"
                onClick={handleCheckout}
                disabled={submittingOrder}
              >
                {submittingOrder ? 'Processing...' : 'Proceed to checkout'}
              </button>
            </aside>
          </div>
        ) : (
          <section className="ecl-cart-state" role="status">
            <div className="ecl-product-kicker">Empty bag</div>
            <h1 className="ecl-heading">Your bag is empty</h1>
            <p>Add pieces from explore or product detail pages.</p>
            <a href={themeLink('/explore')} className="ecl-btn-gold">
              Browse collection
            </a>
          </section>
        )}
      </div>
    </>
  );
}
