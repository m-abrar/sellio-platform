import React from 'react';

export const ExperienceMapHeader = () => (
  <header className="experience-map-header">
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: '#581c87' }}>VIBE_LOCATOR</div>
    <div className="experience-search-box">
      <span>Search events in East Village, NY</span>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Tonight</div>
      <div style={{ padding: '0.5rem 1.2rem', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>$ Under $50</div>
      <div style={{ padding: '0.5rem 1.2rem', background: '#db2777', color: 'white', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>Map Hub</div>
    </div>
  </header>
);

export const MapExperienceCard = ({ title, location, price, date, image }: { title: string, location: string, price: string, date: string, image: string }) => (
  <div className="experience-card-compact">
    <div className="experience-thumb">
      <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div className="experience-info">
      <div className="experience-title">{title}</div>
      <div className="experience-meta">{location} • {date}</div>
      <div className="experience-price">{price}</div>
    </div>
  </div>
);

export const GlowMarker = ({ top, left, active }: { top: string, left: string, active?: boolean }) => (
  <div className={`glow-location-marker ${active ? 'pulse-active' : ''}`} style={{ top, left }}></div>
);
