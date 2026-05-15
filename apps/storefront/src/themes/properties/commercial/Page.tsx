
import React from 'react';
import { AssetCard } from './components';

export default function Page() {
  const assets = [
    { title: "One Skyline Plaza", type: "PRIME_OFFICE", area: "142,000 SQFT", status: "AVAILABLE", id: "ASSET-9921" },
    { title: "TechPark Hub", type: "MIXED_USE", area: "85,000 SQFT", status: "LEASING", id: "ASSET-4412" },
    { title: "Portside Logistics Center", type: "INDUSTRIAL", area: "250,000 SQFT", status: "AVAILABLE", id: "ASSET-1022" },
    { title: "The Atrium HQ", type: "OFFICE_CAMPUS", area: "110,000 SQFT", status: "OCCUPIED", id: "ASSET-3381" },
    { title: "Westside Retail Mall", type: "RETAIL_CENTER", area: "200,000 SQFT", status: "AVAILABLE", id: "ASSET-7756" },
    { title: "DataVault Station", type: "DATA_CENTER", area: "45,000 SQFT", status: "PRIVATE_SALE", id: "ASSET-8821" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="comm-hero">
          <div className="comm-hero-content">
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--comm-accent)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>INSTITUTIONAL_GRADE_ASSETS</span>
              <h1>Market <br/>Transparency.</h1>
              <p style={{ fontSize: '1.25rem', color: '#64748b', lineHeight: 1.6, marginBottom: '4rem' }}>
                  The Sellio Commercial Registry provides verified data and direct access to off-market institutional real estate assets globally.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                  <button style={{ padding: '1.25rem 3rem', background: 'var(--comm-primary)', color: 'white', border: 'none', fontWeight: 700 }}>EXPLORE_INVENTORY</button>
                  <button style={{ padding: '1.25rem 3rem', background: 'none', color: 'var(--comm-primary)', border: '1px solid var(--comm-primary)', fontWeight: 700 }}>REQUEST_APPRAISAL</button>
              </div>
          </div>
          <div style={{ width: '45%', height: '500px', background: '#f1f5f9', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" alt="Commercial Building" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: '2rem', left: '-3rem', background: 'white', padding: '2rem', border: '1px solid #eee', boxShadow: '20px 20px 60px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>$1.4B</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5 }}>QUARTERLY_TURNOVER</div>
              </div>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '3rem 6rem', background: '#f8fafc', borderBottom: '1px solid var(--comm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#cbd5e1' }}>AS_FEATURED_IN:</span>
          {['FINANCIAL_TIMES', 'BLOOMBERG', 'RE_JOURNAL', 'WALL_STREET_POST'].map(brand => (
              <span key={brand} style={{ fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8' }}>{brand}</span>
          ))}
      </section>

      {/* Asset Grid */}
      <section className="asset-grid">
          {assets.map((asset, i) => (
              <AssetCard key={i} {...asset} />
          ))}
      </section>

      {/* Stats / Value Prop */}
      <section style={{ padding: '12rem 6rem', display: 'flex', gap: '8rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem' }}>The Intelligence <br/>Behind the Asset.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2 }}>
                  Every asset in our registry undergoes a multi-point verification protocol, including structural audits, zoning compliance checks, and local market yield analysis.
              </p>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--comm-accent)' }}>48h</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>DUE_DILIGENCE_SPEED</div>
              </div>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--comm-accent)' }}>12%</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>AVG_YIELD_v2026</div>
              </div>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--comm-accent)' }}>142</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>GLOBAL_NODES</div>
              </div>
              <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--comm-accent)' }}>99.9%</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>DATA_ACCURACY</div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '10rem 6rem', background: '#f1f5f9', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '3rem' }}>Ready to Scale Your Portfolio?</h2>
              <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '5rem' }}>
                  Join over 12,000 institutional investors and family offices currently acquiring on the Sellio Commercial Network.
              </p>
              <button style={{ padding: '1.5rem 5rem', background: 'var(--comm-primary)', color: 'white', border: 'none', fontWeight: 900, fontSize: '1rem' }}>
                  REQUEST_INSTITUTIONAL_ACCESS
              </button>
          </div>
      </section>
    </div>
  );
}
