
import React from 'react';

export const MapHeader = () => (
    <header className="map-header">
        <div className="map-logo">MAP<span>_</span>NODE</div>
        <nav className="map-nav">
            <a href="#" className="map-nav-link">CARTOGRAPHY</a>
            <a href="#" className="map-nav-link">SPATIAL</a>
            <a href="#" className="map-nav-link">REGISTRY</a>
            <a href="#" className="map-nav-link">NODES</a>
        </nav>
        <button className="map-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.8rem' }}>SEARCH_SPATIAL</button>
    </header>
);
