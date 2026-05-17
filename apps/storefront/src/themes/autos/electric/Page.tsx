'use client';
import React from 'react';
import { ElectricHeader, EVCard, IconBox, ElectricFooter } from './components';

export default function Page() {
  const evs = [
    { title: "2025 Tesla Model Y", price: "$47,000 USD", range: "330 Miles", battery: "75 kWh", charge: "250 kW", image: "/themes/autos/electric/tesla_y.png" },
    { title: "2025 Rivian R1T", price: "$70,000 USD", range: "314 Miles", battery: "135 kWh", charge: "200 kW", image: "/themes/autos/electric/rivian_r1t.png" },
    { title: "2024 Kia EV6", price: "$42,000 USD", range: "310 Miles", battery: "77.4 kWh", charge: "350 kW", image: "/themes/autos/electric/kia_ev6.png" },
    { title: "2024 Lucid Air", price: "$87,400 USD", range: "410 Miles", battery: "112 kWh", charge: "300 kW", image: "/themes/autos/electric/lucid_air.png" },
  ];

  return (
    <div className="autos-electric-wrapper">
      <ElectricHeader />

      {/* Hero Section */}
      <section className="ev-hero">
        <div className="ev-hero-content">
            <h1 className="ev-hero-title">The Future is <span className="ev-text-green">Electric</span></h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.8, lineHeight: 1.6 }}>
                Explore revolutionary vehicles and sustainable living. Experience peak performance with zero emissions.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#featured-evs" className="ev-btn ev-btn-green" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Browse EVs</a>
                <a href="#charging" className="ev-btn ev-btn-blue" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Locate Charging</a>
            </div>
        </div>
      </section>

      {/* Filters */}
      <section className="ev-filter-section">
        <div style={{ width: '100%', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }} className="ev-text-green">Quick Search</h2>
        </div>
        <select className="ev-select"><option>Brand</option></select>
        <select className="ev-select"><option>Range (Miles)</option></select>
        <select className="ev-select"><option>Price (USD)</option></select>
        <select className="ev-select"><option>Charging Type</option></select>
      </section>

      {/* Featured Models */}
      <section className="ev-section" id="featured-evs">
        <h2 className="ev-section-title">Featured <span className="ev-text-blue">EV Models</span></h2>
        <div className="ev-grid">
            {evs.map((ev, i) => (
                <EVCard key={i} {...ev} />
            ))}
        </div>
      </section>

      <hr style={{ borderTop: '1px solid var(--ev-accent-blue)', opacity: 0.25, margin: '2rem 5%' }} />

      {/* Compare EVs */}
      <section className="ev-section" id="compare-evs">
        <h2 className="ev-section-title">Compare The <span className="ev-text-green">Top EVs</span></h2>
        <div className="ev-compare-container">
            <div className="ev-compare-table">
                {/* Column 1 */}
                <div className="ev-compare-col" style={{ borderRight: '1px solid var(--ev-accent-green)' }}>
                    <div className="ev-compare-header primary">Feature</div>
                    <div className="ev-compare-cell feature">Starting Price</div>
                    <div className="ev-compare-cell feature">Max Range (EPA)</div>
                    <div className="ev-compare-cell feature">0-60 MPH</div>
                    <div className="ev-compare-cell feature">Max DC Charging</div>
                </div>
                {/* Column 2 */}
                <div className="ev-compare-col" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="ev-compare-header">Tesla Model Y</div>
                    <div className="ev-compare-cell">$47,000</div>
                    <div className="ev-compare-cell">330 mi</div>
                    <div className="ev-compare-cell">4.8s</div>
                    <div className="ev-compare-cell">250 kW</div>
                </div>
                {/* Column 3 */}
                <div className="ev-compare-col" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="ev-compare-header">Rivian R1T</div>
                    <div className="ev-compare-cell">$70,000</div>
                    <div className="ev-compare-cell">314 mi</div>
                    <div className="ev-compare-cell">3.0s</div>
                    <div className="ev-compare-cell">200 kW</div>
                </div>
                {/* Column 4 */}
                <div className="ev-compare-col">
                    <div className="ev-compare-header">Kia EV6</div>
                    <div className="ev-compare-cell">$42,000</div>
                    <div className="ev-compare-cell">310 mi</div>
                    <div className="ev-compare-cell">4.6s</div>
                    <div className="ev-compare-cell">350 kW</div>
                </div>
            </div>
        </div>
      </section>

      <hr style={{ borderTop: '1px solid var(--ev-accent-green)', opacity: 0.25, margin: '2rem 5%' }} />

      {/* Charging Network */}
      <section className="ev-section" id="charging">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
                <h2 className="ev-section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>An Expansive <span className="ev-text-blue">Charging Network</span></h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6, opacity: 0.8 }}>
                    Never worry about range anxiety. Our marketplace integrates with thousands of Level 2 and DC Fast Charging stations globally. Find, reserve, and pay—all in one app.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="ev-text-green">✓</span> Real-time availability updates</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="ev-text-green">✓</span> Integrated payment solutions</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><span className="ev-text-green">✓</span> Filter by plug type (CCS, NACS, CHAdeMO)</div>
                </div>
                <a href="#" className="ev-btn ev-btn-green">View Live Map</a>
            </div>
            <div>
                <div style={{ aspectRatio: '16/9', background: 'var(--ev-card-bg)', border: '1px solid var(--ev-accent-blue)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,255,255,0.2)' }}>
                    <span style={{ fontSize: '3rem' }}>🗺️ Map Placeholder</span>
                </div>
            </div>
        </div>
      </section>

      <hr style={{ borderTop: '1px solid var(--ev-accent-blue)', opacity: 0.25, margin: '2rem 5%' }} />

      {/* Sustainability */}
      <section className="ev-section" id="sustainability">
        <h2 className="ev-section-title">Sustainability <span className="ev-text-green">Highlights</span></h2>
        <div className="ev-icon-grid">
            <IconBox icon="🌱" title="Zero Emissions" desc="Contribute to a cleaner planet with every mile driven." />
            <IconBox icon="💻" title="Smart Tech Integration" desc="Over-the-air updates and advanced driver-assistance systems." />
            <IconBox icon="💰" title="Lower Costs" desc="Significantly reduced fuel and maintenance expenses over time." />
            <IconBox icon="☀️" title="Renewable Charging" desc="Options to filter and select charging stations powered by renewable energy." />
        </div>
      </section>

      <ElectricFooter />
    </div>
  );
}
