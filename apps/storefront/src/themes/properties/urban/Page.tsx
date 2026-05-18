'use client';
import React from 'react';
import { BrutalistUnitCard, StructuralStat } from './components';

export default function Page() {
  const units = [
    { title: "The Skyline Penthouse", price: "$4,250,000", location: "Downtown Core Node", beds: "3", sqft: "2,400", image: "/themes/properties/urban/9.webp" },
    { title: "Industrial Loft v2", price: "$850,000", location: "Arts District Sector", beds: "1", sqft: "1,100", image: "/themes/properties/urban/10.webp" },
    { title: "Glass Terrace Unit", price: "$1,200,000", location: "West End Hub", beds: "2", sqft: "1,450", image: "/themes/properties/urban/11.webp" },
    { title: "The Metro Studio", price: "$450,000", location: "Financial Center Node", beds: "0", sqft: "550", image: "/themes/properties/urban/12.webp" },
    { title: "Harbor View Duplex", price: "$2,800,000", location: "Waterfront Hub", beds: "3", sqft: "1,900", image: "/themes/properties/urban/13.webp" },
    { title: "Concrete Minimalist", price: "$920,000", location: "South Side Sector", beds: "2", sqft: "1,200", image: "/themes/properties/urban/14.webp" },
  ];

  return (
    <div className="pu-section">
      {/* Brutalist Hero */}
      <section className="pu-hero" aria-labelledby="pu-hero-title">
        <div>
          <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>URBAN_LIVING_V8_DISTRIBUTION</div>
          <h1 className="pu-heading-xl" id="pu-hero-title">
            Skyline <br/>
            Registry.
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.25rem', color: 'var(--pu-text-muted)', lineHeight: 2, maxWidth: '500px' }}>
            Modern sanctuaries in the heart of the high-fidelity city. Discover curated lofts, penthouses, and studios engineered for the vertical lifestyle.
          </p>
          <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <button className="pu-btn-primary" id="pu-btn-explore" onClick={() => document.getElementById('pu-registry-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Inventory
            </button>
            <button style={{ 
                background: 'transparent', 
                border: '2px solid var(--pu-steel)', 
                color: 'var(--pu-steel)', 
                padding: '1.5rem 4rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} id="pu-btn-list" onClick={() => alert('Registering new urban unit node.')}>
              List Unit
            </button>
          </div>
        </div>
        <div className="pu-hero-image-wrapper">
          <img src="/themes/properties/urban/1.webp" alt="High-Rise Urban Skyline Architectural Framework" className="pu-hero-image" />
        </div>
      </section>

      {/* Intelligence Section */}
      <section style={{ padding: '8rem 0' }} className="pu-intelligence-section" aria-labelledby="pu-intel-title">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '6rem', alignItems: 'center' }} className="pu-hero">
              <div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, textTransform: 'uppercase', marginBottom: '3rem', color: 'var(--pu-steel)' }} id="pu-intel-title">
                    Connected <br/>Intelligence.
                  </h2>
                  <p style={{ color: 'var(--pu-text-muted)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                      Our urban nodes are equipped with high-fidelity smart-grid technologies, ensuring absolute connectivity and architectural precision for the modern dweller.
                  </p>
              </div>
              <div className="pu-stats-grid">
                  <StructuralStat value="10Gb" label="STANDARD_FIBER" />
                  <StructuralStat value="A+" label="ENERGY_RATING" />
                  <StructuralStat value="24h" label="CONCIERGE_NODE" />
                  <StructuralStat value="EV" label="CHARGING_SYNC" />
              </div>
          </div>
      </section>

      {/* Unit Grid */}
      <section id="pu-registry-grid" aria-labelledby="pu-grid-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <div className="pu-mono" style={{ marginBottom: '1rem' }}>REGISTRY_COLLECTION // 2026</div>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }} id="pu-grid-title">Registry Node Units</h2>
              </div>
              <div style={{ maxWidth: '400px', fontSize: '0.95rem', color: 'var(--pu-text-muted)', lineHeight: 1.8 }}>
                  Every architectural unit is synchronized with our global registry node, ensuring 100% data integrity and availability status.
              </div>
          </div>
          
          <div className="pu-unit-grid">
            {units.map((u, i) => (
              <BrutalistUnitCard key={i} {...u} />
            ))}
          </div>
      </section>

      {/* Neighborhood CTA */}
      <section style={{ marginTop: '10rem', padding: '10rem 10%', background: 'var(--pu-steel)', color: 'white', textAlign: 'center' }} className="pu-cta-box" aria-labelledby="pu-cta-title">
          <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>CITY_PULSE_PROTOCOL</div>
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }} id="pu-cta-title">
              Live in the <br/>
              Pulse of the City.
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', opacity: 0.6, fontSize: '1.25rem', lineHeight: 1.8 }}>
              From the industrial lofts of the Arts District to the high-energy penthouses of the Financial Center, find the urban node that matches your frequency.
          </p>
          <button className="pu-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.2rem' }} id="pu-btn-cta-auth" onClick={() => alert('District sync authorization handshake initiated.')}>
              Authorize District Sync
          </button>
      </section>
    </div>
  );
}
