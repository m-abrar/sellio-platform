'use client';
import React from 'react';
import { BrutalistUnitCard, StructuralStat } from './components';

export default function Page() {
  const units = [
    { title: "The Skyline Penthouse", price: "$4,250,000", location: "Downtown Core", beds: "3", sqft: "2,400", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Industrial Loft v2", price: "$850,000", location: "Arts District", beds: "1", sqft: "1,100", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070" },
    { title: "Glass Terrace Unit", price: "$1,200,000", location: "West End", beds: "2", sqft: "1,450", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070" },
    { title: "The Metro Studio", price: "$450,000", location: "Financial Center", beds: "0", sqft: "550", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070" },
    { title: "Harbor View Duplex", price: "$2,800,000", location: "Waterfront", beds: "3", sqft: "1,900", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070" },
    { title: "Concrete Minimalist", price: "$920,000", location: "South Side", beds: "2", sqft: "1,200", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074" },
  ];

  return (
    <div className="pu-section">
      {/* Brutalist Hero */}
      <section className="pu-hero">
        <div>
          <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>URBAN_LIVING_V8_DISTRIBUTION</div>
          <h1 className="pu-heading-xl">
            Skyline <br/>
            Registry.
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--pu-text-muted)', lineHeight: 2, maxWidth: '500px' }}>
            Modern sanctuaries in the heart of the high-fidelity city. Discover curated lofts, penthouses, and studios engineered for the vertical lifestyle.
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '3rem' }}>
            <button className="pu-btn-primary">Explore_Inventory</button>
            <button style={{ background: 'transparent', border: '2px solid var(--pu-steel)', color: 'var(--pu-steel)', padding: '1.5rem 4rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>List_Unit</button>
          </div>
        </div>
        <div className="pu-hero-image-wrapper">
          <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070" alt="Urban Skyline" className="pu-hero-image" />
        </div>
      </section>

      {/* Intelligence Section */}
      <section style={{ padding: '12rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10rem', alignItems: 'center' }}>
              <div>
                  <h2 style={{ fontSize: '4rem', fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', marginBottom: '3rem' }}>Connected <br/>Intelligence.</h2>
                  <p style={{ color: 'var(--pu-text-muted)', lineHeight: 1.8 }}>
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
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
              <div className="pu-mono">REGISTRY_COLLECTION // 2024</div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '0.9rem', color: 'var(--pu-text-muted)' }}>
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
      <section style={{ marginTop: '15rem', padding: '15rem 10%', background: 'var(--pu-steel)', color: 'white', textAlign: 'center' }}>
          <div className="pu-mono" style={{ color: 'var(--pu-cobalt)', marginBottom: '3rem' }}>CITY_PULSE_PROTOCOL</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 700, letterSpacing: '-4px', textTransform: 'uppercase', marginBottom: '4rem' }}>
              Live in the <br/>
              Pulse of the City.
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', opacity: 0.5, fontSize: '1.25rem', lineHeight: 1.8 }}>
              From the industrial lofts of the Arts District to the high-energy penthouses of the Financial Center, find the urban node that matches your frequency.
          </p>
          <button className="pu-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.2rem' }}>
              Authorize_District_Sync
          </button>
      </section>
    </div>
  );
}
