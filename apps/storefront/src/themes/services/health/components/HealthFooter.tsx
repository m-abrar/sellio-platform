
import React from 'react';

export const HealthFooter = () => (
    <footer className="health-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '4rem' }}>
            <div>
                <div className="clinic-logo" style={{ marginBottom: '1.5rem' }}>SELLIO_WELLNESS</div>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.8 }}>
                    Empowering your health journey with direct access to world-class specialists and personalized wellness protocols.
                </p>
                <div style={{ marginTop: '2rem', padding: '1rem', background: '#e0f2f1', borderRadius: '12px', fontSize: '0.8rem', color: '#004d40' }}>
                    <strong>EMERGENCY:</strong> For urgent medical care, please call local emergency services immediately.
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '1.5rem' }}>SPECIALTIES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    <span>Dermatology</span>
                    <span>Psychology</span>
                    <span>Nutrition</span>
                    <span>Cardiology</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '1.5rem' }}>RESOURCES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    <span>Health Blog</span>
                    <span>Video Consults</span>
                    <span>Insurance</span>
                    <span>FAQ</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '1.5rem' }}>LEGAL</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    <span>Privacy Policy</span>
                    <span>Terms of Use</span>
                    <span>HIPAA Compliance</span>
                    <span>Licensing</span>
                </div>
            </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '6rem auto 0 auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af' }}>
            <span>© 2026 SELLIO_WELLNESS_PLATFORM.</span>
            <span>PROTECTING_DATA_INTEGRITY</span>
        </div>
    </footer>
);
