'use client';
import React from 'react';

export const VoltageFooter = () => (
    <footer className="voltage-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6rem' }}>
            <div>
                <div className="sonic-logo" style={{ fontSize: '3rem', marginBottom: '3rem' }}>PULSE</div>
                <p style={{ color: '#666', lineHeight: 2, fontSize: '0.95rem' }}>
                    The heartbeat of live music. Access the world's most immersive sonic distribution network. Verified high-fidelity experiences.
                </p>
            </div>
            {['RESOURCES', 'COMMUNITY', 'LEGAL'].map(col => (
                <div key={col}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '3rem', color: 'var(--neon-pink)', letterSpacing: '3px' }}>{col}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {['Registry Access', 'Artist Nodes', 'Sonic Manifest', 'Security Protocol'].map(link => (
                            <span key={link} className="footer-link" style={{ cursor: 'pointer' }}>{link}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--sonic-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#444', fontWeight: 900, letterSpacing: '2px' }}>© 2026 PULSE EVENTS // SONIC_REGISTRY_V2</div>
            <div style={{ display: 'flex', gap: '3rem' }}>
                {['INSTAGRAM', 'DISCORD', 'TWITTER'].map(social => (
                    <span key={social} style={{ fontSize: '0.7rem', color: '#444', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer' }}>{social}</span>
                ))}
            </div>
        </div>
    </footer>
);
