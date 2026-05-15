
import React from 'react';

export const ActiveFooter = () => (
    <footer className="active-footer">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--local-orange)' }}>SELLIO_LOCAL.</h2>
                <p style={{ color: '#475569', lineHeight: 2, fontSize: '1rem' }}>
                    Bringing your community closer through high-fidelity distribution of local information. Verified by neighbors, for neighbors.
                </p>
            </div>
            <div>
                <h4>NEIGHBORHOOD</h4>
                <a href="#" className="active-footer-link">Marketplace</a>
                <a href="#" className="active-footer-link">Community Board</a>
                <a href="#" className="active-footer-link">Lost & Found</a>
                <a href="#" className="active-footer-link">Local News</a>
            </div>
            <div>
                <h4>SAFETY</h4>
                <a href="#" className="active-footer-link">Community Rules</a>
                <a href="#" className="active-footer-link">Safety Node</a>
                <a href="#" className="active-footer-link">Report Abuse</a>
            </div>
            <div>
                <h4>CONNECT</h4>
                <a href="#" className="active-footer-link">Local Meetups</a>
                <a href="#" className="active-footer-link">Support Node</a>
                <a href="#" className="active-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155' }}>
            <span>© 2026 SELLIO_COMMUNITY_NETWORK. NEIGHBOR_VERIFIED.</span>
            <span>v.1.0_ACTIVE</span>
        </div>
    </footer>
);
