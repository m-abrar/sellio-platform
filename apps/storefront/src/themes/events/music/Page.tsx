
import React from 'react';
import { ArtistPoster } from './components';

export default function Page() {
  const lineup = [
    { name: "Neon Phantom", date: "AUG 14 // MAIN STAGE", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070" },
    { name: "Solaris Rift", date: "AUG 14 // THE BUNKER", image: "https://images.unsplash.com/photo-1514525253361-bee8d48700df?q=80&w=2000" },
    { name: "Void Echo", date: "AUG 15 // MAIN STAGE", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000" },
    { name: "Cyber Pulse", date: "AUG 15 // ELECTRIC FIELD", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2000" },
    { name: "The Abyss", date: "AUG 16 // THE BUNKER", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000" },
    { name: "Binary Star", date: "AUG 16 // MAIN STAGE", image: "https://images.unsplash.com/photo-1459749411177-042180ce6742?q=80&w=2000" },
    { name: "Neural Drift", date: "AUG 17 // ELECTRIC FIELD", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2000" },
    { name: "Final Wave", date: "AUG 17 // MAIN STAGE", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000" },
  ];

  return (
    <div>
      {/* Hero Poster */}
      <section className="music-hero">
        <img 
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2074" 
            alt="Festival Crowd" 
            className="music-hero-video"
        />
        <div className="music-hero-content">
            <p style={{ fontWeight: 800, letterSpacing: '8px', color: '#ff3e00', marginBottom: '1.5rem' }}>SUMMER_SOLSTICE_2026</p>
            <h1 className="music-hero-title">SOUND_ <br/>BARRIER.</h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '3rem', maxWidth: '800px', marginInline: 'auto' }}>
                Four days of auditory evolution. Experience the world's most innovative electronic artists across five immersive stages.
            </p>
            <button className="music-btn">SECURE_PASS_NOW</button>
        </div>
      </section>

      {/* Lineup Grid */}
      <section className="music-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8rem' }}>
            <h2 className="music-section-title">The_Lineup</h2>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <span style={{ fontWeight: 900, borderBottom: '4px solid #ff3e00', paddingBottom: '8px' }}>ALL_DAYS</span>
                <span style={{ fontWeight: 900, opacity: 0.3 }}>AUG_14</span>
                <span style={{ fontWeight: 900, opacity: 0.3 }}>AUG_15</span>
                <span style={{ fontWeight: 900, opacity: 0.3 }}>AUG_16</span>
            </div>
        </div>
        
        <div className="music-lineup-grid">
            {lineup.map((artist, i) => (
                <ArtistPoster key={i} {...artist} />
            ))}
        </div>
      </section>

      {/* Ticket Tiers */}
      <section style={{ padding: '10rem 4rem', background: '#111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="music-section-title" style={{ textAlign: 'center' }}>Tiered_Access</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                <div style={{ background: '#000', padding: '4rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>STANDARD</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem', fontSize: '0.85rem' }}>General admission to all stages for 4 days. Includes free hydration stations.</p>
                    <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '3rem' }}>$199</div>
                    <button className="music-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.8rem' }}>SELECT_PASS</button>
                </div>
                <div style={{ background: '#1a1a1a', padding: '4rem', border: '2px solid #ff3e00', borderRadius: '4px', transform: 'scale(1.05)' }}>
                    <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#ff3e00', padding: '0.5rem 1.5rem', fontSize: '0.7rem', fontWeight: 900 }}>MOST_POPULAR</div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>PREMIUM</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem', fontSize: '0.85rem' }}>Priority entry, dedicated restrooms, and exclusive access to the 'Bunker' mezzanine.</p>
                    <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '3rem' }}>$349</div>
                    <button className="music-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.8rem' }}>SELECT_PASS</button>
                </div>
                <div style={{ background: '#000', padding: '4rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <h3 style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>ELITE</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3rem', fontSize: '0.85rem' }}>All-access backstage pass, private lounge, premium bar, and artist meet-and-greets.</p>
                    <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '3rem' }}>$899</div>
                    <button className="music-btn" style={{ width: '100%', padding: '1rem', fontSize: '0.8rem' }}>SELECT_PASS</button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
