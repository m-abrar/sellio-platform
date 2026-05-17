
'use client';
import React, { useState } from 'react';

export const CorporateHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="corp-header">
            <div className="corp-logo">SELLIO_COMMERCIAL.</div>
            
            <button 
                className={`corp-hamburger ${isOpen ? 'corp-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
            >
                <span className="corp-hamburger-bar"></span>
                <span className="corp-hamburger-bar"></span>
                <span className="corp-hamburger-bar"></span>
            </button>

            <nav className={`corp-nav ${isOpen ? 'corp-nav-open' : ''}`}>
                <a href="#" className="corp-nav-link" onClick={() => setIsOpen(false)}>PORTFOLIO</a>
                <a href="#" className="corp-nav-link" onClick={() => setIsOpen(false)}>ACQUISITIONS</a>
                <a href="#" className="corp-nav-link" onClick={() => setIsOpen(false)}>VALUATION</a>
                <a href="#" className="corp-nav-link" onClick={() => setIsOpen(false)}>ADVISORY</a>
                
                {/* Mobile version of Client Login button */}
                <button className="corp-mobile-login-btn" style={{ 
                    background: 'var(--comm-primary)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem 2rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginTop: '2rem'
                }}>
                    CLIENT_LOGIN
                </button>
            </nav>
            
            <button className="corp-desktop-login-btn" style={{ 
                background: 'var(--comm-primary)', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 2rem',
                fontSize: '0.8rem',
                fontWeight: 700
            }}>
                CLIENT_LOGIN
            </button>
        </header>
    );
};
