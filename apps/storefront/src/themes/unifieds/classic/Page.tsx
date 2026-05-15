
import React from 'react';
import { HeritageGrid, ChronicleBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="legacy-hero">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--legacy-gold)', letterSpacing: '10px', marginBottom: '3rem' }}>TRADITION_OF_EXCELLENCE</div>
              <h1>The <span>Heritage</span> of <br/>Distribution.</h1>
              <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#888', lineHeight: 2 }}>
                  A high-fidelity foundational node for multi-vertical commerce. Established on the principles of structural integrity and global reliability.
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
                  <button className="legacy-btn-primary">ENTER_THE_ARCHIVE</button>
                  <button style={{ background: 'transparent', border: '1px solid #ddd', padding: '1.5rem 5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>READ_THE_CHRONICLES</button>
              </div>
          </div>
      </section>

      {/* Chronicle Bar */}
      <ChronicleBar />

      {/* Heritage Grid Section */}
      <HeritageGrid />

      {/* Mid-Section: Time-Honored Precision */}
      <section style={{ padding: '10rem 6%', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10rem', alignItems: 'center', background: '#fff' }}>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '700px', background: 'white', border: '1px solid var(--legacy-border)', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2094" alt="Historical Architecture" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '200px', height: '200px', borderBottom: '3px solid var(--legacy-gold)', borderLeft: '3px solid var(--legacy-gold)' }}></div>
          </div>
          <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--legacy-gold)', letterSpacing: '6px' }}>TIME_HONORED_PRECISION</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 900, color: 'var(--legacy-burgundy)', marginTop: '2.5rem', marginBottom: '3rem', letterSpacing: '-2px' }}>Structural <br/>Elegance.</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  The Legacy Node protocol is built on a foundation of reliability. By blending traditional structural integrity with modern distribution logic, we ensure that your high-fidelity assets remain secure and accessible across the global network.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--legacy-burgundy)' }}>30yr+</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', letterSpacing: '2px' }}>CORE_LOGIC_AGE</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--legacy-burgundy)' }}>100%</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', letterSpacing: '2px' }}>ASSET_PROVENANCE</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', background: 'var(--legacy-cream)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: 900, color: 'var(--legacy-burgundy)', marginBottom: '4rem', letterSpacing: '-4px' }}>Establish Your <br/>Legacy.</h2>
              <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your core node to the Legacy Registry and join the world's most trusted high-fidelity distribution network. Institutional authority, guaranteed.
              </p>
              <button className="legacy-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.5rem' }}>CONNECT_LEGACY_NODE</button>
          </div>
      </section>
    </div>
  );
}
