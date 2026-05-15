
import React from 'react';
import { OpportunityGrid, MissionControlSection } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="growth-hero">
          <div className="growth-hero-glow"></div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--growth-neon)', letterSpacing: '8px', marginBottom: '2.5rem', fontWeight: 700 }}>SYNCHRONIZE_TALENT_V4</div>
          <h1>Join the <br/><span>Hypergrowth.</span></h1>
          <p style={{ maxWidth: '800px', fontSize: '1.25rem', color: 'var(--growth-dim)', lineHeight: 1.8, marginBottom: '5rem' }}>
              The high-fidelity distribution node for venture-backed talent. Connect your career node to the world's most innovative startup network.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <button className="growth-btn-primary">EXPLORE_VENTURES</button>
              <button className="growth-btn-outline">VENTURE_CAPITAL_ACCESS</button>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '4rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid var(--growth-border)', borderBottom: '1px solid var(--growth-border)', color: 'var(--growth-dim)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px' }}>
          <span>VENTURE_FUNDING_SYNC: ACTIVE</span>
          <span>LATENCY: 12ms</span>
          <span>EQUITY_VERIFIED: TRUE</span>
          <span>NETWORK_NODE: 4.2_ELITE</span>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '6rem 6%', display: 'flex', justifyContent: 'center', gap: '8rem' }}>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>450+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>VERIFIED_STARTUPS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>$1.2B+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>TOTAL_EQUITY_VALUE</div>
          </div>
          <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)' }}>12k+</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--growth-dim)', fontWeight: 800, letterSpacing: '2px', marginTop: '0.5rem' }}>NODAL_CONNECTIONS</div>
          </div>
      </section>

      {/* Opportunity Grid */}
      <OpportunityGrid />

      {/* Mission Control */}
      <MissionControlSection />

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--growth-purple) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontSize: '6rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '3.5rem', letterSpacing: '-4px', color: 'white' }}>Accelerate <br/>Your Future.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: 'var(--growth-dim)' }}>
              Initialize your professional growth node and gain access to high-fidelity equity structures and mission-critical roles.
          </p>
          <button className="growth-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.1rem' }}>INITIALIZE_GROWTH_NODE</button>
      </section>
    </div>
  );
}
