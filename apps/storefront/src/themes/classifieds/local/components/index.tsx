'use client';
import React from 'react';

export const LocalHeader = () => (
    <header className="cl-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#" className="cl-logo">
                <span className="cl-logo-icon">🌿</span> NeighborHood
            </a>
            <div className="cl-location-picker d-none d-md-flex">
                📍 <span>Seattle, WA (within 5 mi)</span>
            </div>
        </div>
        
        <nav className="cl-nav">
            <a href="#" className="cl-nav-link d-none d-lg-block">Activity</a>
            <a href="#" className="cl-nav-link d-none d-lg-block">Messages <span style={{ backgroundColor: 'var(--cl-primary)', color: 'white', borderRadius: '50px', padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>3</span></a>
            <button className="cl-btn-primary">📸 Post Item</button>
        </nav>
    </header>
);

export const LocalCard = ({ title, price, distance, neighborhood, image, sellerInitials }: any) => (
    <div className="cl-card">
        <div className="cl-distance-badge">📍 {distance} mi away</div>
        <img src={image} className="cl-card-img" alt={title} />
        <div className="cl-card-body">
            <h3 className="cl-card-title">{title}</h3>
            <div className="cl-card-price">{price}</div>
            
            <div className="cl-seller-row">
                <div className="cl-seller-info">
                    <div className="cl-avatar">{sellerInitials}</div>
                    <div className="cl-neighborhood">{neighborhood}</div>
                </div>
                <button className="cl-action-btn" title="Message Neighbor">✉️</button>
            </div>
        </div>
    </div>
);

export const LocalFooter = () => (
    <footer className="cl-footer">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            <div style={{ maxWidth: '300px' }}>
                <a href="#" className="cl-logo" style={{ marginBottom: '1rem' }}>
                    <span className="cl-logo-icon">🌿</span> NeighborHood
                </a>
                <p style={{ color: 'var(--cl-text-muted)', fontWeight: 600 }}>Buy, sell, and connect with verified locals in your immediate area. Safe, friendly, and community-driven.</p>
            </div>
            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                <div>
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--cl-secondary)' }}>Community</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <a href="#" style={{ color: 'var(--cl-text-muted)', textDecoration: 'none', fontWeight: 600 }}>Guidelines</a>
                        <a href="#" style={{ color: 'var(--cl-text-muted)', textDecoration: 'none', fontWeight: 600 }}>Trust & Safety</a>
                        <a href="#" style={{ color: 'var(--cl-text-muted)', textDecoration: 'none', fontWeight: 600 }}>Neighborhood Watch</a>
                    </div>
                </div>
                <div>
                    <h4 style={{ fontWeight: 800, marginBottom: '1rem', color: 'var(--cl-secondary)' }}>Categories</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <a href="#" style={{ color: 'var(--cl-text-muted)', textDecoration: 'none', fontWeight: 600 }}>Free Stuff</a>
                        <a href="#" style={{ color: 'var(--cl-text-muted)', textDecoration: 'none', fontWeight: 600 }}>Garage Sales</a>
                        <a href="#" style={{ color: 'var(--cl-text-muted)', textDecoration: 'none', fontWeight: 600 }}>Lost & Found</a>
                    </div>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '2px dashed var(--cl-border)', paddingTop: '1.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--cl-text-muted)' }}>
            &copy; 2026 NeighborHood App. Keeping it local.
        </div>
    </footer>
);
