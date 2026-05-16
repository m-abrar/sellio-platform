
'use client';
import React from 'react';
import { PulseExperience } from './components';

export default function Page() {
  const headliners = [
    { name: "DJ NOVA", event: "Sunset EDM Festival", date: "August 25, 2025", image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070" },
    { name: "THE PRODUCER", event: "Main Stage Headliner", date: "July 19, 2025", image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2070" },
    { name: "POP STARLET", event: "The Dome Arena", date: "October 10, 2025", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2070" },
    { name: "ROCK LEGEND", event: "Final Tour Stop", date: "November 30, 2025", image: "https://images.unsplash.com/photo-1521433363963-f58aac2c7b72?q=80&w=2070" },
  ];

  return (
    <div className="sonic-pulse-wrapper">
      {/* Hero Section */}
      <section className="sonic-hero" style={{ background: 'url("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070") center/cover no-repeat' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}></div>
          <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--neon-blue)', letterSpacing: '12px', marginBottom: '2.5rem', fontWeight: 900 }}>PULSE // LIVE TRANSMISSION</div>
              <h1>FEEL THE <br/><span style={{ color: 'var(--neon-pink)' }}>MUSIC LIVE.</span></h1>
              <p style={{ maxWidth: '700px', margin: '4rem auto 0', fontSize: '1.25rem', color: '#ccc', lineHeight: 1.8, fontWeight: 400 }}>
                  Discover elite concerts and underground music festivals across the global sonic network. High-fidelity experiences for the modern listener.
              </p>
              <div style={{ display: 'flex', gap: '3rem', marginTop: '6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="sonic-btn-primary">Get Your Tickets</button>
                  <button style={{ background: 'transparent', border: '2px solid var(--neon-blue)', color: 'white', padding: '1.5rem 5rem', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', borderRadius: '50px', boxShadow: '0 0 20px var(--neon-blue)' }}>Explore Lineup</button>
              </div>
          </div>
      </section>

      {/* Live Metrics Bar */}
      <section style={{ padding: '3rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', borderTop: '1px solid var(--sonic-border)', borderBottom: '1px solid var(--sonic-border)', color: '#444', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '4px' }}>
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
      <section style={{ padding: '12rem 6% 8rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--neon-lime)', letterSpacing: '8px', textTransform: 'uppercase' }}>Elite Headliners</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, marginTop: '2.5rem', textTransform: 'uppercase', letterSpacing: '4px' }}>The Core Lineup.</h2>
      </section>

      <section className="lineup-grid">
          {headliners.map((artist, i) => (
              <div key={i} className="artist-card-premium">
                  <img src={artist.image} alt={artist.name} className="artist-img" />
                  <div className="artist-info">
                      <div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 900, marginBottom: '0.5rem' }}>{artist.event}</div>
                      <div className="artist-name">{artist.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: 800, marginTop: '1rem' }}>{artist.date}</div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}></div>
              </div>
          ))}
      </section>

      {/* Experience Section */}
      <PulseExperience />

      {/* Masonry Gallery */}
      <section style={{ padding: '12rem 6%' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 900, textAlign: 'center', marginBottom: '8rem', textTransform: 'uppercase', color: 'var(--neon-blue)', textShadow: '0 0 20px var(--neon-blue)' }}>Sonic Recaps.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--sonic-border)', transition: 'all 0.3s ease' }}>
                      <img src={`https://picsum.photos/800/1000?random=${i+20}`} alt="Recap" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                  </div>
              ))}
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--neon-pink) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(100px)' }}></div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 8rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 0.9 }}>Join the <br/>Pulse.</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#888', lineHeight: 1.8 }}>
              Initialize your access for the world's most immersive music distribution network. High-fidelity experiences, verified by the PULSE sonic registry.
          </p>
          <button className="sonic-btn-primary" style={{ padding: '2rem 10rem', fontSize: '1.5rem' }}>Reserve Access</button>
      </section>
    </div>
  );
}
