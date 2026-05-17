'use client';
import React from 'react';

export const GeneralHeader = () => (
    <header className="cg-header">
        <a href="#" className="cg-logo">
            <span style={{ fontSize: '1.5rem', marginRight: '0.25rem' }}>📦</span>
            CLASAFIND
        </a>
        <div className="cg-search-bar d-none d-md-flex">
            <span style={{ color: 'var(--cg-text-muted)' }}>🔍</span>
            <input type="text" className="cg-search-input" placeholder="Search for anything..." />
        </div>
        <nav className="cg-nav">
            <a href="#" className="cg-nav-link d-none d-md-block">Log In</a>
            <a href="#" className="cg-nav-link d-none d-md-block">Sign Up</a>
            <a href="#" className="cg-btn cg-btn-primary">➕ Post Ad</a>
        </nav>
    </header>
);

export const ListingCard = ({ title, price, image, seller, isSaved }: any) => (
    <div className="cg-card">
        <div className="cg-card-img-wrap">
            <img src={image} className="cg-card-img" alt={title} />
        </div>
        <div className="cg-card-body">
            <h3 className="cg-card-title">{title}</h3>
            <div className="cg-card-price">{price}</div>
            
            <div className="cg-card-footer">
                <div className="cg-seller-info">
                    <div className="cg-seller-avatar">👤</div>
                    {seller}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="cg-action-btn" title="Message Seller">✉️</button>
                    <button className="cg-action-btn" title="Save Item" style={{ color: isSaved ? 'var(--cg-primary)' : 'var(--cg-text-muted)' }}>
                        {isSaved ? '♥' : '♡'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export const GeneralFooter = () => (
    <footer className="cg-footer">
        <div className="cg-footer-links">
            <a href="#" className="cg-footer-link">About Us</a>
            <a href="#" className="cg-footer-link">Help & Support</a>
            <a href="#" className="cg-footer-link">Trust & Safety</a>
            <a href="#" className="cg-footer-link">Terms of Service</a>
            <a href="#" className="cg-footer-link">Privacy Policy</a>
        </div>
        <p style={{ color: 'var(--cg-text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            &copy; 2026 ClasaFind Classifieds. All rights reserved.
        </p>
    </footer>
);
