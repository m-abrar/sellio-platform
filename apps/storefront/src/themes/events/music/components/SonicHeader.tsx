'use client';
import React, { useState } from 'react';

export const SonicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sonic-header">
      <div className="sonic-logo">PULSE</div>
      
      {/* Mobile Hamburger Trigger */}
      <button 
        className={`sonic-hamburger ${isOpen ? 'sonic-hamburger-open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="sonic-hamburger-toggle"
      >
        <span className="sonic-hamburger-bar"></span>
        <span className="sonic-hamburger-bar"></span>
        <span className="sonic-hamburger-bar"></span>
      </button>

      {/* Nav Menu */}
      <nav className={`sonic-nav ${isOpen ? 'sonic-nav-open' : ''}`}>
        {['Home', 'Lineup', 'Tickets', 'Gallery', 'Contact'].map(link => (
          <a 
            key={link} 
            href="#" 
            className="sonic-nav-link"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              if (link === 'Lineup') {
                document.getElementById('sonic-lineup-section')?.scrollIntoView({ behavior: 'smooth' });
              } else if (link === 'Tickets') {
                document.getElementById('sonic-cta-section')?.scrollIntoView({ behavior: 'smooth' });
              } else if (link === 'Gallery') {
                document.getElementById('sonic-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {link}
          </a>
        ))}
        <button 
          className="sonic-btn-primary sonic-mobile-btn" 
          onClick={() => alert('Ticket registration protocol activated.')}
        >
          Buy Tickets
        </button>
      </nav>

      {/* Desktop Header Actions */}
      <div className="sonic-desktop-btn-container">
        <button 
          className="sonic-btn-primary sonic-desktop-btn" 
          onClick={() => alert('Ticket registration protocol activated.')}
          id="sonic-btn-vibe-status"
        >
          Buy Tickets
        </button>
      </div>
    </header>
  );
};

