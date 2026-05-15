
import React from 'react';

export const VerticalFooter = () => (
    <footer className="mega-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: '4rem' }}>
            <div>
                <div className="mega-logo" style={{ marginBottom: '1.5rem' }}>SELLIO_MEGA</div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.8 }}>
                    The engine behind the world's most sophisticated multi-vertical marketplaces. Scale your discovery, secure your transactions.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9' }}></div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9' }}></div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9' }}></div>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1.5rem', color: '#1e3a8a' }}>ECOMMERCE</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Electronics</span>
                    <span>Fashion</span>
                    <span>Home & Garden</span>
                    <span>Sports</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1.5rem', color: '#1e3a8a' }}>PROPERTIES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Residential</span>
                    <span>Commercial</span>
                    <span>Rentals</span>
                    <span>Land</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1.5rem', color: '#1e3a8a' }}>AUTOS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Luxury</span>
                    <span>Used</span>
                    <span>Electric</span>
                    <span>Bikes</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '1.5rem', color: '#1e3a8a' }}>COMPANY</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>About Us</span>
                    <span>Careers</span>
                    <span>Support</span>
                    <span>API</span>
                </div>
            </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '6rem auto 0 auto', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>© 2026 SELLIO_MEGA_ENGINE. ALL RIGHTS RESERVED.</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <span>PRIVACY</span>
                <span>TERMS</span>
                <span>COOKIES</span>
            </div>
        </div>
    </footer>
);
