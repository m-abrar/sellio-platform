'use client';
import React from 'react';
import { ArtisanEventCard, PulseHUD } from './components';

export default function Page() {
  const events = [
    { title: "Generative Acoustics", location: "Laboratory Node // SF", date: "SEPTEMBER_18_2026", status: "experimental" },
    { title: "Bio-Synthetic Visions", location: "Warehouse 09 // NYC", date: "OCTOBER_02_2026", status: "synthetic" },
    { title: "Distributed Rave Protocol", location: "Sublevel 4 // BERLIN", date: "OCTOBER_31_2026", status: "active" },
    { title: "Holographic Manifestation", location: "Dome Stage // TOKYO", date: "NOVEMBER_12_2026", status: "experimental" },
    { title: "Neural Synthesis Lab", location: "Basement Node // LONDON", date: "DECEMBER_05_2026", status: "synthetic" },
    { title: "Hyperobject Assembly", location: "Plaza Stage // PARIS", date: "DECEMBER_18_2026", status: "active" },
  ];

  return (
    <div className="events-creative-theme">
      {/* Cinematic Creative Hero */}
      <section className="evc-hero" aria-labelledby="evc-hero-title">
          <div className="evc-hero-glow"></div>
          <div className="evc-label" style={{ marginBottom: '3rem' }}>SYNTHETIC_CULTURE_EXCHANGE // 2026</div>
          <h1 className="evc-heading-xl" id="evc-hero-title">
            Creative <br/>
            <span style={{ color: 'var(--evc-lime)' }}>Pulses.</span>
          </h1>
          <p style={{ maxWidth: '750px', fontSize: '1.4rem', color: 'var(--evc-grey)', lineHeight: 1.8, marginTop: '4rem', fontWeight: 300 }}>
              A curated decentralized architecture for experimental audio-visual modules and algorithmic community assemblies.
          </p>
          <div style={{ marginTop: '6rem' }}>
            <button className="evc-btn-primary" id="evc-btn-explore" onClick={() => document.getElementById('evc-protocols-section')?.scrollIntoView({ behavior: 'smooth' })}>Launch Labs</button>
          </div>
      </section>

      {/* Pulse HUD Grid */}
      <section className="evc-section evc-hud-section" aria-label="Pulse Monitoring Dashboard">
          <PulseHUD label="ACTIVE_RESONANCE_NODES" value="84" />
          <PulseHUD label="TOTAL_MUTED_SATELLITES" value="1,240" />
          <PulseHUD label="FABRICATION_STABILITY" value="99.98%" />
      </section>

      {/* Artisan Registry Section */}
      <section className="evc-section" id="evc-protocols-section" aria-labelledby="evc-protocols-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="evc-label" style={{ marginBottom: '1.5rem' }}>EXPERIMENTAL_EVENT_REGISTRY</div>
                  <h2 className="evc-heading-xl" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }} id="evc-protocols-title">Registry.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--evc-grey)', lineHeight: 1.8 }}>
                  Our unified decentralized distribution node synchronizes experimental availability from the world's most vibrant hubs.
              </div>
          </div>
          
          <div className="evc-artisan-grid">
            {events.map((e, i) => (
              <ArtisanEventCard key={i} {...e} />
            ))}
          </div>
      </section>

      {/* Lab manifesto section */}
      <section className="evc-section" id="evc-lab-section" aria-labelledby="evc-lab-title" style={{ borderTop: '1px solid var(--evc-zinc)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }} className="evc-lab-content">
              <div>
                  <div className="evc-label" style={{ marginBottom: '3rem' }}>LABORATORY_MANIFESTO</div>
                  <h2 className="evc-heading-xl" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', marginBottom: '4rem' }} id="evc-lab-title">Synthetic <br/><span style={{ color: 'var(--evc-lime)' }}>Artistry.</span></h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--evc-grey)', lineHeight: 1.8, marginBottom: '6rem', fontWeight: 300 }}>
                      We operate on the boundary of bio-digital synthesis. Elevating community interactions through raw algorithmic installations and real-time auditory sync.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="evc-lab-capabilities">
                      {['Synthetizers', 'Generators', 'Decentralizers', 'Transmitters'].map(cap => (
                          <div key={cap} style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--evc-lime)', letterSpacing: '2px', fontFamily: 'var(--evc-mono)' }}>◆ {cap.toUpperCase()}</div>
                      ))}
                  </div>
              </div>
              <div style={{ background: '#111', border: '1px solid var(--evc-zinc)', padding: '6rem', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white', letterSpacing: '-1.5px' }}>Node Sync Request</h3>
                  <p style={{ color: 'var(--evc-grey)', lineHeight: 1.8, marginBottom: '4rem' }}>
                      Transmission pathways are currently active for the autumn cluster. Submit your digital signature for synchronized resonance.
                  </p>
                  <button className="evc-btn-primary" style={{ width: '100%', padding: '2rem' }} id="evc-btn-sync" onClick={() => alert('Resonance wave broadcasted successfully.')}>Initiate Synchronous Wave</button>
              </div>
          </div>
      </section>
      
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
