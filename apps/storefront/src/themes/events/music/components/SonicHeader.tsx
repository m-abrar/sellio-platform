'use client';
import React from 'react';

export const SonicHeader = () => (
  <header className="sonic-header">
    <div className="sonic-logo">PULSE</div>
    <nav className="sonic-nav">
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .sonic-nav { display: none !important; }
        }
      ` }} />
      {['Home', 'Lineup', 'Tickets', 'Gallery', 'Contact'].map(link => (
        <a key={link} href="#" className="sonic-nav-link">{link}</a>
      ))}
    </nav>
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <button className="sonic-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.8rem' }}>Buy Tickets</button>
    </div>
  </header>
);
