
import React from 'react';

export const DiamondHeader = () => (
    <header className="diamond-header">
        <div className="diamond-logo">DIAMOND_DRIVE</div>
        <nav className="diamond-nav">
            <a href="#" className="diamond-nav-link">INVENTORY</a>
            <a href="#" className="diamond-nav-link">BESPOKE</a>
            <a href="#" className="diamond-nav-link">TRACK_MODE</a>
            <a href="#" className="diamond-nav-link">LOUNGE</a>
        </nav>
        <button className="drive-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.75rem' }}>
            BOOK_TEST_PILOT
        </button>
    </header>
);
