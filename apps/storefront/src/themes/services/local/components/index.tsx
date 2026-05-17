'use client';
import React from 'react';

export const LocalHeader = () => (
    <header className="local-header">
        <div className="local-logo">
            <span style={{ fontSize: '1.25rem' }}>🔧</span> HomeFix
        </div>
        <nav className="local-nav">
            {['Home', 'Services', 'Categories', 'Pricing', 'Contact'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="local-nav-link">{link}</a>
            ))}
        </nav>
        <button className="local-btn local-btn-primary">Book a Service</button>
    </header>
);

export const LocalServiceCard = ({ title, description, icon }: any) => (
    <div className="local-service-card">
        <div style={{ width: '60px', height: '60px', background: 'var(--local-yellow)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
            {icon}
        </div>
        <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>{title}</h5>
        <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{description}</p>
        <button style={{ background: 'transparent', border: '1px solid var(--local-text-muted)', color: 'var(--local-text-muted)', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>View Details</button>
    </div>
);

export const ProviderCard = ({ name, title, rating, jobs, image }: any) => (
    <div className="local-provider-card">
        <div style={{ position: 'relative' }}>
            <img src={image} alt={name} className="local-provider-img" />
            <div className="local-cta-overlay">
                <button className="local-btn local-btn-primary">Book Now</button>
            </div>
        </div>
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h5 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{name}</h5>
            <p style={{ color: 'var(--local-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{title}</p>
            <div style={{ fontSize: '0.9rem' }}>
                <span style={{ background: 'var(--local-green)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, marginRight: '0.5rem' }}>{rating} ★</span>
                <span style={{ color: 'var(--local-text-muted)' }}>| {jobs} jobs done</span>
            </div>
        </div>
    </div>
);

export const LocalFooter = () => (
    <footer className="local-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <div className="local-logo" style={{ marginBottom: '1rem' }}>🔧 HomeFix</div>
                <p style={{ color: 'var(--local-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Connecting you with trusted local service professionals quickly and safely.
                </p>
            </div>
            <div>
                <h6>Quick Links</h6>
                <a href="#" className="local-footer-link">About Us</a>
                <a href="#" className="local-footer-link">Services</a>
                <a href="#" className="local-footer-link">Careers</a>
                <a href="#" className="local-footer-link">FAQ</a>
            </div>
            <div>
                <h6>For Pros</h6>
                <a href="#" className="local-footer-link">Sign Up</a>
                <a href="#" className="local-footer-link">Provider Login</a>
                <a href="#" className="local-footer-link">Safety Guidelines</a>
            </div>
            <div>
                <h6>Contact Us</h6>
                <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>support@homefix.com</p>
                <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>(555) 123-4567</p>
                <p style={{ color: 'var(--local-text-muted)', fontSize: '0.95rem' }}>123 Service Ave, Local City</p>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--local-border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--local-text-muted)', fontSize: '0.9rem' }}>
            &copy; 2026 HomeFix Local Services. All rights reserved.
        </div>
    </footer>
);
