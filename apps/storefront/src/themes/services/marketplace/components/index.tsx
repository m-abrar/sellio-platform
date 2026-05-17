'use client';
import React from 'react';

export const MarketplaceHeader = () => (
    <header className="sm-header">
        <div className="sm-logo">
            Service<span>Connect</span>
        </div>
        <nav className="sm-nav">
            {['Home', 'Categories', 'Providers', 'Pricing', 'Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="sm-nav-link">{link}</a>
            ))}
        </nav>
        <button className="sm-btn sm-btn-primary">Post a Service</button>
    </header>
);

export const SmCategoryCard = ({ title, icon }: any) => (
    <div className="sm-category-card">
        <div className="sm-category-icon">{icon}</div>
        <h5 style={{ fontWeight: 600, margin: 0 }}>{title}</h5>
    </div>
);

export const SmProviderCard = ({ name, title, rating, image }: any) => (
    <div className="sm-provider-card">
        <img src={image} alt={name} className="sm-provider-img" />
        <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h5>
        <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</p>
        <p style={{ color: '#ffc107', fontWeight: 600, marginBottom: '1rem' }}>
            ★ {rating} <span style={{ color: 'var(--sm-text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>(120)</span>
        </p>
        <button className="sm-btn sm-btn-primary hire-btn">Hire Now</button>
    </div>
);

export const MarketplaceFooter = () => (
    <footer className="sm-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <h5 style={{ fontWeight: 800, color: 'var(--sm-primary)', marginBottom: '1rem' }}>Service<span style={{ color: 'var(--sm-secondary)' }}>Connect</span></h5>
                <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Your trusted marketplace for local services. Connecting quality professionals with clients who need them.
                </p>
                <p style={{ color: 'var(--sm-text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>support@serviceconnect.com</p>
            </div>
            <div>
                <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Links</h6>
                <a href="#" className="sm-footer-link">About Us</a>
                <a href="#" className="sm-footer-link">Careers</a>
                <a href="#" className="sm-footer-link">Blog</a>
                <a href="#" className="sm-footer-link">Press</a>
            </div>
            <div>
                <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Providers</h6>
                <a href="#" className="sm-footer-link">Join as Provider</a>
                <a href="#" className="sm-footer-link">Provider Login</a>
                <a href="#" className="sm-footer-link">Pricing Plans</a>
                <a href="#" className="sm-footer-link">Trust & Safety</a>
            </div>
            <div>
                <h6 style={{ fontWeight: 700, marginBottom: '1rem' }}>Support</h6>
                <a href="#" className="sm-footer-link">Help Center</a>
                <a href="#" className="sm-footer-link">Contact Us</a>
                <a href="#" className="sm-footer-link">Privacy Policy</a>
                <a href="#" className="sm-footer-link">Terms of Service</a>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--sm-border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--sm-text-muted)', fontSize: '0.9rem' }}>
            &copy; 2026 ServiceConnect. All rights reserved.
        </div>
    </footer>
);
