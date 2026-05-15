
import React from 'react';
import { FestivalCard } from './components';

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
    <div>
      {/* Hero Section */}
      <section className="fest-hero">
          <div className="fest-hero-badge">THE_GLOBAL_COLLECTIVE</div>
          <h1>Neon <br/>Pulse.</h1>
          <p style={{ maxWidth: '600px', fontSize: '1.25rem', opacity: 0.6, lineHeight: 1.8, marginBottom: '4rem' }}>
              The most immersive festival experiences on the planet. Curated, authenticated, and distributed via the Sellio Neon network.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
              <button style={{ padding: '1.5rem 4rem', background: 'white', color: 'black', border: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px' }}>EXPLORE_LINEUP</button>
              <button style={{ padding: '1.5rem 4rem', background: 'none', color: 'white', border: '2px solid white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px' }}>JOIN_THE_PULSE</button>
          </div>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '4rem 10%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111' }}>
          <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--fest-pink)' }}>500k+</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.3, letterSpacing: '2px' }}>GLOBAL_ATTENDEES</div>
          </div>
          <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--fest-purple)' }}>142</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.3, letterSpacing: '2px' }}>FESTIVAL_NODES</div>
          </div>
          <div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--fest-blue)' }}>99%</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, opacity: 0.3, letterSpacing: '2px' }}>VIBE_RATING</div>
          </div>
      </section>

      {/* Festival Grid */}
      <section className="fest-grid">
          {festivals.map((f, i) => (
              <FestivalCard key={i} {...f} />
          ))}
      </section>

      {/* Call to Action */}
      <section style={{ padding: '15rem 10%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, var(--fest-pink) 0%, transparent 80%)', opacity: 0.1 }}></div>
          <div style={{ position: 'relative', zIndex: 10 }}>
              <h2 style={{ fontFamily: 'var(--font-fest)', fontSize: '4rem', fontWeight: 900, marginBottom: '3rem' }}>Ready to <br/>Lose Control?</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.5, maxWidth: '700px', margin: '0 auto 5rem' }}>
                  The 2026/27 season is officially live. Secure your access to the world's most exclusive high-vibe environments.
              </p>
              <button style={{ padding: '2rem 6rem', background: 'var(--fest-pink)', color: 'white', border: 'none', fontWeight: 900, fontSize: '1rem', letterSpacing: '4px' }}>
                  SECURE_TICKETS_NOW
              </button>
          </div>
      </section>
    </div>
  );
}
