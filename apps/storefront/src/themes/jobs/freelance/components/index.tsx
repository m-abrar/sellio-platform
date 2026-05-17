'use client';
import React from 'react';

export const FreelanceHeader = () => (
    <header className="jf-header">
        <a href="#" className="jf-logo">
            Gig<span className="jf-text-emerald">Hive</span>
        </a>
        <nav className="jf-nav d-none d-md-flex">
            <a href="#explore" className="jf-nav-link">Explore</a>
            <a href="#how-it-works" className="jf-nav-link">How it Works</a>
            <a href="#pro" className="jf-nav-link">GigHive Pro</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="jf-btn jc-btn-outline" style={{ color: 'var(--jf-text-main)' }}>Sign In</a>
            <a href="#" className="jf-btn jf-btn-primary">Join</a>
        </div>
    </header>
);

export const GigCard = ({ title, name, avatar, image, rating, reviews, price }: any) => (
    <div className="jf-gig-card">
        <img src={image} className="jf-gig-img" alt={title} />
        <div className="jf-gig-body">
            <div className="jf-freelancer-info">
                <img src={avatar} className="jf-avatar" alt={name} />
                <div className="jf-freelancer-name">{name}</div>
            </div>
            <h3 className="jf-gig-title">{title}</h3>
            <div className="jf-gig-rating">
                ★ {rating} <span style={{ color: 'var(--jf-text-muted)', fontWeight: 400 }}>({reviews})</span>
            </div>
            <div className="jf-gig-footer">
                <span style={{ fontSize: '1.25rem', color: '#d1d5db', cursor: 'pointer' }}>♥</span>
                <div className="jf-gig-price">
                    STARTING AT <strong>{price}</strong>
                </div>
            </div>
        </div>
    </div>
);

export const FreelanceFooter = () => (
    <footer className="jf-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jf-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    Gig<span className="jf-text-emerald">Hive</span>
                </a>
                <p style={{ color: 'var(--jf-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Find the perfect freelance services for your business. Fast, secure, and professional.</p>
            </div>
            <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Categories</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Graphics & Design</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Digital Marketing</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Writing & Translation</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Video & Animation</a>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>About</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Careers</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Press & News</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Partnerships</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Help & Support</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Trust & Safety</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Selling on GigHive</a>
                    <a href="#" style={{ color: 'var(--jf-text-muted)', textDecoration: 'none' }}>Buying on GigHive</a>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--jf-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--jf-text-muted)', fontSize: '0.85rem' }}>
            <span>&copy; 2026 GigHive International Ltd.</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <span>🌐 English</span>
                <span>$ USD</span>
            </div>
        </div>
    </footer>
);
