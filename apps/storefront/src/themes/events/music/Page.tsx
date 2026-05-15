
import React from 'react';
import { LineupGrid, PulseExperience } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="sonic-hero">
          <div className="sonic-hero-glow"></div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--sonic-pink)', letterSpacing: '10px', marginBottom: '2.5rem', fontWeight: 600 }}>TRANSMISSION_ACTIVE</div>
          <h1>Sonic <br/>Pulse.</h1>
          <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem' }}>
              <button className="sonic-btn-primary">GET_TICKETS</button>
              <button style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '1.5rem 5rem', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.2rem', cursor: 'pointer' }}>VIEW_LINEUP</button>
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '3.5rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505', borderTop: '1px solid var(--sonic-border)', borderBottom: '1px solid var(--sonic-border)', color: '#222', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '5px' }}>
          <span>SOUND_PRESSURE: 120DB</span>
          <span>NODAL_SYNC: VERIFIED</span>
          <span>DISTRIBUTION_OPEN</span>
          <span>VOLTAGE: 240V</span>
      </section>

      {/* Lineup Header */}
      <section style={{ padding: '8rem 6% 4rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--sonic-pink)', letterSpacing: '8px' }}>CURATED_LINEUP</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 700, marginTop: '2rem', textTransform: 'uppercase', letterSpacing: '-2px' }}>The Core Artists.</h2>
      </section>

      {/* Lineup Grid */}
      <LineupGrid />

      {/* Experience Section */}
      <PulseExperience />

      {/* Mid-Section Image: The Stage */}
      <section style={{ height: '80vh', position: 'relative', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070" alt="Mainstage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }}></div>
          <div style={{ position: 'absolute', bottom: '10%', left: '6%', zIndex: 2 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-3px' }}>The <br/>Architecture <br/>of Sound.</h2>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '8rem', fontWeight: 700, marginBottom: '4rem', letterSpacing: '-5px', textTransform: 'uppercase' }}>Join the <br/>Pulse.</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#444', lineHeight: 1.8 }}>
              Initialize your access node for the world's most immersive music distribution network. High-fidelity experiences, verified by the sonic registry.
          </p>
          <button className="sonic-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.5rem' }}>CONNECT_NODE</button>
      </section>
    </div>
  );
}
