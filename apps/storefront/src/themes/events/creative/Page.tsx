'use client';
import React from 'react';
import { ArtisanEventCard, PulseHUD } from './components';

export default function Page() {
  const events = [
    { title: "Hack the Protocol 0.1", location: "Virtual_Node_01", date: "SEPT_15", status: "Active" },
    { title: "Immersive VR Gala", location: "Meta_Sphere_London", date: "OCT_02", status: "Full" },
    { title: "Bio-Digital Summit", location: "Stockholm_Lab", date: "OCT_22", status: "Open" },
    { title: "Synthetic Art Expo", location: "Neo_Tokyo", date: "NOV_05", status: "Open" },
    { title: "AI Music Conclave", location: "Berlin_Central", date: "NOV_20", status: "Draft" },
    { title: "Quantum Logic Workshop", location: "Zurich_Node", date: "DEC_12", status: "Open" },
  ];

  return (
    <div className="events-creative-theme">
      {/* Experimental High-Energy Hero */}
      <section className="ev-hero">
          <div className="ev-hero-glow"></div>
          <div className="ev-label" style={{ marginBottom: '3rem' }}>SYSTEM_STATUS: EXPERIMENTAL_V8_ACTIVE</div>
          <h1 className="ev-heading-xl">
            Future <br/>
            Is <span style={{ color: 'var(--ev-lime)' }}>Now.</span>
          </h1>
          <p style={{ marginTop: '5.5rem', fontSize: '1.5rem', color: 'var(--ev-grey)', lineHeight: 1.8, maxWidth: '800px' }}>
              High-fidelity distribution of experimental event modules. From decentralized hackathons to immersive synthetic art exhibitions.
          </p>
          <div style={{ marginTop: '7rem', display: 'flex', gap: '3rem' }}>
            <button className="ev-btn-primary">Initialize Exploration</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--ev-zinc)', 
                color: 'white', 
                padding: '1.5rem 4.5rem', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontFamily: 'var(--ev-mono)',
                fontSize: '0.8rem',
                letterSpacing: '3px'
            }}>
                View_Archive
            </button>
          </div>
      </section>

      {/* Logic Sync Bar */}
      <div style={{ padding: '4rem 6%', background: '#000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--ev-zinc)', borderBottom: '1px solid var(--ev-zinc)' }}>
          {['NODE_SYNC: 100%', 'LATENCY: 12ms', 'ENCRYPTION: ACTIVE', 'VIRTUAL_CAPACITY: ∞'].map(stat => (
              <div key={stat} className="ev-label" style={{ fontSize: '0.65rem', color: 'var(--ev-grey)' }}>{stat}</div>
          ))}
      </div>

      {/* Pulse HUD Section */}
      <section className="ev-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
          <PulseHUD label="CREATIVE_NODES" value="256" />
          <PulseHUD label="ACTIVE_EXPERIMENTS" value="84" />
          <PulseHUD label="PULSE_STABILITY" value="99%" />
          <PulseHUD label="GLOBAL_SYNC" value="STABLE" />
      </section>

      {/* Artisan Registry Section */}
      <section className="ev-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ev-label" style={{ marginBottom: '1.5rem' }}>EXPERIMENTAL_EVENT_REGISTRY</div>
                  <h2 className="ev-heading-xl" style={{ fontSize: '7rem' }}>The <span style={{ color: 'var(--ev-lime)' }}>Pulse.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1.1rem', color: 'var(--ev-grey)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes experimental event availability across the world's most significant creative nodes.
              </div>
          </div>
          
          <div className="ev-artisan-grid">
            {events.map((e, i) => (
              <ArtisanEventCard key={i} {...e} />
            ))}
          </div>
      </section>

      {/* Experimental Collective Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 8%', background: 'linear-gradient(to bottom, #111, #000)', border: '1px solid var(--ev-zinc)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.05) 0%, transparent 80%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="ev-label" style={{ marginBottom: '4rem' }}>JOIN_THE_EXPERIMENTAL_COLLECTIVE</div>
              <h2 className="ev-heading-xl" style={{ fontSize: '8rem', marginBottom: '4rem' }}>Synchronize <br/>Your <span style={{ color: 'var(--ev-lime)' }}>Node.</span></h2>
              <p style={{ maxWidth: '800px', margin: '0 auto 8rem', fontSize: '1.5rem', color: 'var(--ev-grey)', lineHeight: 1.8 }}>
                  Our creative nodes are currently synchronizing for the 2027 cycle. Connect your node to receive early access to experimental protocols.
              </p>
              <button className="ev-btn-primary" style={{ background: 'var(--ev-violet)', color: 'white', border: 'none' }}>
                  SYNC_NODE_ACCESS
              </button>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
