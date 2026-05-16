'use client';
import React from 'react';
import { StageLineupCard, AtmosphereHUD } from './components';

export default function Page() {
  const festivals = [
    { title: "Neon Horizon", location: "Berlin Core", date: "AUG_24_2026", image: "https://images.unsplash.com/photo-1514525253361-bee8718a300c?q=80&w=2000" },
    { title: "Cyber Sound", location: "Tokyo Node", date: "SEP_12_2026", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070" },
    { title: "Vortex Summit", location: "Austin Tech", date: "OCT_05_2026", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2074" },
    { title: "Echo Valley", location: "Swiss Alps", date: "DEC_15_2026", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070" },
    { title: "Quantum Art", location: "London East", date: "JAN_20_2027", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070" },
    { title: "Solar Pulse", location: "Ibiza Node", date: "JUL_10_2027", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070" },
  ];

  return (
    <div className="events-festival-theme">
      {/* High-Intensity Pulse Hero */}
      <section className="ef-hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070')" }}>
          <div className="ef-hero-overlay"></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="ef-mono" style={{ marginBottom: '3rem', color: 'white' }}>THE_GLOBAL_COLLECTIVE_V8</div>
              <h1 className="ef-heading-xl">Neon <br/>Pulse.</h1>
              <p style={{ marginTop: '5rem', fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '700px', margin: '5rem auto 0' }}>
                  The most immersive festival experiences on the planet. Curated, authenticated, and distributed via the Sellio Neon network.
              </p>
              <div style={{ marginTop: '7rem', display: 'flex', gap: '3rem', justifyContent: 'center' }}>
                <button className="ef-btn-primary">Explore Lineup</button>
                <button style={{ 
                    background: 'transparent', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: 'white', 
                    padding: '1.5rem 4.5rem', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    cursor: 'pointer',
                    fontFamily: 'var(--ef-alt)',
                    fontSize: '0.8rem',
                    letterSpacing: '3px'
                }}>
                    Join_The_Pulse
                </button>
              </div>
          </div>
      </section>

      {/* Atmosphere HUD Section */}
      <section className="ef-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <AtmosphereHUD label="GLOBAL_ATTENDEES" value="500K+" color="var(--ef-magenta)" />
          <AtmosphereHUD label="FESTIVAL_NODES" value="142" color="var(--ef-purple)" />
          <AtmosphereHUD label="VIBE_RATING" value="99%" color="var(--ef-blue)" />
      </section>

      {/* Stage Registry Section */}
      <section className="ef-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ef-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL_FESTIVAL_REGISTRY</div>
                  <h2 className="ef-heading-xl" style={{ fontSize: '7rem' }}>Neon <br/><span style={{ color: 'var(--ef-magenta)' }}>Stages.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1.1rem', color: 'var(--ef-grey)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes high-vibe environments across the world's most significant neon nodes.
              </div>
          </div>
          
          <div className="ef-festival-grid">
            {festivals.map((f, i) => (
              <StageLineupCard key={i} {...f} />
            ))}
          </div>
      </section>

      {/* Collective CTA Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 8%', background: '#050505', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(217, 70, 239, 0.1) 0%, transparent 80%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="ef-mono" style={{ marginBottom: '4rem' }}>READY_TO_LOSE_CONTROL</div>
              <h2 className="ef-heading-xl" style={{ fontSize: '8rem', marginBottom: '4rem' }}>The <span style={{ color: 'var(--ef-magenta)' }}>Season</span> is Live.</h2>
              <p style={{ maxWidth: '800px', margin: '0 auto 8rem', fontSize: '1.5rem', color: 'var(--ef-grey)', lineHeight: 1.8 }}>
                  The 2026/27 season is officially live. Secure your access to the world's most exclusive high-vibe environments before the node capacity is reached.
              </p>
              <button className="ef-btn-primary" style={{ padding: '2rem 8rem' }}>
                  Secure Tickets Now
              </button>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
