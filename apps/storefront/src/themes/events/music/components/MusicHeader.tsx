
import React from 'react';

export const MusicHeader = () => (
    <header className="music-header">
        <div className="music-logo">SELLIO_SOUND.</div>
        <nav className="music-nav">
            <a href="#" className="music-nav-link">FESTIVALS</a>
            <a href="#" className="music-nav-link">ARTISTS</a>
            <a href="#" className="music-nav-link">TICKETS</a>
            <a href="#" className="music-nav-link">EXPERIENCES</a>
        </nav>
        <button style={{ 
            background: 'white', 
            color: 'black', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '100px', 
            fontWeight: 900,
            fontSize: '0.7rem',
            letterSpacing: '1px'
        }}>GET_ACCESS</button>
    </header>
);
