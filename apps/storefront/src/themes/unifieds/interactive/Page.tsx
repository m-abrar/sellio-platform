
import React from 'react';
import { InteractionCanvas, FluidLogicBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="motion-hero">
          <div className="motion-hero-glow"></div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--motion-yellow)', letterSpacing: '10px', marginBottom: '2.5rem', fontWeight: 700 }}>KINETIC_TRANSMISSION_V4</div>
          <h1>Fluid <br/><span>Dynamics.</span></h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', color: '#666', lineHeight: 1.8, marginBottom: '5rem' }}>
              The high-fidelity interaction node for multi-vertical commerce. Synchronize your digital distribution through fluid logic and kinetic transitions.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
              <button className="motion-btn-primary">INITIALIZE_SYNC</button>
              <button style={{ padding: '1.5rem 4rem', background: 'transparent', color: 'white', border: '1px solid #333', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>READ_THE_DYNAMICS</button>
          </div>
      </section>

      {/* Fluid Bar */}
      <FluidLogicBar />

      {/* Interaction Canvas */}
      <InteractionCanvas />

      {/* Mid-Section: High Velocity */}
      <section style={{ padding: '15rem 6%', background: 'linear-gradient(180deg, #000 0%, #050505 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
              <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, color: 'white', marginBottom: '3rem', letterSpacing: '-3px' }}>The Speed <br/>of Logic.</h2>
                  <p style={{ fontSize: '1.2rem', color: '#444', lineHeight: 2, marginBottom: '4rem' }}>
                      Every interaction is a node. Every motion is a transition. Our high-fidelity protocol ensures that your digital distribution is as fluid as it is performant.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                      {['Real-time Interaction Sync', 'Low-Latency Transitions', 'Dynamic Schema Fluids', 'Kinetic Asset Mapping'].map(item => (
                          <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 800, color: 'var(--motion-indigo)', letterSpacing: '2px' }}>
                              <div style={{ width: '10px', height: '10px', background: 'var(--motion-indigo)' }}></div> {item.toUpperCase()}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ position: 'relative' }}>
                  <div style={{ height: '500px', background: 'var(--motion-card)', borderRadius: '24px', border: '1px solid var(--motion-border)', overflow: 'hidden' }}>
                      <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070" alt="Cyber Tech" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', width: '150px', height: '150px', borderBottom: '2px solid var(--motion-yellow)', borderRight: '2px solid var(--motion-yellow)' }}></div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '1000px', height: '600px', background: 'radial-gradient(circle, var(--motion-yellow) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '7rem', fontWeight: 800, color: 'white', marginBottom: '4rem', letterSpacing: '-4px' }}>Ready to <br/>Transition?</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#444' }}>
              Connect your interaction node to the world's most advanced high-fidelity distribution network. Precision motion, guaranteed.
          </p>
          <button className="motion-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.2rem' }}>CONNECT_MOTION_NODE</button>
      </section>
    </div>
  );
}
