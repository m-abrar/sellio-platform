
'use client';
import React, { useState } from 'react';

export const PlatinumHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="platinum-header">
            <div className="platinum-logo">PLATINUM_ESTATE</div>
            
            <button 
                className={`luxury-hamburger ${isOpen ? 'luxury-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="luxury-hamburger-bar"></span>
                <span className="luxury-hamburger-bar"></span>
                <span className="luxury-hamburger-bar"></span>
            </button>

            <nav className={`platinum-nav ${isOpen ? 'platinum-nav-open' : ''}`}>
                <a href="#" className="platinum-nav-link" onClick={() => setIsOpen(false)}>COLLECTION</a>
                <a href="#" className="platinum-nav-link" onClick={() => setIsOpen(false)}>RESIDENCES</a>
                <a href="#" className="platinum-nav-link" onClick={() => setIsOpen(false)}>OFF-MARKET</a>
                <a href="#" className="platinum-nav-link" onClick={() => setIsOpen(false)}>CONCIERGE</a>
                
                <button className="luxury-mobile-inquire-btn" style={{ 
                    background: 'none', 
                    border: '1px solid #000', 
                    padding: '0.8rem 2.5rem',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '2rem'
                }}>
                    INQUIRE
                </button>
            </nav>
            
            <button className="luxury-desktop-inquire-btn" style={{ 
                background: 'none', 
                border: '1px solid #000', 
                padding: '0.8rem 2.5rem',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
            }}>
                INQUIRE
            </button>
        </header>
    );
};
