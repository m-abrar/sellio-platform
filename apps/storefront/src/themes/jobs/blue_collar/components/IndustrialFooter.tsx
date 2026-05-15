
import React from 'react';

export const IndustrialFooter = () => (
    <footer className="industrial-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--trade-orange)' }}>SELLIO_INDUSTRIAL.</h2>
                <p style={{ color: '#4b5563', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most reliable trade distribution network. Connecting skilled labor with global industrial nodes.
                </p>
            </div>
            <div>
                <h4>TRADES</h4>
                <a href="#" className="industrial-footer-link">Heavy Machinery</a>
                <a href="#" className="industrial-footer-link">Structural Steel</a>
                <a href="#" className="industrial-footer-link">Precision Tools</a>
                <a href="#" className="industrial-footer-link">Logistics Core</a>
            </div>
            <div>
                <h4>SAFETY</h4>
                <a href="#" className="industrial-footer-link">OSHA Protocol</a>
                <a href="#" className="industrial-footer-link">Training Nodes</a>
                <a href="#" className="industrial-footer-link">Certification</a>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="industrial-footer-link">Union Access</a>
                <a href="#" className="industrial-footer-link">Payroll Hub</a>
                <a href="#" className="industrial-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#374151' }}>
            <span>© 2026 SELLIO_INDUSTRIAL_GROUP. ALL_LABOR_VERIFIED.</span>
            <span>v.99_TOUGH</span>
        </div>
    </footer>
);
