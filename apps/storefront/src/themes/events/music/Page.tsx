'use client';
import React from 'react';
import { PulseExperience, LineupGrid } from './components';

export default function Page() {
  const headliners = [
    { name: "DJ NOVA", event: "Sunset EDM Festival", date: "August 25, 2026", image: "/themes/events/music/11.webp" },
    { name: "THE PRODUCER", event: "Main Stage Headliner", date: "July 19, 2026", image: "/themes/events/music/12.webp" },
    { name: "POP STARLET", event: "The Dome Arena", date: "October 10, 2026", image: "/themes/events/music/13.webp" },
    { name: "ROCK LEGEND", event: "Final Tour Stop", date: "November 30, 2026", image: "/themes/events/music/14.webp" },
  ];

  return (
    <div className="sonic-pulse-wrapper">
      {/* Hero Section */}
      <section className="sonic-hero" style={{ background: 'url("/themes/events/music/10.webp") center/cover no-repeat' }} aria-labelledby="sonic-hero-title">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--neon-blue)', letterSpacing: '12px', marginBottom: '2.5rem', fontWeight: 900 }}>PULSE // LIVE TRANSMISSION</div>
              <h1 id="sonic-hero-title">FEEL THE <br/><span style={{ color: 'var(--neon-pink)' }}>MUSIC LIVE.</span></h1>
              <p style={{ maxWidth: '700px', margin: '4rem auto 0', fontSize: '1.25rem', color: '#ccc', lineHeight: 1.8, fontWeight: 400 }}>
                  Discover elite concerts and underground music festivals across the global sonic network. High-fidelity experiences for the modern listener.
              </p>
              <div style={{ display: 'flex', gap: '3rem', marginTop: '6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="sonic-btn-primary" onClick={() => document.getElementById('sonic-cta-section')?.scrollIntoView({ behavior: 'smooth' })}>Get Your Tickets</button>
                  <button 
                    style={{ background: 'transparent', border: '2px solid var(--neon-blue)', color: 'white', padding: '1.5rem 5rem', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', borderRadius: '50px', boxShadow: '0 0 20px var(--neon-blue)', transition: 'all 0.3s ease' }}
                    onClick={() => document.getElementById('sonic-lineup-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Lineup
                  </button>
              </div>
          </div>
      </section>

      {/* Live Metrics Bar */}
      <section style={{ padding: '3rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderTop: '1px solid var(--sonic-border)', borderBottom: '1px solid var(--sonic-border)', color: '#444', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '4px' }} aria-label="System Metrics">
          <style dangerouslySetInnerHTML={{ __html: `
            @media (max-width: 1024px) {
                .jt-metrics { display: none !important; }
            }
          ` }} />
          <div className="jt-metrics" style={{ display: 'flex', gap: '4rem' }}>
              <span>SYSTEM: OPTIMIZED</span>
              <span>AUDIO: 120DB LIMIT</span>
              <span>SYNC: VERIFIED</span>
          </div>
          <div style={{ color: 'var(--neon-lime)' }}>BPM TRACKER: 128 (HOUSE)</div>
      </section>

      {/* Featured Lineup Section */}
      <section style={{ padding: '12rem 6% 4rem', textAlign: 'center' }} id="sonic-lineup-section" aria-labelledby="sonic-lineup-title">
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--neon-lime)', letterSpacing: '8px', textTransform: 'uppercase' }}>Elite Headliners</span>
          <h2 id="sonic-lineup-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, marginTop: '2.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>The Core Lineup.</h2>
      </section>

      <section style={{ padding: '0 6% 8rem' }}>
          <div className="lineup-grid" style={{ padding: 0 }}>
              {headliners.map((artist, i) => (
                  <div key={i} className="artist-card-premium" onClick={() => alert(`Securing pass for headliner: ${artist.name}`)}>
                      <img src={artist.image} alt={artist.name} className="artist-img" />
                      <div className="artist-info">
                          <div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 900, marginBottom: '0.5rem' }}>{artist.event}</div>
                          <div className="artist-name">{artist.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: 800, marginTop: '1rem' }}>{artist.date}</div>
                      </div>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}></div>
                  </div>
              ))}
          </div>
      </section>

      {/* Modular Lineup Grid (Underground Artists) */}
      <section style={{ padding: '4rem 6% 8rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--neon-blue)', letterSpacing: '8px', textTransform: 'uppercase' }}>Underground Nodes</span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 900, marginTop: '2rem', textTransform: 'uppercase', letterSpacing: '4px' }}>Sonic Support.</h3>
      </section>
      <LineupGrid />

      {/* Experience Section */}
      <PulseExperience />

      {/* Masonry Gallery */}
      <section style={{ padding: '12rem 6%' }} id="sonic-gallery-section" aria-labelledby="sonic-gallery-title">
          <h2 id="sonic-gallery-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, textAlign: 'center', marginBottom: '8rem', textTransform: 'uppercase', color: 'var(--neon-blue)', textShadow: '0 0 20px var(--neon-blue)' }}>Sonic Recaps.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {[16, 17, 18, 19, 20, 21].map((imgNum, idx) => (
                  <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--sonic-border)', transition: 'all 0.3s ease' }}>
                      <img src={`/themes/events/music/${imgNum}.webp`} alt={`Sonic Recap ${idx + 1}`} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                  </div>
              ))}
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }} id="sonic-cta-section" aria-labelledby="sonic-cta-title">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--neon-pink) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)' }}></div>
          <h2 id="sonic-cta-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 0.9 }}>Join the <br/>Pulse.</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
              Initialize your access for the world's most immersive music distribution network. High-fidelity experiences, verified by the PULSE sonic registry.
          </p>
          <button className="sonic-btn-primary" style={{ padding: '2rem 10rem', fontSize: '1.5rem' }} onClick={() => alert('Access registration protocol activated.')}>Reserve Access</button>
      </section>
    </div>
  );
}
