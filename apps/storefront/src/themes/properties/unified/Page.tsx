
import React from 'react';
import { StandardPropCard } from './components';

export default function Page() {
  const properties = [
    { title: "Westside Corporate Center", price: "$14,500,000", location: "Downtown", type: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" },
    { title: "Harbor Industrial Park", price: "$8,200,000", location: "Port District", type: "Industrial", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070" },
    { title: "Modern Family Estate", price: "$1,250,000", location: "Suburbs", type: "Residential", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070" },
    { title: "Agricultural Growth Node", price: "$450,000", location: "Rural Sector", type: "Land", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000" },
    { title: "Tech Park Office Suite", price: "$2,800,000", location: "Innovation Hub", type: "Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" },
    { title: "Riverside Loft Complex", price: "$12,000,000", location: "Arts District", type: "Residential", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070" },
    { title: "Central Distribution Hub", price: "$5,400,000", location: "Logistics Zone", type: "Industrial", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070" },
    { title: "Mountain Retreat Land", price: "$320,000", location: "Alpine Sector", type: "Land", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="uni-hero">
          <div style={{ flex: 1.2 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--uni-blue)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>UNIVERSAL_PROPERTY_PROTOCOL</span>
              <h1>The Authoritative <br/>Distribution Node.</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--uni-slate)', lineHeight: 1.6, marginBottom: '3.5rem', maxWidth: '600px' }}>
                  A unified platform for residential, commercial, and industrial property distribution. High-fidelity data, institutional-grade verification.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--uni-blue)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 800 }}>SEARCH_ALL_ASSETS</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'white', color: 'var(--uni-dark)', border: '1px solid var(--uni-dark)', borderRadius: '4px', fontWeight: 800 }}>LIST_YOUR_ASSET</button>
              </div>
          </div>
          <div style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" alt="Corporate Building" style={{ width: '100%', borderRadius: '8px', boxShadow: '40px 40px 80px rgba(0,0,0,0.05)' }} />
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '2.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--uni-border)', color: 'var(--uni-slate)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px' }}>
          <span>ASSETS_UNDER_MANAGEMENT: $12.5B</span>
          <span>NODAL_SYNC: ACTIVE</span>
          <span>VALUATION_ACCURACY: 99.8%</span>
          <span>REGULATORY_COMPLIANT: YES</span>
      </section>

      {/* Property Grid */}
      <section className="uni-grid">
          {properties.map((prop, i) => (
              <StandardPropCard key={i} {...prop} />
          ))}
      </section>

      {/* Industrial Scale CTA */}
      <section style={{ margin: '6rem 5%', padding: '8rem', background: 'var(--uni-dark)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '8px' }}>
          <div style={{ maxWidth: '700px' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Scale your <br/>portfolio globally.</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.6, lineHeight: 1.8 }}>
                  Our unified protocol allows for cross-vertical property management and distribution. Deploy your assets across the entire Sellio ecosystem.
              </p>
          </div>
          <button style={{ padding: '2rem 6rem', background: 'var(--uni-blue)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, fontSize: '1rem' }}>
              INITIALIZE_MASTER_NODE
          </button>
      </section>
    </div>
  );
}
