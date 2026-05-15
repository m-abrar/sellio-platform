
import React from 'react';
import { AssetCard } from './components';

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
    <div>
      {/* Hero Section */}
      <section className="inv-hero">
          <div style={{ flex: 1.2 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.75rem', color: 'var(--inv-gold)', letterSpacing: '4px', marginBottom: '2rem' }}>PORTFOLIO_SYNC: ACTIVE</div>
              <h1>Capital <br/>Distribution.</h1>
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: '#64748b', lineHeight: 1.8, marginBottom: '4rem' }}>
                  The high-fidelity terminal for institutional real estate investment. Deploy capital across verified asset nodes with precision.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                  <button style={{ padding: '1.5rem 4rem', background: 'var(--inv-charcoal)', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem' }}>EXECUTE_INVESTMENT</button>
                  <button style={{ padding: '1.5rem 4rem', background: 'none', color: 'var(--inv-charcoal)', border: '1px solid #ddd', fontWeight: 900, fontSize: '0.9rem' }}>VIEW_REPORTS</button>
              </div>
          </div>
          <div style={{ flex: 1, padding: '4rem', background: 'white', border: '1px solid var(--inv-border)', borderRadius: '4px', boxShadow: '0 40px 80px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2rem' }}>Network Performance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.5rem' }}>TOTAL_VOLUME</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--inv-gold)' }}>$4.2B+</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.5rem' }}>AVG_YIELD</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--inv-green)' }}>8.4%</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '2.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--inv-border)', color: '#94a3b8', fontFamily: 'var(--font-data)', fontSize: '0.7rem', letterSpacing: '1px' }}>
          <span>MARKET_STATUS: STABLE</span>
          <span>LIQUIDITY_INDEX: 0.82</span>
          <span>VOLATILITY_HEDGE: ACTIVE</span>
          <span>NODAL_VERIFICATION: 100%</span>
      </section>

      {/* Asset Grid */}
      <section className="asset-grid">
          {assets.map((asset, i) => (
              <AssetCard key={i} {...asset} />
          ))}
      </section>

      {/* Institutional CTA */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', background: '#f8fafc' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2px' }}>Institutional <br/>Grade Logic.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2, marginBottom: '5rem' }}>
                  Our investment nodes are built on a foundation of verified financial data. Connect your capital node to the Sellio network for high-fidelity asset distribution.
              </p>
              <button style={{ padding: '2rem 6rem', background: 'var(--inv-gold)', color: 'white', border: 'none', fontWeight: 900, fontSize: '1rem', boxShadow: '0 20px 50px rgba(180, 83, 9, 0.2)' }}>
                  CONNECT_CAPITAL_NODE
              </button>
          </div>
      </section>
    </div>
  );
}
