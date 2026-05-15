
import React from 'react';
import { GenericListingCard } from './components';

export default function Page() {
  const listings = [
    { title: "2024 Luxury Sedan - Blue", price: "$42,500", type: "Autos", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070" },
    { title: "Senior Software Engineer", price: "$150k - $200k", type: "Jobs", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072" },
    { title: "Modern 2BR Apartment", price: "$2,400 / mo", type: "Properties", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070" },
    { title: "Professional Home Cleaning", price: "$80 / session", type: "Services", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070" },
    { title: "Mountain Bike - Like New", price: "$850", type: "Marketplace", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070" },
    { title: "Marketing Director Role", price: "$120k - $160k", type: "Jobs", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070" },
    { title: "Commercial Office Space", price: "$4,500 / mo", type: "Properties", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" },
    { title: "2021 Electric SUV", price: "$38,000", type: "Autos", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="std-hero">
          <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--std-blue)', letterSpacing: '4px', marginBottom: '2rem' }}>STANDARD_SCALE_PROTOCOL</div>
          <h1>Multi-Vertical <br/>Distribution.</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', color: 'var(--std-slate)', lineHeight: 1.6, marginBottom: '5rem' }}>
              The high-fidelity standard for multi-category exchange. Reliable distribution across properties, autos, jobs, and services.
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
              <button style={{ padding: '1.5rem 4rem', background: 'var(--std-blue)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, fontSize: '0.9rem' }}>EXPLORE_ALL</button>
              <button style={{ padding: '1.5rem 4rem', background: 'white', color: 'var(--std-dark)', border: '1px solid #ddd', borderRadius: '4px', fontWeight: 900, fontSize: '0.9rem' }}>NETWORK_STATUS</button>
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '2.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--std-border)', color: '#94a3b8', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px' }}>
          <span>GLOBAL_LISTINGS: 1.4M+</span>
          <span>NODAL_VERIFICATION: 100%</span>
          <span>SYSTEM_LATENCY: 14ms</span>
          <span>COMPLIANCE_SCORE: 99.9%</span>
      </section>

      {/* Grid */}
      <section className="std-grid">
          {listings.map((item, i) => (
              <GenericListingCard key={i} {...item} />
          ))}
      </section>

      {/* Scale CTA */}
      <section style={{ padding: '12rem 5%', textAlign: 'center', background: '#fff' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2px' }}>Built to scale.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--std-slate)' }}>
              Join the high-fidelity standard for global distribution. Our unified protocol ensures your listings reach the right node, every time.
          </p>
          <button style={{ padding: '1.5rem 5rem', background: 'var(--std-dark)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, fontSize: '1rem' }}>
              INITIALIZE_SHOP_NODE
          </button>
      </section>
    </div>
  );
}
