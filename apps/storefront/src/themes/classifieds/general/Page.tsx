
import React from 'react';
import { ListingGridCard } from './components';

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
    { title: "Lego Star Wars UCS Millennium Falcon", price: "$700", location: "West End", time: "3d ago", image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=2071" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="gen-hero">
          <h1>Find what you're <br/>looking for.</h1>
          <div className="gen-search-box">
              <input type="text" placeholder="What are you searching for?" style={{ flex: 1, padding: '1.25rem', border: 'none', background: 'none', fontSize: '1rem', outline: 'none' }} />
              <input type="text" placeholder="Location" style={{ width: '200px', padding: '1.25rem', border: 'none', background: 'none', fontSize: '1rem', outline: 'none', borderLeft: '1px solid #ddd' }} />
              <button style={{ background: 'var(--gen-yellow)', border: 'none', padding: '0 3rem', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' }}>SEARCH</button>
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              {['iPhone', 'Tesla', 'Apartment', 'Developer', 'Cleaning'].map(tag => (
                  <span key={tag} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', cursor: 'pointer' }}>#{tag}</span>
              ))}
          </div>
      </section>

      {/* Featured Categories */}
      <section style={{ padding: '4rem 5%', display: 'flex', gap: '1.5rem', overflowX: 'auto', background: '#fff', borderBottom: '1px solid var(--gen-border)' }}>
          {['Electronics', 'Vehicles', 'Property', 'Jobs', 'Services', 'Home', 'Leisure', 'Fashion'].map(cat => (
              <div key={cat} style={{ minWidth: '150px', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📦</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{cat}</div>
              </div>
          ))}
      </section>

      {/* Listing Grid */}
      <section className="listing-grid">
          {listings.map((item, i) => (
              <ListingGridCard key={i} {...item} />
          ))}
      </section>

      {/* Sell CTA */}
      <section style={{ margin: '6rem 5%', padding: '6rem', background: 'var(--gen-charcoal)', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Got something to sell?</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.6 }}>Join over 2 million sellers on the world's most high-utility distribution node. It's free, fast, and secure.</p>
          </div>
          <button style={{ padding: '2rem 5rem', background: 'var(--gen-yellow)', color: 'var(--gen-charcoal)', border: 'none', borderRadius: '8px', fontWeight: 900, fontSize: '1rem' }}>
              POST_YOUR_AD_NOW
          </button>
      </section>
    </div>
  );
}
