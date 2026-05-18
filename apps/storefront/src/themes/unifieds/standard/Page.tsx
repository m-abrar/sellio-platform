'use client';
import React from 'react';
import { ProtocolGrid, EfficiencyBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="scale-hero" aria-labelledby="usp-hero-title">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="usp-mono" style={{ color: 'var(--usp-gray)', marginBottom: '2.5rem' }}>MODULAR_DISTRIBUTION_V1</div>
              <h1 className="usp-heading-xl" id="usp-hero-title">
                The <span>Scale</span> <br/>Protocol.
              </h1>
              <p style={{ maxWidth: '600px', margin: '2rem auto 5rem', fontSize: '1.25rem', color: 'var(--usp-gray)', lineHeight: 1.8, fontWeight: 300 }}>
                  The world's most efficient high-fidelity distribution node. Modular, precise, and engineered for global multi-vertical commerce.
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }} className="usp-hero-buttons">
                  <button className="scale-btn-primary" id="usp-btn-explore" onClick={() => document.getElementById('usp-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    INITIALIZE NODE
                  </button>
                  <button style={{ background: 'transparent', border: '1px solid #ddd', padding: '1.5rem 4rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', color: 'var(--usp-navy)' }} id="usp-btn-doc" onClick={() => alert('Scale Protocol documentation initialized.')}>
                    VIEW DOCUMENTATION
                  </button>
              </div>
          </div>
      </section>

      {/* Efficiency Bar */}
      <EfficiencyBar />

      {/* Protocol Grid Section */}
      <section style={{ padding: '8rem 6% 0', textAlign: 'center' }} aria-labelledby="usp-layers-title">
          <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1.5px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-layers-title">Universal Logic Layers.</h2>
      </section>
      <ProtocolGrid />

      {/* Mid-Section: Geometric Precision */}
      <section className="usp-geometric-section" aria-labelledby="usp-mid-title">
          <div className="usp-geometric-grid">
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '500px', background: 'white', borderRadius: '12px', border: '1px solid var(--usp-border)', overflow: 'hidden' }}>
                      <img src="/themes/unifieds/standard/1.webp" alt="Hardware Tech Precision Calibration" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  </div>
                  <div className="usp-geometric-badge" id="usp-badge-calibration"></div>
              </div>
              <div>
                  <span className="usp-mono" style={{ color: 'var(--usp-navy)' }}>GEOMETRIC_PRECISION</span>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', fontWeight: 800, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-mid-title">Modular <br/>Efficiency.</h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--usp-gray)', lineHeight: 2, marginBottom: '4rem', fontWeight: 300 }}>
                      Every node in the Scale Protocol is designed for maximum efficiency. By isolating architectural layers and standardizing data mapping, we achieve a distribution latency that is unmatched in the multi-vertical market.
                  </p>
                  <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }} className="usp-stats-row">
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--usp-navy)' }}>6ms</div>
                          <div className="usp-mono" style={{ color: 'var(--usp-gray)', fontSize: '0.65rem' }}>AVERAGE_SYNC</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--usp-navy)' }}>100%</div>
                          <div className="usp-mono" style={{ color: 'var(--usp-gray)', fontSize: '0.65rem' }}>ISO_COMPLIANCE</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center' }} aria-labelledby="usp-cta-title">
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-3px', color: 'var(--usp-navy)', lineHeight: 1.1 }} id="usp-cta-title">Initialize the <br/>Standard.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', fontSize: '1.25rem', color: 'var(--usp-gray)', fontWeight: 300 }}>
              Connect your professional node to the Scale Protocol and gain access to the world's most efficient high-fidelity distribution network.
          </p>
          <button className="scale-btn-primary" id="usp-btn-cta-handshake" onClick={() => alert('Scale Protocol handshakes active.')}>CONNECT SCALE NODE</button>
      </section>
    </div>
  );
}
