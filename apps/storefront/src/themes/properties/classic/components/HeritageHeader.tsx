
'use client';
import React, { useEffect, useState } from 'react';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`pc-header ${scrolled ? 'scrolled' : ''}`}>
            <div style={{ fontFamily: 'var(--pc-font-serif)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--pc-teal)', letterSpacing: '-1px', cursor: 'pointer' }}>
                ESTATE <span style={{ fontWeight: 400, opacity: scrolled ? 0.3 : 0.6 }}>&</span> HERITAGE
            </div>
            
            <nav className="pc-nav">
                <a href="#" className="pc-nav-link">COLLECTION</a>
                <a href="#" className="pc-nav-link">AGENTS</a>
                <a href="#" className="pc-nav-link">PROVENANCE</a>
                <a href="#" className="pc-nav-link">REGISTRY</a>
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
