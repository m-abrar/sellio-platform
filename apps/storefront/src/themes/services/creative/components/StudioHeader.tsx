
import React from 'react';

export const StudioHeader = () => (
    <header className="studio-header">
        <div className="studio-logo">SELLIO_STUDIO.</div>
        <nav className="studio-nav">
            <a href="#" className="studio-nav-link">CRAFT</a>
            <a href="#" className="studio-nav-link">COLLECTIVE</a>
            <a href="#" className="studio-nav-link">ARCHIVE</a>
            <a href="#" className="studio-nav-link">INQUIRY</a>
        </nav>
        <div style={{ width: '40px', height: '40px', background: 'var(--create-indigo)', borderRadius: '50%' }}></div>
    </header>
);
