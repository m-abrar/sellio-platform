
import React from 'react';

export const FutureFooter = () => (
    <footer className="hud-footer">
        <div className="glow-line" style={{ marginBottom: '4rem' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
                <div className="hud-logo" style={{ marginBottom: '1.5rem' }}>ELECTRA_SYS</div>
                <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.8, maxWidth: '300px' }}>
                    Architecting the neural framework for the next generation of zero-emission high-performance vehicles.
                </p>
            </div>
            <div>
                <h4 className="hud-font" style={{ fontSize: '0.8rem', color: '#00E5FF', marginBottom: '1.5rem' }}>INFRASTRUCTURE</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.75rem', color: '#888' }}>
                    <span>Charging Grid</span>
                    <span>Fleet Sync</span>
                    <span>OS Updates</span>
                </div>
            </div>
            <div>
                <h4 className="hud-font" style={{ fontSize: '0.8rem', color: '#00E5FF', marginBottom: '1.5rem' }}>PROTOCOLS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.75rem', color: '#888' }}>
                    <span>Encryption</span>
                    <span>Privacy Node</span>
                    <span>Safety Matrix</span>
                </div>
            </div>
            <div>
                <h4 className="hud-font" style={{ fontSize: '0.8rem', color: '#00E5FF', marginBottom: '1.5rem' }}>COMMAND</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.75rem', color: '#888' }}>
                    <span>Terminal</span>
                    <span>API Access</span>
                    <span>Support Uplink</span>
                </div>
            </div>
        </div>
        <div style={{ marginTop: '6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#444' }}>
            <span>SYSTEM_STAMP: 2026.05.15.HUD</span>
            <span>© ELECTRA_SYS_GLOBAL</span>
        </div>
    </footer>
);
