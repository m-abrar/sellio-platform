
import React from 'react';

export const TenantFooter = () => (
    <footer className="tenant-footer">
        <div className="tenant-footer-grid">
            <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem' }}>SELLIO_RENT.</h2>
                <p style={{ color: '#4b5563', lineHeight: 2, fontSize: '1rem' }}>
                    Streamlining the rental experience through verified distribution and automated leasing protocols.
                </p>
            </div>
            <div>
                <h4>RESOURCES</h4>
                <a href="#" className="tenant-footer-link">Tenant Handbook</a>
                <a href="#" className="tenant-footer-link">Lease Templates</a>
                <a href="#" className="tenant-footer-link">Maintenance Node</a>
                <a href="#" className="tenant-footer-link">Utility Setup</a>
            </div>
            <div>
                <h4>PROPERTY_OWNERS</h4>
                <a href="#" className="tenant-footer-link">List Your Unit</a>
                <a href="#" className="tenant-footer-link">Management Portal</a>
                <a href="#" className="tenant-footer-link">Owner Protocol</a>
                <a href="#" className="tenant-footer-link">Yield Analysis</a>
            </div>
            <div>
                <h4>LEGAL</h4>
                <a href="#" className="tenant-footer-link">Privacy Policy</a>
                <a href="#" className="tenant-footer-link">Terms of Service</a>
                <a href="#" className="tenant-footer-link">Equal Housing</a>
                <a href="#" className="tenant-footer-link">Contact</a>
            </div>
        </div>
        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155' }}>
            <span>© 2026 SELLIO_RENTAL_NETWORK. GLOBAL_RE_v2.0</span>
            <span style={{ color: 'var(--rent-teal)' }}>ACTIVE_NODES: 1,420</span>
        </div>
    </footer>
);
