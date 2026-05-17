'use client';
import React from 'react';

export const ModernHeader = () => (
    <header className="md-header">
        <a href="#" className="md-logo">
            <span style={{ color: 'var(--md-primary)' }}>⚡</span> MODERN <span style={{ color: 'var(--md-primary)' }}>AUTOS</span>
        </a>
        <nav className="md-nav">
            {['Home', 'Listings', 'Brands', 'Compare', 'Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="md-nav-link">{link}</a>
            ))}
            <a href="#" className="md-btn md-btn-cta">Sell Your Car</a>
        </nav>
    </header>
);

export const ModernCarCard = ({ title, desc, price, image }: any) => (
    <div className="md-car-card">
        <div style={{ overflow: 'hidden', height: '200px' }}>
            <img src={image} className="md-car-img" alt={title} />
        </div>
        <div className="md-car-body">
            <h5 className="md-car-title">{title}</h5>
            <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{desc}</p>
            <h4 className="md-car-price">{price}</h4>
            <a href="#" className="md-btn md-btn-cta" style={{ width: '100%', boxSizing: 'border-box' }}>View Details</a>
        </div>
    </div>
);

export const CompareItem = ({ title, stats, price, image, highlight }: any) => (
    <div className={`md-compare-item ${highlight ? 'highlight' : ''}`}>
        <img src={image} className="md-compare-img" alt={title} />
        <h4 className={`md-fw-bold ${highlight ? 'md-text-primary' : ''}`} style={{ marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>{stats} | Price: {price}</p>
        <a href="#" className={`md-btn ${highlight ? 'md-btn-cta' : 'md-btn-outline'}`} style={{ color: highlight ? 'white' : 'var(--md-primary)', border: highlight ? 'none' : '2px solid var(--md-primary)' }}>Full Specs</a>
    </div>
);

export const ModernFooter = () => (
    <footer className="md-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="md-logo" style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--md-primary)' }}>⚡</span> MODERN <span style={{ color: 'var(--md-primary)' }}>AUTOS</span>
                </a>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>The future of mobility is here. Driven by technology, fueled by vision.</p>
            </div>
            <div>
                <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Company</h5>
                <a href="#" className="md-footer-link">About Us</a>
                <a href="#" className="md-footer-link">Careers</a>
                <a href="#" className="md-footer-link">Press</a>
                <a href="#" className="md-footer-link">Sitemap</a>
            </div>
            <div>
                <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Support</h5>
                <a href="#" className="md-footer-link">Help Center</a>
                <a href="#" className="md-footer-link">FAQ</a>
                <a href="#" className="md-footer-link">Contact Sales</a>
                <a href="#" className="md-footer-link">Vehicle Reviews</a>
            </div>
            <div>
                <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Connect</h5>
                <div>
                    <a href="#" className="md-social">T</a>
                    <a href="#" className="md-social">L</a>
                    <a href="#" className="md-social">F</a>
                    <a href="#" className="md-social">I</a>
                </div>
                <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>&copy; 2026 Modern Autos, Inc. All rights reserved.</p>
            </div>
        </div>
    </footer>
);
