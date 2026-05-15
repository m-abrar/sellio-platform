import React from 'react';
import { MonolithCard } from './components';

export default function MinimalClassifiedsPage() {
  const items = [
    { title: "Mid-Century Eames Lounge Chair", price: "$4,200", location: "Portland, OR", date: "MAY 12", image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=2070" },
    { title: "Vintage Leica M6 (Titanium Finish)", price: "$5,800", location: "Seattle, WA", date: "MAY 14", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070" },
    { title: "Custom Steel Frame Road Bike", price: "$2,400", location: "San Francisco, CA", date: "MAY 15", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070" },
    { title: "Bauhaus Inspired Desk Lamp", price: "$450", location: "Austin, TX", date: "MAY 15", image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="minimal-hero">
        <p style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', opacity: 0.5 }}>
          Curated Listings // Global Reach
        </p>
        <h1>Everything Matters.</h1>
        <div style={{ maxWidth: '600px', margin: '0 auto', height: '1px', background: 'var(--color-black)', opacity: 0.1 }}></div>
      </section>

      <div className="monolith-feed">
        <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 700 }}>{items.length} Curated Items</span>
          <span style={{ opacity: 0.5 }}>Sorted by: Newest</span>
        </div>
        
        {items.map((item, i) => (
          <MonolithCard key={i} {...item} />
        ))}

        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            borderBottom: '2px solid var(--color-black)', 
            padding: '0.5rem 0', 
            fontWeight: 900, 
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            View All Marketplace
          </button>
        </div>
      </div>

      <section style={{ padding: '8rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', borderTop: '1px solid var(--color-border)' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-1px' }}>The Minimalist Philosophy.</h2>
          <p style={{ opacity: 0.6, lineHeight: '1.8' }}>
            We believe that marketplace browsing should be as focused and deliberate as the items themselves. No clutter. No noise. Just pure, monolithic discovery.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>24k+</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.5, marginTop: '0.5rem' }}>COMMUNITY MEMBERS</div>
          </div>
        </div>
      </section>
    </div>
  );
}
