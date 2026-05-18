'use client';
import React from 'react';
import { MarketGrid, LiquidSyncBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="trade-hero" aria-labelledby="um-hero-title">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '3rem' }}>LIQUID_EXCHANGE_V5</div>
              <h1 className="um-heading-xl" id="um-hero-title">
                Trade the <br/><span>Future.</span>
              </h1>
              <p style={{ maxWidth: '800px', margin: '3rem auto 6rem', fontSize: '1.5rem', color: '#94a3b8', lineHeight: 1.8 }}>
                  The world's most advanced high-fidelity marketplace node. Precision transactional engineering for the modern global economy.
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }} className="um-hero-buttons">
                  <button className="trade-btn-primary" id="um-btn-explore" onClick={() => document.getElementById('um-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    START TRADING
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid #334155', 
                      color: 'white', 
                      padding: '1.5rem 5rem', 
                      borderRadius: '12px', 
                      fontFamily: 'var(--um-font-heading)', 
                      fontWeight: 800, 
                      fontSize: '1rem', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                  }} id="um-btn-market-data" onClick={() => alert('Exchange market data sync active.')}>
                      MARKET DATA
                  </button>
              </div>
          </div>
      </section>

      {/* Liquid Sync Bar */}
      <LiquidSyncBar />

      {/* Market Grid Section */}
      <MarketGrid />

      {/* Mid-Section: Transactional Authority */}
      <section className="um-logistics-grid" aria-labelledby="um-logistics-title">
          <div className="um-logistics-grid-container">
              <div>
                  <span className="um-mono" style={{ color: 'var(--um-green)' }}>TRANSACTIONAL_AUTHORITY</span>
                  <h2 style={{ fontFamily: 'var(--um-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--um-slate)', lineHeight: 1.1 }} id="um-logistics-title">Liquid <br/>Logistics.</h2>
                  <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                      The Trade Node protocol is designed for high-velocity peer-to-peer commerce. Every transaction is a node in the global Sellio registry, ensuring that your digital and physical assets are distributed with absolute precision.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }} className="um-metrics-row">
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--um-font-heading)', color: 'var(--um-slate)' }}>1.4B+</div>
                          <div className="um-mono" style={{ color: '#94a3b8', fontSize: '0.65rem' }}>ANNUAL_VOLUME</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--um-font-heading)', color: 'var(--um-slate)' }}>24/7</div>
                          <div className="um-mono" style={{ color: '#94a3b8', fontSize: '0.65rem' }}>MARKET_UPTIME</div>
                      </div>
                  </div>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '600px', background: 'var(--um-bg)', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--um-border)' }}>
                      <img src="/themes/unifieds/marketplace/1.webp" alt="Global Trade Operations Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="um-floating-verified-badge" id="um-badge-verified">
                      VERIFIED
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 5%', textAlign: 'center', background: 'var(--um-bg)' }} aria-labelledby="um-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--um-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--um-slate)', marginBottom: '4rem', letterSpacing: '-4px', lineHeight: 1.1 }} id="um-cta-title">Liquidate the <br/>Future.</h2>
              <p style={{ fontSize: '1.5rem', color: '#64748b', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your trade node to the global exchange and join the world's most liquid high-fidelity distribution network.
              </p>
              <button className="trade-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.4rem' }} id="um-btn-cta-handshake" onClick={() => alert('Exchange node handshake synchronized.')}>INITIALIZE TRADE NODE</button>
          </div>
      </section>
    </div>
  );
}
