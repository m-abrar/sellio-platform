'use client';

import React, { useState } from 'react';
import { calculateCartTotals } from '@/themes/unifieds/shared/cart';
import { CART_THUMB_PLACEHOLDER, getProductImage } from '@/themes/unifieds/shared/product-utils';
import { useUnifiedCart } from '@/themes/unifieds/shared/useUnifiedCart';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import type { EcommerceSubpagePrefix } from '@/themes/ecommerce/shared/EcommerceExplorePage';

interface CartPageProps {
  classPrefix: EcommerceSubpagePrefix;
  shell?: (content: React.ReactNode) => React.ReactNode;
}

function cls(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}

export default function EcommerceCartPage({ classPrefix: prefix, shell }: CartPageProps) {
  const { items, loading, updateQuantity, removeItem, clearCart } = useUnifiedCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useEcommerceThemeLink();

  const monoClass = prefix === 'el' ? 'el-tech-font' : `${prefix}-mono`;
  const primaryBtnClass = prefix === 'el' ? 'el-btn el-btn-primary' : `${prefix}-btn-primary`;

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
    const loadingContent = (
      <main className={cls(prefix, 'cart-page')}>
        <p style={{ opacity: 0.6 }}>Loading cart...</p>
      </main>
    );
    return shell ? shell(loadingContent) : loadingContent;
  }

  if (checkoutComplete) {
    const completeContent = (
      <main className={cls(prefix, 'cart-page')}>
        <section className={cls(prefix, 'cart-state')} role="status">
          <div className={monoClass} style={{ marginBottom: '1rem' }}>
            ORDER_CONFIRMED
          </div>
          <h1>Order confirmed</h1>
          <p>Your checkout simulation completed successfully. Continue browsing the collection.</p>
          <a href={themeLink('/')} className={primaryBtnClass} style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Continue shopping
          </a>
        </section>
      </main>
    );
    return shell ? shell(completeContent) : completeContent;
  }

  const content = (
    <main className={cls(prefix, 'cart-page')}>
      <header className={cls(prefix, 'cart-header')}>
        <a href={themeLink('/')} className={cls(prefix, 'detail-back')}>
          <span aria-hidden="true">←</span>
          Back to shop
        </a>
        <div className={monoClass} style={{ marginBottom: '1rem' }}>
          SHOPPING_CART
        </div>
        <h1>Your cart</h1>
      </header>

      {items.length > 0 ? (
        <div className={cls(prefix, 'cart-layout')}>
          <div>
            {items.map((item) => (
              <article className={cls(prefix, 'cart-item')} key={item.product.id}>
                <div className={cls(prefix, 'cart-item-image')}>
                  <img
                    src={getProductImage(item.product, CART_THUMB_PLACEHOLDER)}
                    alt={item.product.title}
                  />
                </div>
                <div className={cls(prefix, 'cart-item-meta')}>
                  <h2>{item.product.title}</h2>
                  <span>Unit price: ${Number(item.product.price).toLocaleString()}</span>
                </div>
                <div className={cls(prefix, 'cart-qty')}>
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
                <div>
                  ${(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>
                <button
                  type="button"
                  className={cls(prefix, 'cart-remove')}
                  onClick={() => removeItem(item.product.id)}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className={cls(prefix, 'cart-summary')}>
            <h2>Order summary</h2>
            <div className={cls(prefix, 'cart-summary-row')}>
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            <div className={cls(prefix, 'cart-summary-row')}>
              <span>Estimated tax (8.5%)</span>
              <strong>
                ${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div className={cls(prefix, 'cart-summary-row')}>
              <span>Shipping</span>
              <strong>${shipping.toLocaleString()}</strong>
            </div>
            <div className={cls(prefix, 'cart-summary-total')}>
              <span>Total</span>
              <strong>
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <button
              type="button"
              className={`${primaryBtnClass} ${cls(prefix, 'cart-checkout')}`}
              onClick={handleCheckout}
              disabled={submittingOrder}
            >
              {submittingOrder ? 'Processing...' : 'Proceed to checkout'}
            </button>
          </aside>
        </div>
      ) : (
        <section className={cls(prefix, 'cart-state')} role="status">
          <div className={monoClass} style={{ marginBottom: '1rem' }}>
            EMPTY_CART
          </div>
          <h1>Your cart is empty</h1>
          <p>Add products from explore or product detail pages.</p>
          <a href={themeLink('/explore')} className={primaryBtnClass} style={{ display: 'inline-block', marginTop: '1.5rem', textDecoration: 'none' }}>
            Browse collection
          </a>
        </section>
      )}
    </main>
  );

  return shell ? shell(content) : content;
}
