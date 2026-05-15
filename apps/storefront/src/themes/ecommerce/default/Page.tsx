'use client';
import React from 'react';
import { PremiumProductCard, CategoryRibbon } from './components';

export default function Page() {
  const featuredProducts = [
    { name: "Nordic Minimalist Tee", price: "$45.00", category: "ESSENTIALS", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000" },
    { name: "Urban Cargo Trousers", price: "$120.00", category: "APPAREL", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2000" },
    { name: "Classic Chelsea Boot", price: "$240.00", category: "FOOTWEAR", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=2000" },
    { name: "Merino Wool Beanie", price: "$35.00", category: "ACCESSORIES", image: "https://images.unsplash.com/photo-1576871337622-98d48d890e49?q=80&w=2000" },
    { name: "Technical Shell Jacket", price: "$320.00", category: "OUTERWEAR", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000" },
    { name: "Raw Denim Jeans", price: "$180.00", category: "APPAREL", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2000" },
    { name: "Linen Weekend Shirt", price: "$95.00", category: "ESSENTIALS", image: "https://images.unsplash.com/photo-1596755094514-f87034a264c6?q=80&w=2000" },
    { name: "Canvas Tote Bag", price: "$55.00", category: "ACCESSORIES", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2000" },
  ];

  return (
    <div className="ed-section">
      {/* Refined Functional Hero */}
      <section className="ed-hero">
        <div>
          <div className="ed-mono" style={{ marginBottom: '2.5rem' }}>SUMMER_COLLECTION_2026_V8</div>
          <h1 className="ed-heading-xl">
            Refined <br/>
            Essentials for <br/>
            <span style={{ color: 'var(--ed-blue)' }}>Modern Life.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--ed-text-muted)', lineHeight: 1.8, maxWidth: '550px' }}>
            Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.
          </p>
          <div style={{ marginTop: '6rem' }}>
            <button className="ed-btn-primary">Shop Collection</button>
          </div>
        </div>
        <div className="ed-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?q=80&w=2000" alt="Hero Lifestyle" className="ed-hero-img" />
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div className="ed-mono" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>FEATURED_NODE</div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Technical_Shell_v4</div>
          </div>
        </div>
      </section>

      {/* Trust & Category Ribbon */}
      <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem', borderTop: '1px solid var(--ed-border)', marginTop: '10rem' }}>
          <CategoryRibbon label="New Arrivals" count="124" />
          <CategoryRibbon label="Essentials" count="86" />
          <CategoryRibbon label="Outerwear" count="42" />
          <CategoryRibbon label="Accessories" count="156" />
      </section>

      {/* Featured Collection Grid */}
      <section style={{ marginTop: '15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ed-mono" style={{ marginBottom: '1.5rem' }}>CURATED_PRODUCT_REGISTRY</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>New <br/>Arrivals.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--ed-text-muted)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes product availability from the world's most significant garment nodes.
              </div>
          </div>
          
          <div className="ed-product-grid">
            {featuredProducts.map((p, i) => (
              <PremiumProductCard key={i} {...p} />
            ))}
          </div>
      </section>

      {/* Collective / Newsletter Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 10%', background: 'var(--ed-frost)', borderRadius: '32px', textAlign: 'center' }}>
          <div className="ed-mono" style={{ marginBottom: '3rem' }}>JOIN_THE_COLLECTIVE</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', color: 'var(--ed-slate)', marginBottom: '4rem', lineHeight: 1 }}>
              Stay In <br/>The Loop.
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 8rem', fontSize: '1.25rem', color: 'var(--ed-text-muted)', lineHeight: 1.8 }}>
              Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
              <input type="email" placeholder="ENTER_EMAIL_NODE" style={{ flex: 1, padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid var(--ed-border)', fontSize: '1rem', fontWeight: 600 }} />
              <button className="ed-btn-primary" style={{ padding: '1.5rem 4rem' }}>SUBSCRIBE</button>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
