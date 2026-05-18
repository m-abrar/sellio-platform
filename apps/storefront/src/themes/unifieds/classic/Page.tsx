'use client';
import React from 'react';
import { HeritageGrid, ChronicleBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="legacy-hero" aria-labelledby="uc-hero-title">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>TRADITION_OF_EXCELLENCE</div>
              <h1 className="uc-heading-xl" id="uc-hero-title">
                The <span className="uc-italic" style={{ color: 'var(--uc-gold)' }}>Heritage</span> of <br/>Distribution.
              </h1>
              <p style={{ maxWidth: '700px', margin: '3rem auto 6rem', fontSize: '1.25rem', color: '#666', lineHeight: 1.8 }}>
                  A high-fidelity foundational node for multi-vertical commerce. Established on the principles of structural integrity and global reliability.
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }} className="uc-hero-buttons">
                  <button className="legacy-btn-primary" id="uc-btn-explore" onClick={() => document.getElementById('uc-heritage-registry')?.scrollIntoView({ behavior: 'smooth' })}>
                    ENTER THE ARCHIVE
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid var(--uc-burgundy)', 
                      padding: '1.5rem 5rem', 
                      fontFamily: 'var(--uc-font-heading)', 
                      fontWeight: 700, 
                      fontSize: '1.1rem', 
                      cursor: 'pointer',
                      color: 'var(--uc-burgundy)',
                      transition: 'all 0.3s ease'
                  }} id="uc-btn-chronicles" onClick={() => alert('Chronicles handbook initialized.')}>
                      READ THE CHRONICLES
                  </button>
              </div>
          </div>
      </section>

      {/* Chronicle Bar */}
      <ChronicleBar />

      {/* Heritage Grid Section */}
      <HeritageGrid />

      {/* Mid-Section: Time-Honored Precision */}
      <section className="uc-precision-grid" aria-labelledby="uc-precision-title">
          <div style={{ position: 'relative' }}>
              <div style={{ height: '700px', background: 'white', border: '1px solid var(--uc-border)', overflow: 'hidden' }}>
                  <img src="/themes/unifieds/classic/1.webp" alt="Historical Architecture Provenance" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '200px', height: '200px', borderBottom: '3px solid var(--uc-gold)', borderLeft: '3px solid var(--uc-gold)' }} className="uc-gold-accent-bracket"></div>
          </div>
          <div>
              <span className="uc-mono" style={{ color: 'var(--uc-gold)' }}>TIME_HONORED_PRECISION</span>
              <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginTop: '2.5rem', marginBottom: '3rem', letterSpacing: '-2px', lineHeight: 1.1 }} id="uc-precision-title">Structural <br/>Elegance.</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  The Legacy Node protocol is built on a foundation of reliability. By blending traditional structural integrity with modern distribution logic, we ensure that your high-fidelity assets remain secure and accessible across the global network.
              </p>
              <div style={{ display: 'flex', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--uc-font-heading)', color: 'var(--uc-burgundy)' }}>30yr+</div>
                      <div className="uc-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>CORE_LOGIC_AGE</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--uc-font-heading)', color: 'var(--uc-burgundy)' }}>100%</div>
                      <div className="uc-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>ASSET_PROVENANCE</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 6%', textAlign: 'center', background: 'var(--uc-cream)' }} aria-labelledby="uc-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginBottom: '4rem', letterSpacing: '-3px', lineHeight: 1.1 }} id="uc-cta-title">Establish Your <br/>Legacy.</h2>
              <p style={{ fontSize: '1.4rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your core node to the Legacy Registry and join the world's most trusted high-fidelity distribution network. Institutional authority, guaranteed.
              </p>
              <button className="legacy-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.35rem' }} id="uc-btn-cta-handshake" onClick={() => alert('Legacy node handshake handshake synchronized.')}>CONNECT LEGACY NODE</button>
          </div>
      </section>
    </div>
  );
}
