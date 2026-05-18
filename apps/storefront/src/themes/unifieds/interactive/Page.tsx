'use client';
import React from 'react';
import { InteractionCanvas, FluidLogicBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="motion-hero" aria-labelledby="ui-hero-title">
          <div className="motion-hero-glow"></div>
          <div className="ui-mono" style={{ color: 'var(--ui-yellow)', marginBottom: '2.5rem' }}>KINETIC_TRANSMISSION_V4</div>
          <h1 className="ui-heading-xl" id="ui-hero-title">
            Fluid <br/><span>Dynamics.</span>
          </h1>
          <p style={{ maxWidth: '800px', margin: '3rem auto 5rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
              The high-fidelity interaction node for multi-vertical commerce. Synchronize your digital distribution through fluid logic and kinetic transitions.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }} className="ui-hero-buttons">
              <button className="motion-btn-primary" id="ui-btn-explore" onClick={() => document.getElementById('ui-interactive-canvas-section')?.scrollIntoView({ behavior: 'smooth' })}>
                INITIALIZE SYNC
              </button>
              <button style={{ 
                  padding: '1.5rem 4rem', 
                  background: 'transparent', 
                  color: 'white', 
                  border: '2px solid #333', 
                  fontFamily: 'var(--ui-font-heading)', 
                  fontWeight: 800, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
              }} id="ui-btn-dynamics" onClick={() => alert('Dynamics console initialized.')}>
                  READ THE DYNAMICS
              </button>
          </div>
      </section>

      {/* Fluid Bar */}
      <FluidLogicBar />

      {/* Interaction Canvas */}
      <InteractionCanvas />

      {/* Mid-Section: High Velocity */}
      <section className="ui-velocity-grid" aria-labelledby="ui-velocity-title">
          <div className="ui-velocity-grid-container">
              <div>
                  <h2 style={{ fontFamily: 'var(--ui-font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: 'white', marginBottom: '3rem', letterSpacing: '-3px', lineHeight: 1.1 }} id="ui-velocity-title">The Speed <br/>of Logic.</h2>
                  <p style={{ fontSize: '1.2rem', color: '#888', lineHeight: 2, marginBottom: '4rem' }}>
                      Every interaction is a node. Every motion is a transition. Our high-fidelity protocol ensures that your digital distribution is as fluid as it is performant.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      {['Real-time Interaction Sync', 'Low-Latency Transitions', 'Dynamic Schema Fluids', 'Kinetic Asset Mapping'].map(item => (
                          <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 800, color: 'var(--ui-indigo)', letterSpacing: '2px' }}>
                              <div style={{ width: '10px', height: '10px', background: 'var(--ui-indigo)' }}></div> {item.toUpperCase()}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '500px', background: 'var(--ui-card)', borderRadius: '24px', border: '1px solid var(--ui-border)', overflow: 'hidden' }}>
                      <img src="/themes/unifieds/interactive/1.webp" alt="Cyber Tech Cybernetics" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', width: '150px', height: '150px', borderBottom: '2px solid var(--ui-yellow)', borderRight: '2px solid var(--ui-yellow)' }} className="ui-yellow-accent-bracket"></div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="ui-cta-title">
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--ui-yellow) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontFamily: 'var(--ui-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, color: 'white', marginBottom: '4rem', letterSpacing: '-4px', lineHeight: 1.1 }} id="ui-cta-title">Ready to <br/>Transition?</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
              Connect your interaction node to the world's most advanced high-fidelity distribution network. Precision motion, guaranteed.
          </p>
          <button className="motion-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.2rem' }} id="ui-btn-cta-handshake" onClick={() => alert('Interaction node handshake synchronized.')}>CONNECT MOTION NODE</button>
      </section>
    </div>
  );
}
