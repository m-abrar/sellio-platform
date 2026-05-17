
'use client';
import React, { useState } from 'react';

export const UrbanHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="urban-header">
            <div className="urban-logo">URBAN<span>_</span>NODE</div>
            
            <button 
                className={`urban-hamburger ${isOpen ? 'urban-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="urban-hamburger-bar"></span>
                <span className="urban-hamburger-bar"></span>
                <span className="urban-hamburger-bar"></span>
            </button>

            <nav className={`urban-nav ${isOpen ? 'urban-nav-open' : ''}`}>
                <a href="#" className="urban-nav-link" onClick={() => setIsOpen(false)}>RESIDENTIAL</a>
                <a href="#" className="urban-nav-link" onClick={() => setIsOpen(false)}>COMMERCIAL</a>
                <a href="#" className="urban-nav-link" onClick={() => setIsOpen(false)}>DISTRICTS</a>
                <a href="#" className="urban-nav-link" onClick={() => setIsOpen(false)}>SKYLINE</a>
                
                <button className="urban-btn-primary urban-mobile-auth-btn" style={{ padding: '1rem 3rem', fontSize: '0.95rem', marginTop: '2rem' }}>
                    EXPLORE_UNITS
                </button>
            </nav>

            <button className="urban-btn-primary urban-desktop-auth-btn" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>
                EXPLORE_UNITS
            </button>
        </header>
    );
};
