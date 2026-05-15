
import React from 'react';

export const UnifiedHeader = () => (
    <header className="uni-header">
        <div className="uni-header-container">
            <div className="uni-logo">STYLE_TIME</div>
            <nav className="uni-nav">
                <a href="#" className="uni-nav-link">PLATFORM</a>
                <a href="#" className="uni-nav-link">SOLUTIONS</a>
                <a href="#" className="uni-nav-link">RESOURCES</a>
                <a href="#" className="uni-nav-link">CONTACT</a>
            </nav>
            <div>
                <button style={{ 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '12px', 
                    border: 'none', 
                    background: '#1e4d4e', 
                    color: 'white', 
                    fontWeight: 800,
                    fontSize: '0.85rem'
                }}>GET_STARTED</button>
            </div>
        </div>
    </header>
);

export const ServiceCard = ({ title, description, icon }: any) => (
    <div className="uni-card">
        <div className="uni-card-icon">
            {icon}
        </div>
        <h3 className="uni-card-title">{title}</h3>
        <p className="uni-card-text">{description}</p>
    </div>
);

export const UnifiedFooter = () => (
    <footer className="uni-footer">
        <div className="uni-footer-container">
            <div>
                <div className="uni-logo" style={{ color: 'white', marginBottom: '1rem' }}>STYLE_TIME</div>
                <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>The ultimate multi-vertical marketplace engine.</p>
            </div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, marginBottom: '0.5rem' }}>PRODUCTS</span>
                    <a href="#" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Ecommerce</a>
                    <a href="#" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Properties</a>
                    <a href="#" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Automotive</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 800, marginBottom: '0.5rem' }}>SUPPORT</span>
                    <a href="#" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Help Center</a>
                    <a href="#" style={{ opacity: 0.6, fontSize: '0.85rem' }}>API Reference</a>
                    <a href="#" style={{ opacity: 0.6, fontSize: '0.85rem' }}>System Status</a>
                </div>
            </div>
        </div>
    </footer>
);
