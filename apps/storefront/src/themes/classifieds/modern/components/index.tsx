'use client';
import React from 'react';

export const ModernHeader = () => (
    <header className="cm-header">
        <a href="#" className="cm-logo">
            Classifieds<span className="cm-text-cyan">.</span>
        </a>
        <nav className="cm-nav">
            <a href="#" className="cm-nav-link d-none d-md-block">Browse</a>
            <a href="#" className="cm-nav-link d-none d-md-block">Messages</a>
            <a href="#" className="cm-nav-link d-none d-md-block">Profile</a>
            <button className="cm-btn cm-btn-primary">Post an Ad</button>
        </nav>
    </header>
);

export const ModernCard = ({ title, price, location, time, image }: any) => (
    <div className="cm-card">
        <div className="cm-card-image-wrap">
            <img src={image} className="cm-card-image" alt={title} />
            <div className="cm-card-overlay">
                <button className="cm-action-btn" title="Quick View">👁️</button>
                <button className="cm-action-btn" title="Like">❤️</button>
                <button className="cm-action-btn" title="Share">🔗</button>
            </div>
        </div>
        <div className="cm-card-body">
            <div className="cm-card-price">{price}</div>
            <h3 className="cm-card-title">{title}</h3>
            <div className="cm-card-footer">
                <span className="cm-card-location">📍 {location}</span>
                <span className="cm-card-time">{time}</span>
            </div>
        </div>
    </div>
);

export const ModernFooter = () => (
    <footer className="cm-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <a href="#" className="cm-logo">
                Classifieds<span className="cm-text-cyan">.</span>
            </a>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#" className="cm-nav-link">Terms</a>
                <a href="#" className="cm-nav-link">Privacy</a>
                <a href="#" className="cm-nav-link">Safety</a>
                <a href="#" className="cm-nav-link">Contact</a>
            </div>
            <div style={{ color: 'var(--cm-text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                &copy; 2026 Classifieds Modern App.
            </div>
        </div>
    </footer>
);
