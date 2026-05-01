import React from 'react';
import './styles.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="unified-modern">
      <header className="modern-header">
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--mod-primary)' }}>SELLIO.MODERN</div>
        <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
          <a href="#">Market</a>
          <a href="#">Stats</a>
          <a href="#">Resources</a>
        </nav>
        <button className="modern-btn">Sign In</button>
      </header>
      <main style={{ padding: '2rem 5%' }}>{children}</main>
    </div>
  );
}
