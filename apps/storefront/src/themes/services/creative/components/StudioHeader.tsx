
import React from 'react';

export const StudioHeader = () => (
    <header className="studio-header">
        <div className="studio-logo">THE ATELIER.</div>
        <nav className="studio-nav">
            <a href="#" className="studio-nav-link">COLLECTIONS</a>
            <a href="#" className="studio-nav-link">THE STUDIO</a>
            <a href="#" className="studio-nav-link">ARCHIVE</a>
            <a href="#" className="studio-nav-link">ACCESS</a>
        </nav>
        <div style={{ width: '45px', height: '1px', background: 'var(--atelier-black)' }}></div>
    </header>
);
