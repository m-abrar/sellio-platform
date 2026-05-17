
'use client';
import React, { useEffect, useState } from 'react';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`pc-header ${scrolled ? 'scrolled' : ''}`}>
            <div style={{ fontFamily: 'var(--pc-font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--pc-teal)', letterSpacing: '-1px', cursor: 'pointer', zIndex: 1045, position: 'relative' }}>
                ESTATE <span style={{ fontWeight: 400, opacity: scrolled ? 0.3 : 0.6 }}>&</span> HERITAGE
            </div>
            
            <button 
                className={`pc-hamburger ${isOpen ? 'pc-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
                <span className="pc-hamburger-bar"></span>
            </button>

            <nav className={`pc-nav ${isOpen ? 'pc-nav-open' : ''}`}>
                <a href="#" className="pc-nav-link" onClick={() => setIsOpen(false)}>COLLECTION</a>
                <a href="#" className="pc-nav-link" onClick={() => setIsOpen(false)}>AGENTS</a>
                <a href="#" className="pc-nav-link" onClick={() => setIsOpen(false)}>PROVENANCE</a>
                <a href="#" className="pc-nav-link" onClick={() => setIsOpen(false)}>REGISTRY</a>
                
                {/* Mobile version of right-side links */}
                <div className="pc-mobile-header-right" style={{ marginTop: '2rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--pc-teal)', cursor: 'pointer', opacity: 0.8, marginBottom: '1.5rem' }} className="pc-nav-link">
                        LOGIN
                    </div>
                    <button className="pc-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>
                        INQUIRE
                    </button>
                </div>
            </nav>

            <div className="pc-header-right">
                <div style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--pc-teal)', cursor: 'pointer', opacity: 0.6 }} className="pc-nav-link">
                    LOGIN
                </div>
                <button className="pc-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>
                    INQUIRE
                </button>
            </div>
        </header>
    );
};
