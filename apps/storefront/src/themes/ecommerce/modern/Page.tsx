import React from 'react';
import { StoryBubble, MobileProductCard } from './components';

export default function ModernRetailPage() {
  const categories = [
    { label: "New In", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070" },
    { label: "Streetwear", image: "https://images.unsplash.com/photo-1552066344-24632e509613?q=80&w=2070" },
    { label: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070" },
    { label: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070" },
    { label: "Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070" },
    { label: "Home", image: "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=2070" },
  ];

  const products = [
    { name: "Acid Wash Graphic Tee", price: "$45", brand: "VIBE_ESSENTIALS", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2070" },
    { name: "Utility Cargo Pants", price: "$89", brand: "STREET_LOGIC", image: "https://images.unsplash.com/photo-1624371414361-e6e8ea0e8124?q=80&w=2070" },
    { name: "Neon Runner Pro", price: "$120", brand: "KINETIC", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070" },
    { name: "Retro Audio Headphones", price: "$199", brand: "SONIC_WAVE", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070" },
  ];

  return (
    <div>
      <div className="story-tray">
        {categories.map((cat, i) => (
          <StoryBubble key={i} {...cat} />
        ))}
      </div>

      <section style={{ padding: '2rem' }}>
        <div style={{ background: 'var(--color-teal)', padding: '3rem', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem' }}>FLASH_SALE_LIVE</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Up to 50% Off<br/>Summer Drops</h2>
            <button style={{ background: 'white', color: 'var(--color-teal)', border: 'none', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: 900, cursor: 'pointer' }}>
              SHOP_THE_SALE
            </button>
          </div>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '10rem', opacity: 0.2, fontWeight: 900 }}>%</div>
        </div>
      </section>

      <div style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>TRENDING_NOW</h2>
        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--color-coral)' }}>VIEW_ALL</span>
      </div>

      <div className="modern-product-feed">
        {products.map((p, i) => (
          <MobileProductCard key={i} {...p} />
        ))}
      </div>

      <section style={{ padding: '2rem' }}>
        <div style={{ background: '#000', padding: '4rem 2rem', borderRadius: '32px', color: 'white', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>JOIN_THE_VIBE</h3>
          <p style={{ opacity: 0.7, marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>Get exclusive early access to drops, member-only discounts, and local event invites.</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <input type="text" placeholder="your@email.com" style={{ background: '#222', border: 'none', padding: '1rem 2rem', borderRadius: '100px', color: 'white', width: '250px' }} />
            <button style={{ background: 'var(--color-coral)', border: 'none', padding: '1rem 2.5rem', borderRadius: '100px', fontWeight: 900, color: 'white', cursor: 'pointer' }}>JOIN</button>
          </div>
        </div>
      </section>
    </div>
  );
}
