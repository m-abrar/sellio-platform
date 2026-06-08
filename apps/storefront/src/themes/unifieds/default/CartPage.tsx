'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@sellio/types';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface CartItem {
  product: Product;
  quantity: number;
}

const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='75' viewBox='0 0 100 75'><rect width='100%' height='100%' fill='%23F9FAFB'/><g transform='translate(38,25)' stroke='%23D1D5DB' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='20' height='20' rx='2'/><circle cx='8' cy='8' r='2'/><path d='M20 16L14 10 4 20'/></g></svg>";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useUnifiedThemeLink();

  useEffect(() => {
    function loadCart() {
      try {
        const cartStr = localStorage.getItem('sellio_cart') || '[]';
        setCartItems(JSON.parse(cartStr));
      } catch (error) {
        console.error('Failed to load unified default cart:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);

    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('sellio_cart', JSON.stringify(items));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Failed to save unified default cart:', error);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (productId: number) => {
    saveCart(cartItems.filter((item) => item.product.id !== productId));
  };

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const calculateSubtotal = () => (
    cartItems.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0)
  );

  const handleCheckout = () => {
    setSubmittingOrder(true);
    window.setTimeout(() => {
      setSubmittingOrder(false);
      setCheckoutComplete(true);
      saveCart([]);
    }, 1500);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <main className="ud-cart-page">
        <p style={{ color: 'var(--ud-slate)' }}>Loading shopping cart details...</p>
      </main>
    );
  }

  if (checkoutComplete) {
    return (
      <main className="ud-cart-page">
        <section className="ud-cart-state" role="status">
          <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>ORDER_CONFIRMED</div>
          <h1>Order Confirmed</h1>
          <p>Your core checkout simulation completed successfully. Continue browsing the live catalog registry.</p>
          <a href={themeLink('/')} className="core-btn-primary">Continue Browsing</a>
        </section>
      </main>
    );
  }

  return (
    <main className="ud-cart-page">
      <div className="ud-cart-header">
        <div className="ud-mono" style={{ color: 'var(--ud-azure)', marginBottom: '1rem' }}>CORE_CART</div>
        <h1>Shopping Cart</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="ud-cart-layout">
          <div className="ud-cart-items">
            {cartItems.map((item) => (
              <article className="ud-cart-item" key={item.product.id}>
                <div className="ud-cart-item-image">
                  <img src={getProductImage(item.product)} alt={item.product.title} />
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
