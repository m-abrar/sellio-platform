'use client';
import React from 'react';
import { UnifiedPropCard, MarketMetricsHUD } from './components';

export default function Page() {
  const properties = [
    { title: "Westside Corporate Center", price: "$14,500,000", location: "Downtown Core", type: "COMMERCIAL", image: "/themes/properties/unified/1.webp" },
    { title: "Harbor Industrial Park", price: "$8,200,000", location: "Port Logistics District", type: "INDUSTRIAL", image: "/themes/properties/unified/2.webp" },
    { title: "Modern Family Estate", price: "$1,250,000", location: "Suburban Pines", type: "RESIDENTIAL", image: "/themes/properties/unified/3.webp" },
    { title: "Agricultural Growth Node", price: "$450,000", location: "Rural Sector Alpha", type: "LAND", image: "/themes/properties/unified/4.webp" },
    { title: "Tech Park Office Suite", price: "$2,800,000", location: "Innovation Hub", type: "COMMERCIAL", image: "/themes/properties/unified/5.webp" },
    { title: "Riverside Loft Complex", price: "$12,000,000", location: "Arts & Heritage District", type: "RESIDENTIAL", image: "/themes/properties/unified/6.webp" },
    { title: "Central Distribution Hub", price: "$5,400,000", location: "Logistics Zone B", type: "INDUSTRIAL", image: "/themes/properties/unified/7.webp" },
    { title: "Mountain Retreat Land", price: "$320,000", location: "Alpine Ridge Sector", type: "LAND", image: "/themes/properties/unified/8.webp" },
  ];

  return (
    <div className="uh-section">
      {/* Universal Hero */}
      <section className="uh-hero" aria-labelledby="uh-hero-title">
        <div>
          <div className="uh-mono" style={{ marginBottom: '2.5rem' }}>UNIVERSAL_PROPERTY_PROTOCOL_V8</div>
          <h1 className="uh-heading-xl" id="uh-hero-title">
            The Authoritative <br/>
            Distribution <br/>
            <span style={{ color: 'var(--uh-blue)' }}>Node.</span>
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.25rem', color: 'var(--uh-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            A unified platform for residential, commercial, and industrial property distribution. High-fidelity data, institutional-grade verification, and global accessibility.
          </p>
          <div style={{ marginTop: '4rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }} className="uh-hero-buttons">
            <button className="uh-btn-primary" id="uh-btn-explore" onClick={() => document.getElementById('uh-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              Search All Assets
            </button>
            <button style={{ 
                background: 'transparent', 
                border: '2px solid var(--uh-indigo)', 
                color: 'var(--uh-indigo)', 
                padding: '1.25rem 3.5rem', 
                borderRadius: '8px', 
                fontWeight: 800, 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} id="uh-btn-list" onClick={() => alert('Registering new properties node. Developer active.')}>
                List Asset
            </button>
          </div>
        </div>
        <div className="uh-hero-img-wrapper">
          <img src="/themes/properties/unified/1.webp" alt="Universal Corporate Hub Property Layout" className="uh-hero-img" />
        </div>
      </section>

      {/* Metrics Bar */}
      <section style={{ margin: '6rem 0' }} aria-label="Market Performance HUD">
        <MarketMetricsHUD />
      </section>

      {/* Property Grid Section */}
      <section id="uh-registry-grid" aria-labelledby="uh-grid-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', flexWrap: 'wrap', gap: '3rem' }}>
              <div>
                  <div className="uh-mono" style={{ marginBottom: '1.5rem' }}>MASTER_REGISTRY</div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, color: 'var(--uh-indigo)' }} id="uh-grid-title">High-Fidelity <br/>Inventory.</h2>
              </div>
              <div style={{ maxWidth: '400px', fontSize: '0.95rem', color: 'var(--uh-slate)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes metadata from multiple property verticals into a single authoritative and searchable catalog registry node.
              </div>
          </div>
          
          <div className="uh-prop-grid">
            {properties.map((p, i) => (
              <UnifiedPropCard key={i} {...p} />
            ))}
          </div>
      </section>

      {/* Scale CTA */}
      <section style={{ marginTop: '12rem', padding: '8rem 4rem', background: 'var(--uh-indigo)', color: 'white', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '3rem', position: 'relative', overflow: 'hidden' }} className="uh-cta-box" aria-labelledby="uh-cta-title">
          <div style={{ maxWidth: '800px', zIndex: 2 }}>
              <div className="uh-mono" style={{ color: 'var(--uh-blue)', marginBottom: '2.5rem' }}>INSTITUTIONAL_SCALE</div>
              <h2 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', lineHeight: 1 }} id="uh-cta-title">Scale Your <br/>Portfolio Globally.</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.7, lineHeight: 1.8 }}>
                  Our unified protocol allows for cross-vertical property management and distribution. Deploy your assets across the entire Sellio ecosystem with 100% nodal integrity.
              </p>
          </div>
          
          <div style={{ zIndex: 2 }}>
            <button className="uh-btn-primary" style={{ padding: '2rem 7rem', fontSize: '1.15rem' }} id="uh-btn-cta-initialize" onClick={() => alert('Authentication and master node allocation protocol running.')}>
                Initialize Master Node
            </button>
          </div>
          
          <div style={{ position: 'absolute', right: '-10%', bottom: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--uh-blue)', opacity: 0.15, filter: 'blur(80px)' }}></div>
      </section>
    </div>
  );
}
