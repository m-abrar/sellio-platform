
import React from 'react';

export const PulseFooter = () => (
    <footer className="pulse-footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <div className="rocket-logo" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>SELLIO_LAUNCH</div>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: '400px' }}>
                    Bridging the gap between elite talent and the world's most ambitious tech startups. Join the next generation of builders.
                </p>
                <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="live-pulse"></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '2px' }}>SYSTEM_OPERATIONAL_24/7</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '2rem', letterSpacing: '2px' }}>ROLES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Engineering</span>
                    <span>Product</span>
                    <span>Design</span>
                    <span>Growth</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '2rem', letterSpacing: '2px' }}>STAGES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Seed</span>
                    <span>Series A</span>
                    <span>Series B</span>
                    <span>Unicorn</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, fontSize: '0.8rem', marginBottom: '2rem', letterSpacing: '2px' }}>NETWORK</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>Mentors</span>
                    <span>Investors</span>
                    <span>Perks</span>
                    <span>API</span>
                </div>
            </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '8rem auto 0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#334155' }}>
            <span>© 2026 SELLIO_LAUNCH_LABS.</span>
            <span>UPLINK_v4.2.0_STABLE</span>
        </div>
    </footer>
);
