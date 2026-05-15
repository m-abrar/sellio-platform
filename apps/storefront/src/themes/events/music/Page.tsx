import React from 'react';
import { ArtistPoster, TicketStrip } from './components';

export default function MusicPage() {
  const lineup = [
    { name: "Neon Paradox", date: "AUG 14", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070" },
    { name: "The Void", date: "AUG 15", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2070" },
    { name: "Digital Ghost", date: "AUG 16", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070" },
    { name: "Sonic Bloom", date: "AUG 17", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070" },
    { name: "Sub_Zero", date: "AUG 18", image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a9?q=80&w=2070" },
    { name: "Pulse Wave", date: "AUG 19", image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="music-hero">
        <img 
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070" 
          alt="Concert Crowd" 
          className="music-hero-bg"
        />
        <h1 className="music-hero-title">
          Summer<br/>
          Heat<br/>
          <span style={{ color: 'var(--color-accent)' }}>Live</span>
        </h1>
      </section>

      <section style={{ padding: '6rem 3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, marginBottom: '4rem' }}>
          THE LINEUP
        </h2>
        <div className="poster-grid">
          {lineup.map((artist, i) => (
            <ArtistPoster key={i} {...artist} />
          ))}
        </div>
      </section>

      <TicketStrip />

      <section style={{ padding: '6rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem' }}>
            THE VENUE
          </h3>
          <p style={{ opacity: 0.7, lineHeight: '1.8' }}>
            Located in the heart of the arts district, The Underground features state-of-the-art acoustics, immersive 360-degree LED walls, and a multi-sensory light show that redefines the live experience.
          </p>
        </div>
        <div style={{ border: '4px solid white', padding: '2rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem' }}>
            DOORS OPEN
          </h4>
          <p style={{ fontSize: '3rem', fontWeight: 900 }}>19:00</p>
          <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>CURFEW 02:00</p>
        </div>
      </section>
    </div>
  );
}
