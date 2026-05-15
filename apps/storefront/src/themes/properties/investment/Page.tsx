'use client';
import React from 'react';
import { PortfolioAssetCard, YieldAnalyticsHUD } from './components';

export default function Page() {
  const assets = [
    { title: "Metro Multi-Family Node", yield: "8.4% ARR", price: "$12,500,000", type: "Residential", status: "VERIFIED" },
    { title: "Innovation Tech Plaza", yield: "7.2% ARR", price: "$42,000,000", type: "Commercial", status: "ACTIVE" },
    { title: "Logistics Core Hub", yield: "9.1% ARR", price: "$18,200,000", type: "Industrial", status: "PREMIUM" },
    { title: "Retail Strip Portfolio", yield: "6.8% ARR", price: "$5,400,000", type: "Retail", status: "VERIFIED" },
    { title: "Solar Infrastructure Node", yield: "12.5% ARR", price: "$8,900,000", type: "Specialty", status: "ACTIVE" },
    { title: "Waterfront Development", yield: "15.0% IRR", price: "$120,000,000", type: "Development", status: "INSTITUTIONAL" },
    { title: "Data Center Alpha", yield: "10.2% ARR", price: "$55,000,000", type: "Infrastructure", status: "ACTIVE" },
    { title: "Medical Office Suites", yield: "7.5% ARR", price: "$3,200,000", type: "Commercial", status: "VERIFIED" },
    { title: "Downtown Mixed-Use", yield: "8.9% ARR", price: "$28,000,000", type: "Residential", status: "ACTIVE" },
  ];

  return (
    <div className="pi-section">
      {/* Financial Terminal Hero */}
      <section className="pi-hero">
        <div>
          <div className="pi-mono" style={{ marginBottom: '2.5rem' }}>PORTFOLIO_SYNC_V8_ACTIVE</div>
          <h1 className="pi-heading-xl">
            Capital <br/>
            Distribution <br/>
            <span style={{ color: 'var(--pi-emerald)' }}>Synchronized.</span>
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--pi-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            The global high-fidelity terminal for institutional real estate investment. Deploy capital across verified asset nodes with performance-driven precision.
          </p>
          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <button className="pi-btn-primary">Execute_Investment</button>
            <button style={{ background: 'transparent', border: '2px solid var(--pi-midnight)', color: 'var(--pi-midnight)', padding: '1.5rem 4rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>View_Reports</button>
          </div>
        </div>
        <div className="pi-hero-terminal">
          <div className="pi-mono" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--pi-border)', paddingBottom: '1.5rem' }}>NETWORK_PERFORMANCE_METRICS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <YieldAnalyticsHUD label="TOTAL_NETWORK_VOLUME" value="$4.2B+" color="var(--pi-emerald)" />
            <YieldAnalyticsHUD label="AVERAGE_YIELD_ARR" value="8.4%" />
            <YieldAnalyticsHUD label="LIQUIDITY_INDEX" value="0.82" />
            <YieldAnalyticsHUD label="VOLATILITY_HEDGE" value="ACTIVE" color="var(--pi-gold)" />
          </div>
        </div>
      </section>

      {/* Logic Bar */}
      <div style={{ padding: '3rem 6%', background: 'white', borderBottom: '1px solid var(--pi-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {['MARKET_STATUS: STABLE', 'NODAL_VERIFICATION: 100%', 'INSTITUTIONAL_AUTH: VERIFIED', 'SETTLEMENT: INSTANT'].map(logic => (
              <div key={logic} className="pi-mono" style={{ fontSize: '0.65rem' }}>{logic}</div>
          ))}
      </div>

      {/* Asset Performance Grid */}
      <section style={{ marginTop: '10rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="pi-mono" style={{ marginBottom: '1.5rem' }}>YIELD_REGISTRY</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>Asset <br/>Performance.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--pi-slate)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes real-time performance metadata from residential, commercial, and industrial yield nodes.
              </div>
          </div>
          
          <div className="pi-asset-grid">
            {assets.map((a, i) => (
              <PortfolioAssetCard key={i} {...a} />
            ))}
          </div>
      </section>

      {/* Institutional CTA */}
      <section style={{ marginTop: '15rem', padding: '12rem 8%', background: 'var(--pi-midnight)', color: 'white', borderRadius: '4px', textAlign: 'center' }}>
          <div className="pi-mono" style={{ color: 'var(--pi-emerald)', marginBottom: '3rem' }}>INSTITUTIONAL_GRADE_LOGIC</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }}>
              Scale Your <br/>
              Portfolio Yield.
          </h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 8rem', opacity: 0.5, fontSize: '1.25rem', lineHeight: 1.8 }}>
              Our investment nodes are built on a foundation of verified financial metadata. Connect your capital node to the Sellio network for high-fidelity asset distribution.
          </p>
          <button className="pi-btn-primary" style={{ background: 'var(--pi-emerald)', padding: '2.5rem 8rem', fontSize: '1.25rem' }}>
              Connect_Capital_Node
          </button>
      </section>
      
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
