
import React from 'react';

export const ZenFooter = () => (
    <footer className="zen-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10rem' }}>
            <div>
                <div className="silent-logo" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>SILENT.</div>
                <p style={{ color: '#ccc', lineHeight: 2, fontSize: '0.85rem', fontWeight: 300, letterSpacing: '1px' }}>
                    The world's most reductionist high-fidelity distribution node. Zero noise, pure focus.
                </p>
            </div>
            <div>
                <h4>PURE</h4>
                <a href="#" className="footer-link">Void Logic</a>
                <a href="#" className="footer-link">Zero Sync</a>
                <a href="#" className="footer-link">Silent Hub</a>
            </div>
            <div>
                <h4>SYSTEMS</h4>
                <a href="#" className="footer-link">Axis Node</a>
                <a href="#" className="footer-link">Distribution</a>
            </div>
            <div>
                <h4>NETWORK</h4>
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">Registry</a>
            </div>
        </div>
        <div style={{ marginTop: '8rem', paddingTop: '4rem', borderTop: '1px solid var(--minimal-border)', display: 'flex', justifyContent: 'center', fontSize: '0.65rem', color: '#eee', fontWeight: 300, letterSpacing: '10px' }}>
            © 2026 SILENT_EDGE_SYSTEMS. PURE_AND_SIMPLE.
        </div>
    </footer>
);
