'use client';
import React from 'react';
import { AssetRegistryCard, IntelligenceHUD } from './components';

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
    <div className="pc-section">
      {/* Institutional Hero */}
      <section className="pc-hero">
        <div>
          <div className="pc-mono" style={{ marginBottom: '2.5rem' }}>COMMERCIAL_REGISTRY_V8_DISTRIBUTION</div>
          <h1 className="pc-heading-xl">
            Market <br/>
            Transparency <br/>
            <span style={{ color: 'var(--pc-blue)' }}>Engineered.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--pc-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            The authoritative commercial registry providing verified yield data and direct access to institutional-grade real estate assets globally.
          </p>
          
          <div className="pc-hero-stats">
              <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>$1.4B</div>
              <div className="pc-mono" style={{ fontSize: '0.6rem', color: 'white', opacity: 0.6 }}>QUARTERLY_TURNOVER</div>
          </div>

          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <button className="pc-btn-primary">Explore_Inventory</button>
            <button style={{ background: 'transparent', border: '2px solid var(--pc-carbon)', color: 'var(--pc-carbon)', padding: '1.5rem 4rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>Request_Appraisal</button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--pc-bg)', padding: '2rem', border: '1px solid var(--pc-border)' }}>
            <img src="/themes/properties/commercial/8.webp" alt="Corporate Architecture" style={{ width: '100%', height: '700px', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.9)' }} />
          </div>
        </div>
      </section>

      {/* Intelligence HUD Section */}
      <section style={{ padding: '12rem 0', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem' }}>
                  The Intelligence <br/>Behind the Asset.
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--pc-slate)', lineHeight: 2 }}>
                  Every asset in our registry undergoes a multi-point verification protocol, including structural audits, zoning compliance checks, and high-fidelity market yield analysis.
              </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
              <IntelligenceHUD label="DUE_DILIGENCE_SPEED" value="48h" />
              <IntelligenceHUD label="AVG_YIELD_v2026" value="12%" />
              <IntelligenceHUD label="GLOBAL_NODES" value="142" />
          </div>
      </section>

      {/* Asset Grid */}
      <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="pc-mono" style={{ marginBottom: '1.5rem' }}>INSTITUTIONAL_INVENTORY</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>Asset <br/>Registry.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--pc-slate)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes performance data from prime office, industrial, and retail assets into a single authoritative node.
              </div>
          </div>
          
          <div className="pc-asset-grid">
            {assets.map((a, i) => (
              <AssetRegistryCard key={i} {...a} />
            ))}
          </div>
      </section>

      {/* Trust bar / Featured In */}
      <div style={{ padding: '8rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--pc-border)', marginTop: '10rem' }}>
          <span className="pc-mono" style={{ color: 'var(--pc-slate)', opacity: 0.5 }}>AS_FEATURED_IN:</span>
          {['FINANCIAL_TIMES', 'BLOOMBERG', 'RE_JOURNAL', 'WALL_STREET_POST'].map(brand => (
              <span key={brand} className="pc-mono" style={{ opacity: 0.3 }}>{brand}</span>
          ))}
      </div>

      {/* Final CTA */}
      <section style={{ marginTop: '10rem', padding: '15rem 0', background: 'var(--pc-carbon)', color: 'white', textAlign: 'center' }}>
          <div className="pc-mono" style={{ color: 'var(--pc-blue)', marginBottom: '3rem' }}>INSTITUTIONAL_ACQUISITION</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', marginBottom: '4rem' }}>
              Scale Your <br/>
              Portfolio.
          </h2>
          <p style={{ maxWidth: '750px', margin: '0 auto 6rem', opacity: 0.5, fontSize: '1.25rem', lineHeight: 1.8 }}>
              Join over 12,000 institutional investors and family offices currently acquiring on the Sellio Commercial Network.
          </p>
          <button className="pc-btn-primary" style={{ background: 'var(--pc-blue)', padding: '2.5rem 8rem', fontSize: '1.25rem' }}>
              Request_Institutional_Access
          </button>
      </section>
    </div>
  );
}
