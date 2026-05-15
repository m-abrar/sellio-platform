
import React from 'react';

export const LeadershipFooter = () => (
    <footer className="leadership-footer">
        <div className="leadership-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>SELLIO_CAREERS.</h2>
                <p style={{ color: '#94a3b8', lineHeight: 2, fontSize: '0.95rem' }}>
                    Architecting the future of institutional leadership. We do not just fill roles; we build legacies.
                </p>
            </div>
            <div>
                <h4>DEPARTMENTS</h4>
                <a href="#" className="leadership-footer-link">Operations & Logic</a>
                <a href="#" className="leadership-footer-link">Financial Systems</a>
                <a href="#" className="leadership-footer-link">Growth & Strategy</a>
                <a href="#" className="leadership-footer-link">Engineering Core</a>
            </div>
            <div>
                <h4>LOCATIONS</h4>
                <a href="#" className="leadership-footer-link">London Hub</a>
                <a href="#" className="leadership-footer-link">NYC Global</a>
                <a href="#" className="leadership-footer-link">Singapore Node</a>
                <a href="#" className="leadership-footer-link">Remote / Global</a>
            </div>
            <div>
                <h4>PROTOCOL</h4>
                <a href="#" className="leadership-footer-link">Interview Stage</a>
                <a href="#" className="leadership-footer-link">Privacy Policy</a>
                <a href="#" className="leadership-footer-link">Compliance</a>
                <a href="#" className="leadership-footer-link">Diversity</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #1e3a8a', opacity: 0.5, fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 SELLIO_GLOBAL_RECRUITMENT. ALL_RIGHTS_RESERVED.</span>
            <span>EQUAL_OPPORTUNITY_EMPLOYER</span>
        </div>
    </footer>
);
