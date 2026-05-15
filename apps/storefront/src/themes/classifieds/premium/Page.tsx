
import React from 'react';
import { CuratedListingCard } from './components';

export default function Page() {
  const listings = [
    { title: "Patek Philippe Nautilus 5711", price: "$142,000", category: "TIMEPIECES", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080" },
    { title: "Abstract Composition #42", price: "$28,500", category: "FINE_ART", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000" },
    { title: "Macallan 1946 Select Reserve", price: "$32,000", category: "SPIRITS", image: "https://images.unsplash.com/photo-1527281405613-39bfc57c112d?q=80&w=2000" },
    { title: "1967 Ferrari 275 GTB/4", price: "POR", category: "AUTOMOTIVE", image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070" },
    { title: "Villa Diamante | Tuscany", price: "$8,900,000", category: "ESTATES", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Custom Diamond Collar", price: "$45,000", category: "JEWELLERY", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Elite Hero */}
      <section className="elite-hero">
        <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#d4af37', letterSpacing: '8px' }}>CURATING_THE_EXCEPTIONAL</span>
        </div>
        <h1 className="elite-hero-title">Beyond <br/>Ordinary.</h1>
        <p className="elite-hero-subtitle">
            An invitation-only marketplace for the world's most significant assets. Authenticated by experts, acquired by collectors.
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
            <button className="elite-btn">EXPLORE_PRIVATE_SALES</button>
            <button className="elite-btn" style={{ background: 'white', color: 'black', borderColor: 'white' }}>REQUEST_CONCIERGE</button>
        </div>
        
        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.3 }}>
            <div style={{ width: '1px', height: '60px', background: 'white' }}></div>
            <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '2px' }}>SCROLL</span>
        </div>
      </section>

      {/* Curated Grid */}
      <section className="elite-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--prem-serif)', fontSize: '3rem', fontWeight: 900, color: 'white' }}>The_Collection</h2>
                <p style={{ color: '#666', marginTop: '1rem', fontSize: '1.1rem' }}>Newly appraised assets from across our global nodes.</p>
            </div>
            <div style={{ display: 'flex', gap: '3rem', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px' }}>
                <span style={{ color: '#d4af37', borderBottom: '1px solid #d4af37', paddingBottom: '4px' }}>LATEST</span>
                <span style={{ color: '#666' }}>BY_VALUE</span>
                <span style={{ color: '#666' }}>CLOSING_SOON</span>
            </div>
        </div>
        
        <div className="elite-grid">
            {listings.map((l, i) => (
                <CuratedListingCard key={i} {...l} />
            ))}
        </div>

        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
            <button className="elite-btn" style={{ padding: '1.5rem 5rem' }}>VIEW_FULL_INVENTORY</button>
        </div>
      </section>

      {/* Brand Ethos */}
      <section style={{ padding: '15rem 4rem', background: '#050505', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--prem-serif)', fontSize: '4rem', fontWeight: 900, color: 'white', marginBottom: '3rem', fontStyle: 'italic' }}>"Trust is the ultimate luxury."</h2>
            <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: 1.8, marginBottom: '5rem' }}>
                Every listing on Sellio Elite undergoes a rigorous three-phase authentication protocol. We do not just list products; we verify legacies.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
                <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d4af37' }}>0%</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#333', letterSpacing: '2px', marginTop: '0.5rem' }}>FRAUD_INDEX</div>
                </div>
                <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d4af37' }}>24h</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#333', letterSpacing: '2px', marginTop: '0.5rem' }}>RESPONSE_TIME</div>
                </div>
                <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d4af37' }}>GLOBAL</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: '#333', letterSpacing: '2px', marginTop: '0.5rem' }}>LOGISTICS_NETWORK</div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
