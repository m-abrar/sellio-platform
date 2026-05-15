
import React from 'react';

export const NeonFooter = () => (
    <footer className="neon-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-fest)', fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_NEON.</h2>
                <p style={{ color: '#333', lineHeight: 2, fontSize: '1rem' }}>
                    The world's most immersive festival distribution network. High-vibe events, curated for the next generation of attendees.
                </p>
            </div>
            <div>
                <h4>VERTICALS</h4>
                <a href="#" className="neon-footer-link">Music & Audio</a>
                <a href="#" className="neon-footer-link">Tech & Innovation</a>
                <a href="#" className="neon-footer-link">Film & Media</a>
                <a href="#" className="neon-footer-link">Art & Culture</a>
            </div>
            <div>
                <h4>NODES</h4>
                <a href="#" className="neon-footer-link">Berlin</a>
                <a href="#" className="neon-footer-link">Austin</a>
                <a href="#" className="neon-footer-link">Tokyo</a>
                <a href="#" className="neon-footer-link">Amsterdam</a>
            </div>
            <div>
                <h4>PROTOCOL</h4>
                <a href="#" className="neon-footer-link">Tickets</a>
                <a href="#" className="neon-footer-link">Support</a>
                <a href="#" className="neon-footer-link">Privacy</a>
                <a href="#" className="neon-footer-link">Partners</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#222' }}>
            <span>© 2026 SELLIO_NEON_GLOBAL. ALL_VIBES_RESERVED.</span>
            <span style={{ color: 'var(--fest-pink)' }}>STATUS: HIGH_v4.0</span>
        </div>
    </footer>
);
