
import React from 'react';
import { NexusBentoGrid, NexusPricing } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="nexus-hero">
          <div className="nexus-hero-glow"></div>
          <div style={{ fontFamily: 'var(--font-nexus)', fontSize: '0.8rem', color: 'var(--nexus-cyan)', letterSpacing: '5px', marginBottom: '2rem', fontWeight: 700 }}>CORE_V4_PROTOCOL</div>
          <h1>Beyond <br/><span>Standard.</span></h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--nexus-dim)', lineHeight: 1.8, marginBottom: '4rem' }}>
              The high-fidelity distribution node for multi-vertical commerce. Standardize your presence across 50 industries with a single, unified engine.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <button className="nexus-btn-primary">INITIALIZE_NODE</button>
              <button className="nexus-btn-outline">VIEW_ARCHITECTURE</button>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '4rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.5)', borderTop: '1px solid var(--nexus-border)', borderBottom: '1px solid var(--nexus-border)', color: 'var(--nexus-dim)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px' }}>
          <span>1.4M_NODES_ACTIVE</span>
          <span>LATENCY: 8ms</span>
          <span>DISTRIBUTION_READY: TRUE</span>
          <span>ENCRYPTION: AES_256</span>
      </section>

      {/* Bento Section */}
      <NexusBentoGrid />

      {/* Industry Showcase Section */}
      <section style={{ padding: '10rem 6%', background: '#010410' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
              <div>
                  <h2 style={{ fontSize: '4rem', fontWeight: 700, fontFamily: 'var(--font-nexus)', marginBottom: '3rem', letterSpacing: '-2px' }}>The Power <br/>of Fifty.</h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--nexus-dim)', lineHeight: 2, marginBottom: '4rem' }}>
                      Why build fifty themes when you can deploy one engine? Our vertical-specific DNA ensures that every storefront feels bespoke, while sharing the robust high-fidelity logic of the Nexus Prime core.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      {['Dynamic Schema Mapping', 'Real-time Global Sync', 'High-Fidelity UI DNA', 'Institutional Security Nodes'].map(item => (
                          <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 700, color: 'var(--nexus-cyan)' }}>
                              <div style={{ width: '8px', height: '8px', background: 'var(--nexus-cyan)' }}></div> {item.toUpperCase()}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '100px', height: '100px', borderTop: '2px solid var(--nexus-cyan)', borderLeft: '2px solid var(--nexus-cyan)' }}></div>
                  <div style={{ height: '500px', background: 'var(--nexus-card)', borderRadius: '24px', border: '1px solid var(--nexus-border)', overflow: 'hidden' }}>
                      <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" alt="Digital Nexus" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  </div>
              </div>
          </div>
      </section>

      {/* Pricing Section */}
      <NexusPricing />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--nexus-cyan) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontSize: '5rem', fontWeight: 700, fontFamily: 'var(--font-nexus)', marginBottom: '3.5rem', letterSpacing: '-3px' }}>Ready to <br/>synchronize?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--nexus-dim)' }}>
              Initialize your high-fidelity storefront node and join the world's most advanced distribution network.
          </p>
          <button className="nexus-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }}>CONNECT_CORE_NODE</button>
      </section>
    </div>
  );
}
