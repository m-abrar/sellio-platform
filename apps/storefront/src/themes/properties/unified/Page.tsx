'use client';
import React from 'react';
import { UnifiedPropCard, MarketMetricsHUD } from './components';

export default function Page() {
  const properties = [
    { title: "Westside Corporate Center", price: "$14,500,000", location: "Downtown", type: "COMMERCIAL", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" },
    { title: "Harbor Industrial Park", price: "$8,200,000", location: "Port District", type: "INDUSTRIAL", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070" },
    { title: "Modern Family Estate", price: "$1,250,000", location: "Suburbs", type: "RESIDENTIAL", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070" },
    { title: "Agricultural Growth Node", price: "$450,000", location: "Rural Sector", type: "LAND", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000" },
    { title: "Tech Park Office Suite", price: "$2,800,000", location: "Innovation Hub", type: "COMMERCIAL", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" },
    { title: "Riverside Loft Complex", price: "$12,000,000", location: "Arts District", type: "RESIDENTIAL", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070" },
    { title: "Central Distribution Hub", price: "$5,400,000", location: "Logistics Zone", type: "INDUSTRIAL", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070" },
    { title: "Mountain Retreat Land", price: "$320,000", location: "Alpine Sector", type: "LAND", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070" },
  ];

  return (
    <div className="uh-section">
      {/* Universal Hero */}
      <section className="uh-hero">
        <div>
          <div className="uh-mono" style={{ marginBottom: '2.5rem' }}>UNIVERSAL_PROPERTY_PROTOCOL_V8</div>
          <h1 className="uh-heading-xl">
            The Authoritative <br/>
            Distribution <br/>
            Node.
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--uh-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            A unified platform for residential, commercial, and industrial property distribution. High-fidelity data, institutional-grade verification, and global accessibility.
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '2.5rem' }}>
            <button className="uh-btn-primary">Search_All_Assets</button>
            <button style={{ background: 'transparent', border: '1px solid var(--uh-indigo)', color: 'var(--uh-indigo)', padding: '1.25rem 3.5rem', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}>List_Asset</button>
          </div>
        </div>
        <div className="uh-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" alt="Corporate" className="uh-hero-img" />
        </div>
      </section>

      {/* Metrics Bar */}
      <div style={{ margin: '8rem 0' }}>
        <MarketMetricsHUD />
      </div>

      {/* Property Grid */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
              <div>
                  <div className="uh-mono" style={{ marginBottom: '1.5rem' }}>MASTER_REGISTRY</div>
                  <h2 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px' }}>High-Fidelity <br/>Inventory.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '0.9rem', color: 'var(--uh-slate)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes metadata from multiple verticals into a single authoritative property node.
              </div>
          </div>
          
          <div className="uh-prop-grid">
            {properties.map((p, i) => (
              <UnifiedPropCard key={i} {...p} />
            ))}
          </div>
      </section>

      {/* Scale CTA */}
      <section style={{ marginTop: '15rem', padding: '10rem', background: 'var(--uh-indigo)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '4px' }}>
          <div style={{ maxWidth: '800px' }}>
              <div className="uh-mono" style={{ color: 'var(--uh-blue)', marginBottom: '2.5rem' }}>INSTITUTIONAL_SCALE</div>
              <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', lineHeight: 1 }}>Scale Your <br/>Portfolio Globally.</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.6, lineHeight: 1.8 }}>
                  Our unified protocol allows for cross-vertical property management and distribution. Deploy your assets across the entire Sellio ecosystem with 100% nodal integrity.
              </p>
          </div>
          <button className="uh-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.25rem' }}>
              Initialize_Master_Node
          </button>
      </section>
    </div>
  );
}
