
import React from 'react';
import { UnitCard } from './components';

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
    <div>
      {/* Hero */}
      <section className="metro-hero">
          <div className="metro-hero-content">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.7rem', color: 'var(--urban-accent)', letterSpacing: '4px', display: 'block', marginBottom: '1.5rem' }}>URBAN_LIVING_REDEFINED</span>
              <h1>Elevate Your <br/>Perspective.</h1>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.8, marginBottom: '3.5rem' }}>
                  Modern sanctuaries in the heart of the city. Discover curated lofts, penthouses, and studios designed for the vertical lifestyle.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3rem', background: 'var(--urban-text)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700 }}>EXPLORE_MAP</button>
                  <button style={{ padding: '1.25rem 3rem', background: 'none', color: 'var(--urban-text)', border: '1px solid var(--urban-text)', borderRadius: '4px', fontWeight: 700 }}>LIST_YOUR_UNIT</button>
              </div>
          </div>
      </section>

      {/* Feature Section */}
      <section style={{ padding: '8rem 10%', display: 'flex', gap: '10rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
              <div style={{ width: '80px', height: '2px', background: 'var(--urban-accent)', marginBottom: '3rem' }}></div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 900, marginBottom: '2.5rem' }}>Connected <br/>Intelligence.</h2>
              <p style={{ color: '#64748b', lineHeight: 2, fontSize: '1.05rem' }}>
                  Our urban properties are equipped with the latest smart-grid technologies, ensuring seamless connectivity and efficient energy management for the modern dweller.
              </p>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>10Gb</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.4 }}>STANDARD_FIBER</div>
              </div>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>A+</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.4 }}>ENERGY_RATING</div>
              </div>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>24h</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.4 }}>DIGITAL_CONCIERGE</div>
              </div>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>EV</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.4 }}>CHARGING_READY</div>
              </div>
          </div>
      </section>

      {/* Unit Grid */}
      <section style={{ background: '#f8fafc' }}>
          <div className="unit-grid">
              {units.map((unit, i) => (
                  <UnitCard key={i} {...unit} />
              ))}
          </div>
      </section>

      {/* Neighborhood CTA */}
      <section style={{ padding: '10rem 10%', textAlign: 'center', background: 'linear-gradient(to bottom, #f8fafc, #fff)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem' }}>Live in the <br/>Pulse of the City.</h2>
              <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '5rem' }}>
                  From the quiet corners of the Arts District to the high-energy Financial Center, find the neighborhood that matches your frequency.
              </p>
              <button style={{ padding: '1.5rem 5rem', background: 'var(--urban-accent)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px' }}>
                  EXPLORE_DISTRICTS
              </button>
          </div>
      </section>
    </div>
  );
}
