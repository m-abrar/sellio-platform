
import React from 'react';

export const NexusPricing = () => (
    <section className="nexus-pricing">
        <h2 style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: 'var(--font-nexus)', marginBottom: '1.5rem' }}>Network Access.</h2>
        <p style={{ color: 'var(--nexus-dim)', marginBottom: '4rem' }}>Scalable infrastructure for businesses of any magnitude.</p>
        
        <div className="pricing-grid">
            <div className="price-card glass-panel">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--nexus-dim)' }}>STARTER_NODE</span>
                <div style={{ fontSize: '3rem', fontWeight: 700, margin: '1.5rem 0' }}>$49<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--nexus-dim)', lineHeight: 2, marginBottom: '3rem' }}>
                    <li>✓ 5 Core Verticals</li>
                    <li>✓ Standard Distribution</li>
                    <li>✓ Community Support</li>
                </ul>
                <button className="nexus-btn-outline" style={{ width: '100%' }}>INITIALIZE</button>
            </div>
            
            <div className="price-card glass-panel featured">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--nexus-cyan)' }}>ELITE_CORE</span>
                <div style={{ fontSize: '3rem', fontWeight: 700, margin: '1.5rem 0' }}>$199<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--nexus-dim)', lineHeight: 2, marginBottom: '3rem' }}>
                    <li>✓ 50 Vertical Themes</li>
                    <li>✓ High-Fidelity Sync</li>
                    <li>✓ Dedicated Node Support</li>
                    <li>✓ Advanced Analytics</li>
                </ul>
                <button className="nexus-btn-primary" style={{ width: '100%' }}>UPGRADE_CORE</button>
            </div>
            
            <div className="price-card glass-panel">
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--nexus-dim)' }}>ENTERPRISE_GRID</span>
                <div style={{ fontSize: '3rem', fontWeight: 700, margin: '1.5rem 0' }}>Custom</div>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--nexus-dim)', lineHeight: 2, marginBottom: '3rem' }}>
                    <li>✓ Unlimited Nodes</li>
                    <li>✓ Custom Design DNA</li>
                    <li>✓ Institutional Integration</li>
                </ul>
                <button className="nexus-btn-outline" style={{ width: '100%' }}>CONTACT_HUB</button>
            </div>
        </div>
    </section>
);
