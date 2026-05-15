
import React from 'react';
import { CoreFeatures, GlobalTrust } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="origin-hero">
          <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--core-azure)', letterSpacing: '6px', marginBottom: '2.5rem', fontWeight: 700 }}>FOUNDATIONAL_DISTRIBUTION_V1</div>
              <h1>The Core of <br/><span>Distribution.</span></h1>
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'var(--core-slate)', lineHeight: 1.8, marginBottom: '5rem' }}>
                  A high-fidelity foundational node for multi-vertical commerce. Standardize your global presence with Sellio's most trusted high-performance engine.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                  <button className="core-btn-primary">GET_STARTED_CORE</button>
                  <button style={{ background: 'transparent', border: '1px solid #ddd', padding: '1.25rem 3.5rem', borderRadius: '12px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>READ_THE_SPEC</button>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '600px', background: '#f0f9ff', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--core-border)' }}>
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015" alt="Analytics" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-3rem', left: '-3rem', padding: '3rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--core-border)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--core-azure)', fontFamily: 'var(--font-heading)' }}>50/50</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--core-slate)', fontWeight: 800, letterSpacing: '2px' }}>VERTICALLY_READY</div>
              </div>
          </div>
      </section>

      {/* Trust Bar */}
      <GlobalTrust />

      {/* Stats Grid */}
      <section style={{ padding: '8rem 6%', display: 'flex', justifyContent: 'center', gap: '10rem' }}>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--font-heading)' }}>99.9%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--core-slate)', fontWeight: 800, letterSpacing: '2px' }}>UPTIME_GUARANTEE</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--font-heading)' }}>1.4M+</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--core-slate)', fontWeight: 800, letterSpacing: '2px' }}>GLOBAL_NODES</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#1e293b', fontFamily: 'var(--font-heading)' }}>8ms</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--core-slate)', fontWeight: 800, letterSpacing: '2px' }}>AVERAGE_LATENCY</div>
          </div>
      </section>

      {/* Features Grid */}
      <CoreFeatures />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid var(--core-border)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '3rem', letterSpacing: '-2px' }}>Scale with the <br/>Foundation.</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--core-slate)', lineHeight: 2, marginBottom: '5rem' }}>
                  Initialize your core node and join the world's most stable high-fidelity distribution network. Institutional grade performance, guaranteed.
              </p>
              <button className="core-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }}>INITIALIZE_CORE_NODE</button>
          </div>
      </section>
    </div>
  );
}
