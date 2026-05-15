
import React from 'react';
import { MarketGrid, LiquidSyncBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="trade-hero">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--trade-green)', letterSpacing: '10px', marginBottom: '3rem' }}>LIQUID_EXCHANGE_V5</div>
              <h1>Trade the <br/><span>Future.</span></h1>
              <p style={{ maxWidth: '800px', margin: '0 auto 6rem', fontSize: '1.5rem', color: '#64748b', lineHeight: 1.8 }}>
                  The world's most advanced high-fidelity marketplace node. Precision transactional engineering for the modern global economy.
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
                  <button className="trade-btn-primary">START_TRADING</button>
                  <button style={{ background: 'transparent', border: '1px solid #334155', color: 'white', padding: '1.5rem 5rem', borderRadius: '12px', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>MARKET_DATA</button>
              </div>
          </div>
      </section>

      {/* Liquid Sync Bar */}
      <LiquidSyncBar />

      {/* Market Grid Section */}
      <MarketGrid />

      {/* Mid-Section: Transactional Authority */}
      <section style={{ padding: '15rem 5%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10rem', alignItems: 'center', background: 'white' }}>
          <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--trade-green)', letterSpacing: '6px' }}>TRANSACTIONAL_AUTHORITY</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px' }}>Liquid <br/>Logistics.</h2>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                  The Trade Node protocol is designed for high-velocity peer-to-peer commerce. Every transaction is a node in the global Sellio registry, ensuring that your digital and physical assets are distributed with absolute precision.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--trade-slate)' }}>1.4B+</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>ANNUAL_VOLUME</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--trade-slate)' }}>24/7</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>MARKET_UPTIME</div>
                  </div>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '600px', background: 'var(--trade-bg)', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--trade-border)' }}>
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070" alt="Tech Workplace" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '150px', height: '150px', background: 'var(--trade-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', letterSpacing: '2px', fontSize: '0.8rem' }}>
                  VERIFIED
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', background: 'var(--trade-bg)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: 900, color: 'var(--trade-slate)', marginBottom: '4rem', letterSpacing: '-4px' }}>Liquidate the <br/>Future.</h2>
              <p style={{ fontSize: '1.5rem', color: '#64748b', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your trade node to the global exchange and join the world's most liquid high-fidelity distribution network.
              </p>
              <button className="trade-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.5rem' }}>INITIALIZE_TRADE_NODE</button>
          </div>
      </section>
    </div>
  );
}
