
'use client';

import React from 'react';

export const MegaHeader = () => (
    <header className="mega-header">
        <div className="mega-top-bar">
            <div className="mega-logo">SELLIO_MEGA</div>
            <div className="mega-search-container">
                <svg style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" className="mega-search-input" placeholder="Search across 4,500+ categories and millions of listings..." />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>SELL_NOW</span>
                <button style={{ 
                    background: '#1e3a8a', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem 1.75rem', 
                    borderRadius: '50px', 
                    fontWeight: 800,
                    fontSize: '0.8rem'
                }}>SIGN_IN</button>
            </div>
        </div>
        <nav className="mega-nav-bar">
            <div className="mega-nav-item">PROPERTIES</div>
            <div className="mega-nav-item">AUTOMOTIVE</div>
            <div className="mega-nav-item">ELECTRONICS</div>
            <div className="mega-nav-item">SERVICES</div>
            <div className="mega-nav-item">CAREERS</div>
            <div className="mega-nav-item">COMMUNITY</div>
        </nav>
    </header>
);
