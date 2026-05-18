'use client';
import React from 'react';
import { NexusBentoGrid, NexusPricing } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="nexus-hero" aria-labelledby="unp-hero-title">
          <div className="nexus-hero-glow"></div>
          <div className="unp-mono" style={{ color: 'var(--unp-cyan)', marginBottom: '2rem' }}>CORE_V4_PROTOCOL</div>
          <h1 className="unp-heading-xl" id="unp-hero-title">
            Beyond <br/><span>Standard.</span>
          </h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--unp-dim)', lineHeight: 1.8, marginBottom: '4rem', marginTop: '2rem' }}>
              The high-fidelity distribution node for multi-vertical commerce. Standardize your presence across 50 industries with a single, unified engine.
          </p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }} className="unp-hero-buttons">
              <button className="nexus-btn-primary" id="unp-btn-explore" onClick={() => document.getElementById('unp-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>
                INITIALIZE NODE
              </button>
              <button className="nexus-btn-outline" id="unp-btn-spec" onClick={() => alert('Nexus Architecture Blueprint initialized.')}>
                VIEW ARCHITECTURE
              </button>
          </div>
      </section>

      {/* Trust Bar */}
      <section className="unp-trust-bar" aria-label="Operational Status Metrics">
          <span>1.4M_NODES_ACTIVE</span>
          <span>LATENCY: 8ms</span>
          <span>DISTRIBUTION_READY: TRUE</span>
          <span>ENCRYPTION: AES_256</span>
      </section>

      {/* Bento Section */}
      <NexusBentoGrid />

      {/* Industry Showcase Section */}
      <section className="unp-showcase-section" aria-labelledby="unp-showcase-title">
          <div className="unp-showcase-grid">
              <div>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', marginBottom: '3rem', letterSpacing: '-2px', color: 'white', lineHeight: 1.1 }} id="unp-showcase-title">The Power <br/>of Fifty.</h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--unp-dim)', lineHeight: 2, marginBottom: '4rem' }}>
                      Why build fifty themes when you can deploy one engine? Our vertical-specific DNA ensures that every storefront feels bespoke, while sharing the robust high-fidelity logic of the Nexus Prime core.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      {['Dynamic Schema Mapping', 'Real-time Global Sync', 'High-Fidelity UI DNA', 'Institutional Security Nodes'].map(item => (
                          <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 700, color: 'var(--unp-cyan)' }}>
                              <div style={{ width: '8px', height: '8px', background: 'var(--unp-cyan)' }}></div> {item.toUpperCase()}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ position: 'relative' }}>
                  <div className="unp-showcase-badge" id="unp-badge-nexus"></div>
                  <div style={{ height: '500px', background: 'var(--unp-card)', borderRadius: '24px', border: '1px solid var(--unp-border)', overflow: 'hidden' }}>
                      <img src="/themes/unifieds/modern/1.webp" alt="Digital Nexus Prime Network Visualizer" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <NexusPricing />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="unp-cta-title">
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--unp-cyan) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 700, fontFamily: 'var(--unp-font-nexus)', marginBottom: '3.5rem', letterSpacing: '-3px', color: 'white', lineHeight: 1.1 }} id="unp-cta-title">Ready to <br/>synchronize?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--unp-dim)', fontWeight: 300 }}>
              Initialize your high-fidelity storefront node and join the world's most advanced distribution network.
          </p>
          <button className="nexus-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }} id="unp-btn-cta-handshake" onClick={() => alert('Nexus core node handshake synchronized.')}>CONNECT CORE NODE</button>
      </section>
    </div>
  );
}
