
import React from 'react';

export const CommunityFooter = () => (
    <footer className="community-footer">
        <div className="community-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_GENERAL.</h2>
                <p style={{ color: '#6b7280', lineHeight: 2, fontSize: '0.9rem' }}>
                    The high-utility distribution node for local and global classifieds. Community-driven, verified by Sellio.
                </p>
            </div>
            <div>
                <h4>MARKETPLACE</h4>
                <a href="#" className="community-footer-link">Electronics</a>
                <a href="#" className="community-footer-link">Home & Garden</a>
                <a href="#" className="community-footer-link">Leisure & Hobbies</a>
                <a href="#" className="community-footer-link">Free Stuff</a>
            </div>
            <div>
                <h4>COMMUNITY</h4>
                <a href="#" className="community-footer-link">Safety Guidelines</a>
                <a href="#" className="community-footer-link">Local Events</a>
                <a href="#" className="community-footer-link">Success Stories</a>
                <a href="#" className="community-footer-link">Feedback</a>
            </div>
            <div>
                <h4>CORPORATE</h4>
                <a href="#" className="community-footer-link">About Us</a>
                <a href="#" className="community-footer-link">Careers</a>
                <a href="#" className="community-footer-link">Press Node</a>
                <a href="#" className="community-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af' }}>
            <span>© 2026 SELLIO_GENERAL_NETWORK. ALL_LISTINGS_VERIFIED.</span>
            <span>v.1.2_STABLE</span>
        </div>
    </footer>
);
