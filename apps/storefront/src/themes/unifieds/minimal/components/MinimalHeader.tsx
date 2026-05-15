
import React from 'react';

export const MinimalHeader = () => (
    <header className="minimal-header">
        <div className="min-logo">SELLIO_MIN</div>
        <nav className="min-nav">
            <a href="#" className="min-nav-link">OBJECTS</a>
            <a href="#" className="min-nav-link">SPACES</a>
            <a href="#" className="min-nav-link">IDEAS</a>
        </nav>
        <div style={{ fontWeight: 900, fontSize: '0.75rem' }}>CART (0)</div>
    </header>
);
