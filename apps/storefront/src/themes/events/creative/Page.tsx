
import React from 'react';
import { ExperimentalEventCard } from './components';

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
    <div>
      {/* Hero Section */}
      <section className="cyber-hero">
          <div className="cyber-hero-glow"></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--event-lime)', letterSpacing: '4px', marginBottom: '2rem' }}>SYSTEM_STATUS: EXPERIMENTAL</div>
          <h1>Future <br/>Is Now.</h1>
          <p style={{ maxWidth: '700px', fontSize: '1.25rem', color: '#52525b', lineHeight: 1.8, marginBottom: '5rem' }}>
              High-fidelity distribution of experimental event modules. From decentralized hackathons to immersive synthetic art exhibitions.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <button style={{ padding: '1.5rem 4rem', background: 'var(--event-lime)', color: 'black', border: 'none', fontWeight: 900, fontFamily: 'var(--font-space)', fontSize: '0.9rem' }}>INITIALIZE_EXPLORATION</button>
              <button style={{ padding: '1.5rem 4rem', background: 'none', color: 'white', border: '1px solid #27272a', fontWeight: 900, fontFamily: 'var(--font-space)', fontSize: '0.9rem' }}>VIEW_ARCHIVE</button>
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', color: '#27272a', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', borderTop: '1px solid #18181b' }}>
          <span>NODE_SYNC: 100%</span>
          <span>LATENCY: 12ms</span>
          <span>ENCRYPTION: ACTIVE</span>
          <span>VIRTUAL_CAPACITY: ∞</span>
      </section>

      {/* Event Grid */}
      <section className="exp-grid">
          {events.map((e, i) => (
              <ExperimentalEventCard key={i} {...e} />
          ))}
      </section>

      {/* Cyber CTA */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', position: 'relative' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2px' }}>Join the <br/>Experimental <br/>Collective.</h2>
              <p style={{ fontSize: '1.1rem', color: '#52525b', lineHeight: 2, marginBottom: '5rem' }}>
                  Our creative nodes are currently synchronizing for the 2027 cycle. Connect your node to receive early access to experimental protocols.
              </p>
              <button style={{ padding: '2rem 6rem', background: 'var(--event-purple)', color: 'white', border: 'none', fontWeight: 900, fontFamily: 'var(--font-space)', fontSize: '1rem', boxShadow: '0 0 50px rgba(168, 85, 247, 0.3)' }}>
                  SYNC_NODE_ACCESS
              </button>
          </div>
      </section>
    </div>
  );
}
