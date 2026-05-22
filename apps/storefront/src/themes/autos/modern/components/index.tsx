'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Utility helper to preserve active preview theme directories during routing transitions
const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
        const isPreview = window.location.pathname.startsWith('/preview/');
        if (isPreview) {
            return `/preview/autos_modern${path}`;
        }
    }
    return path;
};

export const ModernHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="md-header">
            <Link href={getThemeLink('/')} className="md-logo">
                <span style={{ color: 'var(--md-primary)' }}>⚡</span> MODERN <span style={{ color: 'var(--md-primary)' }}>AUTOS</span>
            </Link>
            
            <button 
                className={`md-hamburger ${isOpen ? 'md-hamburger-open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Navigation"
                id="md-hamburger-toggle"
            >
                <span className="md-hamburger-bar"></span>
                <span className="md-hamburger-bar"></span>
                <span className="md-hamburger-bar"></span>
            </button>

            <nav className={`md-nav ${isOpen ? 'md-nav-open' : ''}`}>
                <Link href={getThemeLink('/')} className="md-nav-link" onClick={() => setIsOpen(false)}>
                    Home
                </Link>
                <Link href={getThemeLink('/explore')} className="md-nav-link" onClick={() => setIsOpen(false)}>
                    Listings
                </Link>
                <a href="#brands" className="md-nav-link" onClick={() => setIsOpen(false)}>
                    Brands
                </a>
                <a href="#compare" className="md-nav-link" onClick={() => setIsOpen(false)}>
                    Compare
                </a>
                <Link href={getThemeLink('/explore')} className="md-btn md-btn-cta" onClick={() => setIsOpen(false)}>
                    Sell Your Car
                </Link>
            </nav>
        </header>
    );
};

export const ModernCarCard = ({ title, desc, price, image, slug }: any) => {
    const detailUrl = slug ? getThemeLink(`/product/${slug}`) : '#';
    return (
        <div className="md-car-card">
            <div style={{ overflow: 'hidden', height: '200px', position: 'relative' }}>
                <img src={image} className="md-car-img" alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="md-car-body">
                <h5 className="md-car-title">{title}</h5>
                <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{desc}</p>
                <h4 className="md-car-price">{price}</h4>
                <Link href={detailUrl} className="md-btn md-btn-cta" style={{ width: '100%', boxSizing: 'border-box' }}>
                    View Details
                </Link>
            </div>
        </div>
    );
};

export const CompareItem = ({ title, stats, price, image, highlight, slug }: any) => {
    const detailUrl = slug ? getThemeLink(`/product/${slug}`) : '#';
    return (
        <div className={`md-compare-item ${highlight ? 'highlight' : ''}`}>
            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '1rem' }}>
                <img src={image} className="md-compare-img" alt={title} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            <h4 className={`md-fw-bold ${highlight ? 'md-text-primary' : ''}`} style={{ marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>{stats} | Price: {price}</p>
            <Link href={detailUrl} className={`md-btn ${highlight ? 'md-btn-cta' : 'md-btn-outline'}`} style={{ 
                color: highlight ? 'white' : 'var(--md-primary)', 
                border: highlight ? 'none' : '2px solid var(--md-primary)',
                display: 'block'
            }}>
                Full Specs
            </Link>
        </div>
    );
};

export const ModernFooter = () => (
    <footer className="md-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <Link href={getThemeLink('/')} className="md-logo" style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--md-primary)' }}>⚡</span> MODERN <span style={{ color: 'var(--md-primary)' }}>AUTOS</span>
                </Link>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>The future of mobility is here. Driven by technology, fueled by vision.</p>
            </div>
            <div>
                <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Company</h5>
                <Link href={getThemeLink('/')} className="md-footer-link">About Us</Link>
                <Link href={getThemeLink('/')} className="md-footer-link">Careers</Link>
                <Link href={getThemeLink('/')} className="md-footer-link">Press</Link>
                <Link href={getThemeLink('/')} className="md-footer-link">Sitemap</Link>
            </div>
            <div>
                <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Support</h5>
                <Link href={getThemeLink('/')} className="md-footer-link">Help Center</Link>
                <Link href={getThemeLink('/')} className="md-footer-link">FAQ</Link>
                <Link href={getThemeLink('/')} className="md-footer-link">Contact Sales</Link>
                <Link href={getThemeLink('/explore')} className="md-footer-link">Vehicle Reviews</Link>
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
