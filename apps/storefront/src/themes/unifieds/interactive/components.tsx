import React from 'react';

export const InteractiveHeader = () => (
  <header className="interactive-header">
    <div className="interactive-logo">SELLIO_CORE</div>
    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px' }}>
      <span style={{ color: 'var(--color-neon)' }}>LIVE_FEED</span>
      <span style={{ opacity: 0.5 }}>GLOBAL_STATS</span>
    </div>
  </header>
);

export const IndustryOrb = ({ label, icon, count }: { label: string, icon: string, count: string }) => (
  <div className="industry-orb">
    <div className="orb-icon">{icon}</div>
    <div className="orb-label">{label}</div>
    <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem' }}>{count} ACTIVE</div>
  </div>
);

export const StatBlock = ({ value, label }: { value: string, label: string }) => (
  <div className="stat-block">
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

export const PulseFooter = () => (
  <footer className="pulse-footer">
    <div className="interactive-logo" style={{ fontSize: '4rem', opacity: 0.1, marginBottom: '-2rem' }}>SELLIO_CORE</div>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={{ maxWidth: '600px', margin: '0 auto 2rem', opacity: 0.7 }}>
        The multi-platform engine connecting over 50+ industries in a single, high-performance ecosystem.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', fontSize: '0.8rem', fontWeight: 900 }}>
        <span>TWITCH</span>
        <span>DISCORD</span>
        <span>GITHUB</span>
      </div>
    </div>
  </footer>
);
