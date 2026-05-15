'use client';

import React from 'react';
import { ProductCard } from './components';

export default function Page() {
  const featuredProducts = [
    { name: "Nordic Minimalist Tee", price: "$45.00", category: "ESSENTIALS", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000" },
    { name: "Urban Cargo Trousers", price: "$120.00", category: "APPAREL", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2000" },
    { name: "Classic Chelsea Boot", price: "$240.00", category: "FOOTWEAR", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=2000" },
    { name: "Merino Wool Beanie", price: "$35.00", category: "ACCESSORIES", image: "https://images.unsplash.com/photo-1576871337622-98d48d890e49?q=80&w=2000" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="ecom-hero">
        <div className="ecom-hero-content">
            <span className="ecom-hero-badge">SUMMER_COLLECTION_2026</span>
            <h1 className="ecom-hero-title">Refined Essentials <br/>For Modern Life.</h1>
            <p className="ecom-hero-subtitle">
                Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.
            </p>
            <a href="#" className="ecom-btn-primary">SHOP_THE_COLLECTION</a>
        </div>
        <div style={{ position: 'absolute', right: '0', top: '0', width: '45%', height: '100%', zIndex: 1 }}>
            <img 
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2000" 
                alt="Hero Image" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, #f9fafb 0%, transparent 100%)' }}></div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="ecom-section">
        <div className="ecom-section-header">
            <div>
                <p style={{ color: '#1e4d4e', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>CURATED_SELECTION</p>
                <h2 className="ecom-section-title">New Arrivals</h2>
            </div>
            <a href="#" style={{ fontWeight: 700, fontSize: '0.875rem', borderBottom: '2px solid #1e4d4e', paddingBottom: '4px' }}>VIEW_ALL</a>
        </div>
        
        <div className="ecom-grid">
            {featuredProducts.map((p, i) => (
                <ProductCard key={i} {...p} />
            ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ backgroundColor: '#f9fafb', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', color: '#1e4d4e' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                </div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Global Shipping</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Express delivery to over 120 countries with tracked shipping.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', color: '#1e4d4e' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Secure Checkout</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>State-of-the-art encryption for your peace of mind and data safety.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', color: '#1e4d4e' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </div>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Easy Returns</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>30-day hassle-free return policy for all unworn garments.</p>
            </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="ecom-section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1px' }}>Stay In The Loop.</h2>
            <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1.125rem' }}>
                Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.
            </p>
            <form style={{ display: 'flex', gap: '1rem' }}>
                <input 
                    type="email" 
                    placeholder="ENTER_YOUR_EMAIL" 
                    style={{ 
                        flex: 1, 
                        padding: '1.25rem 1.5rem', 
                        borderRadius: '12px', 
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }} 
                />
                <button className="ecom-btn-primary" style={{ padding: '1.25rem 2rem' }}>SUBSCRIBE</button>
            </form>
        </div>
      </section>
    </div>
  );
}
