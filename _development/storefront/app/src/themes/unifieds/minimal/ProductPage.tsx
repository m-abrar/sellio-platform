'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const SYSTEM_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='100%' height='100%' fill='%23F9FAFB'/><g transform='translate(276,185)' stroke='%23D1D5DB' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='44' height='44' rx='4'/><circle cx='15' cy='15' r='4'/><path d='M42 34L30 22 8 44'/></g><text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='500' fill='%239CA3AF'>No image uploaded</text></svg>";

  useEffect(() => {
    async function fetchProduct() {
      try {
        const fetchedProduct = await api.getProductBySlug(slug);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Failed to retrieve single dynamic product detail:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    setAddingToCart(true);
    setTimeout(() => {
      try {
        const cartStr = localStorage.getItem('sellio_cart') || '[]';
        const cart = JSON.parse(cartStr);
        const existing = cart.find((item: any) => item.product.id === product?.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ product, quantity: 1 });
        }
        localStorage.setItem('sellio_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        console.error('Failed to add product to cart storage:', err);
      }
      alert(`"${product?.title}" successfully added to cart.`);
      setAddingToCart(false);
    }, 800);
  };

  const getProductImage = (prod: Product) => {
    if (prod.media?.featured_image) {
      return prod.media.featured_image;
    }
    if (prod.image_url) {
      return prod.image_url;
    }
    return SYSTEM_PLACEHOLDER;
  };

  if (loading) {
    return (
      <div className="usm-product-details-container" style={{ padding: '8rem 6% 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          {/* Left Column Image Skeleton */}
          <div style={{ aspectRatio: '4/3', borderRadius: '8px', background: '#f3f4f6', animation: 'pulse 1.5s infinite' }}></div>
          {/* Right Column Details Skeleton */}
          <div>
            <div style={{ height: '14px', background: '#e5e7eb', width: '25%', borderRadius: '4px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '38px', background: '#e5e7eb', width: '80%', borderRadius: '4px', marginBottom: '25px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '24px', background: '#e5e7eb', width: '35%', borderRadius: '4px', marginBottom: '30px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '80px', background: '#e5e7eb', width: '100%', borderRadius: '4px', marginBottom: '40px', animation: 'pulse 1.5s infinite' }}></div>
            <div style={{ height: '50px', background: '#e5e7eb', width: '50%', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="usm-product-details-container" style={{ padding: '10rem 6% 10rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '2rem', marginBottom: '1.5rem' }}>Listing Not Found</h2>
        <p style={{ color: '#666', marginBottom: '2.5rem' }}>The requested product listing does not exist or has been removed.</p>
        <a href="/preview/unifieds_minimal" className="silent-btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2.5rem' }}>
          Return to Catalog
        </a>
      </div>
    );
  }

  return (
    <div className="usm-product-details-container" style={{ padding: '8rem 6% 6rem', animation: 'fadeIn 0.8s ease-out' }}>
      {/* Back Navigator */}
      <div style={{ marginBottom: '3rem' }}>
        <a 
          href="/preview/unifieds_minimal" 
          style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Listings
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4.5rem', alignItems: 'start' }}>
        {/* Left Column - Product Image */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--usm-border)', background: 'var(--usm-ghost)', boxShadow: 'var(--usm-shadow)' }}>
          <img 
            src={getProductImage(product)} 
            alt={product.title} 
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>

        {/* Right Column - Product Meta Details */}
        <div>
          <span 
            style={{ color: 'var(--usm-primary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem' }}
          >
            {product.category_id ? `Category #${product.category_id}` : 'Featured Listing'}
          </span>
          
          <h1 
            style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 600, color: 'var(--usm-ink)', lineHeight: 1.2, margin: '0 0 1.5rem' }}
          >
            {product.title}
          </h1>

          <div 
            style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--usm-primary)', margin: '0 0 2.5rem' }}
          >
            {product.pricing?.formatted || `$${Number(product.price).toLocaleString()}`}
          </div>

          <div style={{ height: '1px', background: 'var(--usm-border)', margin: '2.5rem 0' }}></div>

          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: '#111' }}>
              Description
            </h3>
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 300 }}>
              {product.description || 'This premium dynamic listing features exquisite craftsmanship and timeless utility, meticulously verified under the Universal marketplace audit. Standard options and structural layouts are fully integrated.'}
            </p>
          </div>

          <div style={{ height: '1px', background: 'var(--usm-border)', margin: '2.5rem 0' }}></div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button 
              className="silent-btn-primary" 
              style={{ flex: 1, padding: '1.2rem 3rem', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: 600 }}
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'ADDING...' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
