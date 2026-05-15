
import React from 'react';

export const VogueHeader = () => (
    <header className="vogue-header">
        <div className="vogue-logo">ATELIER_SELLIO</div>
        <nav className="vogue-nav">
            <a href="#" className="vogue-nav-link">COLLECTIONS</a>
            <a href="#" className="vogue-nav-link">CAMPAIGNS</a>
            <a href="#" className="vogue-nav-link">ARCHIVE</a>
            <a href="#" className="vogue-nav-link">STORES</a>
        </nav>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <div style={{ position: 'relative' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#1a1a1a', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 900 }}>0</span>
            </div>
        </div>
    </header>
);
