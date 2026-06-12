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
      <div style={{ padding: '8rem 6% 6rem', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Loading shopping cart details...</p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.8s ease-out', padding: '8rem 6% 6rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <span className="usm-mono" style={{ color: 'var(--usm-primary)', marginBottom: '1.5rem', display: 'inline-block', fontWeight: 600 }}>YOUR BAG</span>
        <h1 className="usm-heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', margin: '1rem 0', fontWeight: 600 }}>
          Shopping Cart
        </h1>
      </div>

      {items.length > 0 ? (
        <div className="usm-cart-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {items.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  border: '1px solid var(--usm-border)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  alignItems: 'center',
                  background: '#fff',
                }}
              >
                <div style={{ width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--usm-border)' }}>
                  <img src={getProductImage(item.product, CART_THUMB_PLACEHOLDER)} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--usm-ink)', margin: '0 0 0.5rem' }}>{item.product.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Unit Price: ${Number(item.product.price).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--usm-border)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button type="button" onClick={() => updateQuantity(item.product.id, -1)} style={{ padding: '0.5rem 1rem', background: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                  <span style={{ padding: '0.5rem 1rem', fontSize: '0.95rem', fontWeight: 600, minWidth: '40px', textAlign: 'center', background: 'var(--usm-ghost)' }}>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.product.id, 1)} style={{ padding: '0.5rem 1rem', background: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--usm-ink)', minWidth: '100px', textAlign: 'right' }}>
                  ${(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>
                <button type="button" onClick={() => removeItem(item.product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} aria-label="Remove item">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ border: '1px solid var(--usm-border)', borderRadius: '12px', padding: '2.5rem 2rem', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--usm-ink)', marginBottom: '2rem', borderBottom: '1px solid var(--usm-border)', paddingBottom: '1rem' }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#666' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--usm-ink)' }}>${subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#666' }}>
                <span>Estimated Tax (8.5%)</span>
                <span style={{ fontWeight: 600, color: 'var(--usm-ink)' }}>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#666' }}>
                <span>Shipping &amp; Handling</span>
                <span style={{ fontWeight: 600, color: 'var(--usm-ink)' }}>${shipping.toLocaleString()}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--usm-border)', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', color: 'var(--usm-ink)', fontWeight: 700 }}>
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <button type="button" className="silent-btn-primary" style={{ width: '100%', padding: '1.1rem 2rem', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 600 }} onClick={handleCheckout} disabled={submittingOrder}>
              {submittingOrder ? 'CHECKING OUT...' : 'PROCEED TO CHECKOUT'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '8rem 0', border: '1px dashed var(--usm-border)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '0.5rem' }}>Your Bag is Empty</h3>
          <p style={{ color: '#888', fontWeight: 300, marginBottom: '2.5rem' }}>Browse the explore directory to add listings to your cart.</p>
          <a href={themeLink('/explore')} className="silent-btn-primary" style={{ textDecoration: 'none' }}>
            Browse Directory
          </a>
        </div>
      )}
    </div>
  );
}
