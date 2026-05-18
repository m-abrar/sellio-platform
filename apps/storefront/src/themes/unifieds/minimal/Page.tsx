'use client';
import React from 'react';
import { MinimalGrid, VoidSyncBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="silent-hero" aria-labelledby="usm-hero-title">
          <div className="usm-mono" style={{ color: '#ccc', marginBottom: '3rem' }}>REDUCTIONIST_NODE_V1</div>
          <h1 className="usm-heading-xl" id="usm-hero-title">
            Pure Focus. <br/><span>Zero Noise.</span>
          </h1>
          <p style={{ maxWidth: '600px', fontSize: '1rem', color: '#888', lineHeight: 2, marginBottom: '6rem', marginTop: '3rem', fontWeight: 300 }}>
              The high-fidelity distribution node for minimalist multi-vertical commerce. Stripped of complexity, engineered for pure performance.
          </p>
          <button className="silent-btn-primary" id="usm-btn-explore" onClick={() => document.getElementById('usm-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
            INITIALIZE VOID
          </button>
      </section>

      {/* Void Sync Bar */}
      <VoidSyncBar />

      {/* Minimal Grid Section */}
      <MinimalGrid />

      {/* Mid-Section: Invisible Logic */}
      <section className="usm-zen-section" aria-labelledby="usm-zen-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <span className="usm-mono" style={{ color: '#ccc' }}>INVISIBLE_LOGIC</span>
              <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 200, marginTop: '2.5rem', marginBottom: '4rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--usm-ink)', lineHeight: 1.1 }} id="usm-zen-title">The Zen of <br/>Distribution.</h2>
              <p style={{ fontSize: '1.1rem', color: '#888', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
                  Every transition in the Silent Edge protocol is designed to be invisible. By removing non-essential telemetry, we achieve a high-fidelity distribution state that allows your assets to exist in their purest form.
              </p>
              <div className="usm-zen-grid">
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--usm-font-heading)', color: 'var(--usm-ink)' }}>0ms</div>
                      <div className="usm-mono" style={{ color: '#ccc', fontSize: '0.65rem' }}>SYNC_DELAY</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--usm-font-heading)', color: 'var(--usm-ink)' }}>100%</div>
                      <div className="usm-mono" style={{ color: '#ccc', fontSize: '0.65rem' }}>PURE_REPRESENTATION</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center' }} aria-labelledby="usm-cta-title">
          <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 200, marginBottom: '5rem', letterSpacing: '10px', textTransform: 'uppercase', color: 'var(--usm-ink)', lineHeight: 1.1 }} id="usm-cta-title">Enter the <br/>Void.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#ccc', fontWeight: 300 }}>
              Connect your core node to the Silent Edge and join the world's most reductionist high-fidelity distribution network.
          </p>
          <button className="silent-btn-primary" style={{ padding: '2rem 10rem', fontSize: '1rem' }} id="usm-btn-cta-handshake" onClick={() => alert('Silent edge node handshake synchronized.')}>CONNECT VOID NODE</button>
      </section>
    </div>
  );
}
