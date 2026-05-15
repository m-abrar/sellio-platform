
import React from 'react';
import { CategoryCard } from './components';

export default function Page() {
  const categories = [
    { title: "Electronics", icon: "📱", count: "14,200" },
    { title: "Vehicles", icon: "🚗", count: "8,500" },
    { title: "Real Estate", icon: "🏠", count: "3,100" },
    { title: "Jobs", icon: "💼", count: "5,400" },
    { title: "Services", icon: "🛠️", count: "12,800" },
    { title: "Events", icon: "📅", count: "2,900" },
    { title: "Fashion", icon: "👗", count: "22,400" },
    { title: "Collectibles", icon: "🎨", count: "1,200" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="market-hero">
          <h1>The Global <br/>Exchange Node.</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', color: '#6b7280', lineHeight: 1.6 }}>
              The world's most expansive multi-category distribution node. High-fidelity commerce, verified by the Sellio global network.
          </p>
          <div className="market-search-pill">
              <input type="text" placeholder="Search for anything (electronics, apartments, roles...)" style={{ flex: 1, padding: '1rem 2rem', border: 'none', background: 'none', outline: 'none', fontSize: '1rem' }} />
              <button style={{ background: 'var(--market-purple)', color: 'white', border: 'none', padding: '0 3rem', borderRadius: '50px', fontWeight: 800 }}>SEARCH</button>
          </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--market-border)', color: '#9ca3af', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px' }}>
          <span>1.2M_ACTIVE_NODES</span>
          <span>GLOBAL_DISTRIBUTION_READY</span>
          <span>TRUST_PROTOCOL_v4</span>
          <span>REALTIME_NETWORK_DATA</span>
      </section>

      {/* Category Grid */}
      <section className="cat-grid">
          {categories.map((cat, i) => (
              <CategoryCard key={i} {...cat} />
          ))}
      </section>

      {/* Featured Stats Section */}
      <section style={{ padding: '10rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4rem', textAlign: 'center', background: '#111827', color: 'white' }}>
          <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--market-purple)', marginBottom: '1rem' }}>$4.2B</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4b5563', letterSpacing: '2px' }}>ANNUAL_NETWORK_VOLUME</div>
          </div>
          <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--market-purple)', marginBottom: '1rem' }}>180+</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4b5563', letterSpacing: '2px' }}>REGIONAL_NODES</div>
          </div>
          <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--market-purple)', marginBottom: '1rem' }}>0%</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4b5563', letterSpacing: '2px' }}>NODE_LISTING_FEES</div>
          </div>
      </section>

      {/* Seller CTA */}
      <section style={{ padding: '12rem 5%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-2px' }}>Scale your <br/>business globally.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: '#6b7280' }}>
              Join the elite circle of global sellers. Deploy your products across the entire Sellio ecosystem with a single node connection.
          </p>
          <button style={{ padding: '1.5rem 5rem', background: 'var(--market-purple)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 800, fontSize: '1rem', boxShadow: '0 20px 50px rgba(139, 92, 246, 0.2)' }}>
              INITIALIZE_SHOP_NODE
          </button>
      </section>
    </div>
  );
}
