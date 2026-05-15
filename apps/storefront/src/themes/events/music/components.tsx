import React from 'react';

export const MusicHeader = () => (
  <header className="music-header">
    <div className="music-logo">VIBE_CORE</div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.8rem', color: 'var(--color-accent)' }}>
      EST. 2026 // LIVE & LOUD
    </div>
  </header>
);

export const ArtistPoster = ({ name, date, image }: { name: string, date: string, image: string }) => (
  <div className="artist-poster">
    <img 
      src={image} 
      alt={name} 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
    <div className="poster-overlay">
      <div className="artist-name">{name}</div>
      <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{date}</div>
    </div>
  </div>
);

export const TicketStrip = () => (
  <div className="ticket-strip">
    <div className="ticket-title">SECURE YOUR PASS</div>
    <button style={{ 
      backgroundColor: 'black', 
      color: 'white', 
      padding: '1rem 3rem', 
      border: 'none', 
      fontFamily: 'var(--font-display)', 
      fontWeight: 900,
      cursor: 'pointer'
    }}>
      GET TICKETS
    </button>
  </div>
);

export const MusicFooter = () => (
  <footer className="music-footer">
    <div className="music-logo" style={{ fontSize: '4rem', marginBottom: '2rem' }}>VIBE_CORE</div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
      <span>INSTAGRAM</span>
      <span>TIKTOK</span>
      <span>SPOTIFY</span>
    </div>
    <p style={{ opacity: 0.5 }}>POWERED BY SELLIO // DESIGN BY NOISE_LAB</p>
  </footer>
);
