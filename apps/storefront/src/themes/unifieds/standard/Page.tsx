
import React from 'react';
import { ProtocolGrid, EfficiencyBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="scale-hero">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--scale-gray)', letterSpacing: '8px', marginBottom: '2.5rem' }}>MODULAR_DISTRIBUTION_V1</div>
              <h1>The <span>Scale</span> <br/>Protocol.</h1>
              <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--scale-gray)', lineHeight: 1.8 }}>
                  The world's most efficient high-fidelity distribution node. Modular, precise, and engineered for global multi-vertical commerce.
              </p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                  <button className="scale-btn-primary">INITIALIZE_NODE</button>
                  <button style={{ background: 'transparent', border: '1px solid #ddd', padding: '1rem 3rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>VIEW_DOCUMENTATION</button>
              </div>
          </div>
      </section>

      {/* Efficiency Bar */}
      <EfficiencyBar />

      {/* Protocol Grid Section */}
      <section style={{ padding: '4rem 6% 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px' }}>Universal Logic Layers.</h2>
      </section>
      <ProtocolGrid />

      {/* Mid-Section: Geometric Precision */}
      <section style={{ padding: '10rem 6%', background: '#fafafa', borderTop: '1px solid var(--scale-border)', borderBottom: '1px solid var(--scale-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '500px', background: 'white', borderRadius: '12px', border: '1px solid var(--scale-border)', overflow: 'hidden' }}>
                      <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" alt="Hardware Tech" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  </div>
                  <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '60px', height: '60px', borderTop: '2px solid var(--scale-navy)', borderLeft: '2px solid var(--scale-navy)' }}></div>
              </div>
              <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--scale-navy)', letterSpacing: '6px' }}>GEOMETRIC_PRECISION</span>
                  <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px' }}>Modular <br/>Efficiency.</h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--scale-gray)', lineHeight: 2, marginBottom: '4rem' }}>
                      Every node in the Scale Protocol is designed for maximum efficiency. By isolating architectural layers and standardizing data mapping, we achieve a distribution latency that is unmatched in the multi-vertical market.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--scale-navy)' }}>6ms</div>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--scale-gray)', letterSpacing: '2px' }}>AVERAGE_SYNC</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--scale-navy)' }}>100%</div>
                          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--scale-gray)', letterSpacing: '2px' }}>ISO_COMPLIANCE</div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-3px' }}>Initialize the <br/>Standard.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', fontSize: '1.25rem', color: 'var(--scale-gray)' }}>
              Connect your professional node to the Scale Protocol and gain access to the world's most efficient high-fidelity distribution network.
          </p>
          <button className="scale-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }}>CONNECT_SCALE_NODE</button>
      </section>
    </div>
  );
}
