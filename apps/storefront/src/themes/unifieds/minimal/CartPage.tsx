'use client';
import React, { useState, useEffect } from 'react';
import type { Product } from '@sellio/types';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const themeLink = useUnifiedThemeLink();

  const SYSTEM_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='75' viewBox='0 0 100 75'><rect width='100%' height='100%' fill='%23F9FAFB'/><g transform='translate(38,25)' stroke='%23D1D5DB' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='20' height='20' rx='2'/><circle cx='8' cy='8' r='2'/><path d='M20 16L14 10 4 20'/></g></svg>";

  useEffect(() => {
    function loadCart() {
      try {
        const cartStr = localStorage.getItem('sellio_cart') || '[]';
        setCartItems(JSON.parse(cartStr));
      } catch (err) {
        console.error('Failed to load cart from localStorage:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCart();

    // Listen to changes in other tabs/windows
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('sellio_cart', JSON.stringify(items));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const removeItem = (productId: number) => {
    const updated = cartItems.filter(item => item.product.id !== productId);
    saveCart(updated);
  };

  const getProductImage = (product: Product) => {
    if (product.media?.featured_image) {
      return product.media.featured_image;
    }
    if (product.image_url) {
      return product.image_url;
    }
    return SYSTEM_PLACEHOLDER;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  };

  const handleCheckout = () => {
    setSubmittingOrder(true);
    setTimeout(() => {
      setSubmittingOrder(false);
      setCheckoutComplete(true);
      // Clear cart
      saveCart([]);
    }, 1500);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = subtotal * 0.085;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div style={{ padding: '8rem 6% 6rem', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Loading shopping cart details...</p>
      </div>
    );
  }

  if (checkoutComplete) {
    return (
      <div style={{ padding: '10rem 6% 10rem', textAlign: 'center', animation: 'fadeIn 0.8s ease-out' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <svg fill="none" stroke="var(--usm-primary)" strokeWidth="1.5" viewBox="0 0 24 24" width="72" height="72" style={{ margin: '0 auto' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <h1 className="usm-heading-xl" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1rem 0', fontWeight: 600 }}>
          Order Confirmed!
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: '#666', fontWeight: 300, lineHeight: 1.8 }}>
          Thank you for your purchase. Your dynamic order has been generated under the Universal checkouts process.
        </p>
        <a href={themeLink('/')} className="silent-btn-primary" style={{ textDecoration: 'none' }}>
          Continue Browsing
        </a>
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

      {cartItems.length > 0 ? (
        <div className="usm-cart-layout">
          
          {/* Cart Line Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map((item) => (
              <div 
                key={item.product.id} 
                style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  border: '1px solid var(--usm-border)', 
                  borderRadius: '12px', 
                  padding: '1.5rem',
                  alignItems: 'center',
                  background: '#fff'
                }}
              >
                {/* Product Thumbnail */}
                <div style={{ width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--usm-border)' }}>
                  <img src={getProductImage(item.product)} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Meta details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--usm-ink)', margin: '0 0 0.5rem' }}>{item.product.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Unit Price: ${Number(item.product.price).toLocaleString()}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--usm-border)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button 
                    onClick={() => updateQuantity(item.product.id, -1)}
                    style={{ padding: '0.5rem 1rem', background: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0.5rem 1rem', fontSize: '0.95rem', fontWeight: 600, minWidth: '40px', textAlign: 'center', background: 'var(--usm-ghost)' }}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, 1)}
                    style={{ padding: '0.5rem 1rem', background: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>

                {/* Line Item Total */}
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--usm-ink)', minWidth: '100px', textAlign: 'right' }}>
                  ${(Number(item.product.price) * item.quantity).toLocaleString()}
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.product.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer', 
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label="Remove item"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>

              </div>
            ))}
          </div>

          {/* Cart Pricing Summary Sidebar */}
          <div 
            style={{ 
              border: '1px solid var(--usm-border)', 
              borderRadius: '12px', 
              padding: '2.5rem 2rem', 
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
            }}
          >
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
              
              <div style={{ height: '1px', background: 'var(--usm-border)', margin: '1rem 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', color: 'var(--usm-ink)', fontWeight: 700 }}>
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              className="silent-btn-primary" 
              style={{ width: '100%', padding: '1.1rem 2rem', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 600 }}
              onClick={handleCheckout}
              disabled={submittingOrder}
            >
              {submittingOrder ? 'CHECKING OUT...' : 'PROCEED TO CHECKOUT'}
            </button>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '8rem 0', border: '1px dashed var(--usm-border)', borderRadius: '12px' }}>
          <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" width="48" height="48" style={{ color: '#aaa', marginBottom: '1.5rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '0.5rem' }}>Your Bag is Empty</h3>
          <p style={{ color: '#888', fontWeight: 300, marginBottom: '2.5rem' }}>Browse our curated catalog to add premium elements.</p>
          <a href={themeLink('/explore')} className="silent-btn-primary" style={{ textDecoration: 'none' }}>
            Browse Directory
          </a>
        </div>
      )}
    </div>
  );
}
