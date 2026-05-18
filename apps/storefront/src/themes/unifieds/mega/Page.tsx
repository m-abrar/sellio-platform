'use client';
import React from 'react';
import { HeavyweightGrid, MassiveSyncBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="mega-hero" aria-labelledby="ugm-hero-title">
          <div style={{ maxWidth: '1200px' }}>
              <div className="ugm-mono" style={{ color: 'var(--ugm-orange)', marginBottom: '3rem' }}>HEAVYWEIGHT_LOGIC_ACTIVE</div>
              <h1 className="ugm-heading-xl" id="ugm-hero-title">
                The <span>Heavyweight</span> <br/>Grid.
              </h1>
              <p style={{ maxWidth: '800px', fontSize: '1.5rem', color: '#888', lineHeight: 1.8, marginBottom: '6rem', marginTop: '3rem' }}>
                  The world's most powerful high-fidelity distribution node. Precision structural engineering for multi-vertical commerce at massive scale.
              </p>
              <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }} className="ugm-hero-buttons">
                  <button className="mega-btn-primary" id="ugm-btn-explore" onClick={() => document.getElementById('ugm-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    INITIALIZE MEGA SYNC
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid #333', 
                      color: 'white', 
                      padding: '1.5rem 5rem', 
                      fontFamily: 'var(--ugm-font-heading)', 
                      fontWeight: 900, 
                      fontSize: '1.1rem', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                  }} id="ugm-btn-spec" onClick={() => alert('Infrastructure spec console activated.')}>
                      INFRASTRUCTURE SPEC
                  </button>
              </div>
          </div>
      </section>

      {/* Massive Sync Bar */}
      <MassiveSyncBar />

      {/* Heavyweight Grid Section */}
      <HeavyweightGrid />

      {/* Mid-Section: Industrial Strength */}
      <section className="ugm-industrial-grid" aria-labelledby="ugm-industrial-title">
          <div className="ugm-industrial-grid-container">
              <div>
                  <span className="ugm-mono" style={{ color: 'var(--ugm-orange)' }}>INDUSTRIAL_STRENGTH</span>
                  <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--ugm-charcoal)', lineHeight: 1.1 }} id="ugm-industrial-title">Structural <br/>Authority.</h2>
                  <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                      The Mega Grid protocol is built for high-density data distribution. Every node is reinforced with multi-layer redundancy, ensuring that your storefront remains stable under any operational volume.
                  </p>
                  <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }} className="ugm-metrics-row">
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', color: 'var(--ugm-charcoal)' }}>8ms</div>
                          <div className="ugm-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>CORE_LATENCY</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ugm-font-heading)', color: 'var(--ugm-charcoal)' }}>99.9%</div>
                          <div className="ugm-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>NODAL_UPTIME</div>
                      </div>
                  </div>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '600px', background: 'white', border: '2px solid var(--ugm-charcoal)', overflow: 'hidden' }}>
                      <img src="/themes/unifieds/mega/1.webp" alt="Heavyweight Corporate Logistics Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="ugm-floating-reinforced-badge" id="ugm-badge-reinforced">
                      REINFORCED
                  </div>
              </div>
          </div>
      </section>

      {/* Authority Section */}
      <section style={{ padding: '12rem 5%', textAlign: 'center', background: 'white' }} aria-labelledby="ugm-cta-title">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--ugm-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-4px', color: 'var(--ugm-charcoal)', lineHeight: 1.1 }} id="ugm-cta-title">Authorize <br/>Distribution.</h2>
              <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your core node to the Mega Grid and join the world's most robust high-fidelity distribution network. Institutional performance, guaranteed.
              </p>
              <button className="mega-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.4rem' }} id="ugm-btn-cta-handshake" onClick={() => alert('Infrastructure node handshake synchronized.')}>INITIALIZE HEAVYWEIGHT NODE</button>
          </div>
      </section>
    </div>
  );
}
