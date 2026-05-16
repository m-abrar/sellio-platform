
'use client';
import React from 'react';
import { ListingGridCard, CategorySidebar, TrendingPanel } from './components';

export default function Page() {
  const listings = [
    { title: "iPhone 15 Pro Max - 256GB - Blue", price: "$950", location: "Downtown", time: "2h ago", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070" },
    { title: "Mid-Century Modern Sofa", price: "$450", location: "West Side", time: "5h ago", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070" },
    { title: "2019 Specialized Mountain Bike", price: "$1,200", location: "North End", time: "1d ago", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070" },
    { title: "Sony WH-1000XM5 Headphones", price: "$280", location: "East Side", time: "3h ago", image: "https://images.unsplash.com/photo-1618366712214-8c0797aa555c?q=80&w=2070" },
    { title: "Vintage Nikon F3 Camera", price: "$350", location: "South End", time: "4h ago", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070" },
    { title: "Solid Oak Dining Table", price: "$600", location: "Suburbs", time: "2d ago", image: "https://images.unsplash.com/photo-1530018607912-eff2df114fbe?q=80&w=2070" },
    { title: "Mechanical Keyboard - Custom", price: "$180", location: "Tech Park", time: "6h ago", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070" },
    { title: "Outdoor Patio Set (4 Piece)", price: "$300", location: "Riverside", time: "1w ago", image: "https://images.unsplash.com/photo-1594132047805-4c01f681d431?q=80&w=2070" },
    { title: "Gaming Monitor 34' Ultrawide", price: "$400", location: "City Center", time: "8h ago", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Search Hero */}
      <section className="gen-hero">
        <div style={{ display: 'inline-block', background: 'var(--gen-yellow-glow)', color: 'var(--gen-charcoal)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '2.5rem' }}>
          UNIVERSAL_DISTRIBUTION_NODE
        </div>
        <h1>Find what you're <br/>looking for.</h1>
        
        <div className="gen-search-box">
          <input type="text" className="gen-search-input" placeholder="Search across 1.2M verified nodes..." />
          <input type="text" className="gen-location-input" placeholder="Location Radius" />
          <button className="gen-search-btn">SEARCH</button>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
          {['iPhone_15', 'Tesla_Model_3', 'Apartment', 'Backend_Lead', 'Home_Service'].map(tag => (
            <span key={tag} style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9ca3af', cursor: 'pointer', letterSpacing: '0.5px' }}>#{tag.toUpperCase()}</span>
          ))}
        </div>
      </section>

      {/* 3-Column Layout */}
      <section className="gen-layout">
        <CategorySidebar />
        
        <div className="gen-feed">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#9ca3af' }}>{listings.length} RESULTS_FOUND_IN_NODE</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--gen-charcoal)', borderBottom: '2px solid var(--gen-yellow)' }}>LATEST</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#9ca3af' }}>RELEVANCE</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#9ca3af' }}>PRICE_LOW</span>
            </div>
          </div>

          <div className="listing-grid">
            {listings.map((item, i) => (
              <ListingGridCard key={i} {...item} />
            ))}
          </div>

          <div style={{ marginTop: '5rem', textAlign: 'center' }}>
            <button style={{ background: 'white', border: '1px solid var(--gen-border)', color: 'var(--gen-charcoal)', padding: '1.25rem 4rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}>
              LOAD_MORE_RESULTS
            </button>
          </div>
        </div>

        <TrendingPanel />
      </section>

      {/* Final Call to Action */}
      <section style={{ margin: '4rem 5% 8rem', padding: '6rem', background: 'var(--gen-charcoal)', borderRadius: '24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--gen-yellow-glow) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)' }}></div>
        
        <div style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-1px' }}>Got something to distribute?</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.6 }}>
            Join the world's most high-utility distribution node. Reach verified buyers and settle transactions instantly with Sellio Protocol.
          </p>
        </div>
        <button style={{ padding: '2rem 5rem', background: 'var(--gen-yellow)', color: 'var(--gen-charcoal)', border: 'none', borderRadius: '12px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(251, 191, 36, 0.2)' }}>
          INITIALIZE_DISTRIBUTION
        </button>
      </section>
    </div>
  );
}
