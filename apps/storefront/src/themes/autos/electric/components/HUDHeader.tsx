
import React from 'react';

export const HUDHeader = () => (
    <header className="hud-header">
        <div className="hud-logo">ELECTRA_SYS_v2.0</div>
        <nav className="hud-nav">
            <a href="#" className="hud-nav-link">VIRTUAL_GARAGE</a>
            <a href="#" className="hud-nav-link">ENERGY_NETWORK</a>
            <a href="#" className="hud-nav-link">HUD_CONFIG</a>
            <a href="#" className="hud-nav-link">LOG_ACCESS</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#00E5FF', fontWeight: 800 }}>CORE_TEMP</div>
                <div style={{ fontSize: '14px', fontFamily: 'Orbitron' }}>32.4°C</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#00E5FF', fontWeight: 800 }}>UPLINK</div>
                <div style={{ fontSize: '14px', fontFamily: 'Orbitron' }}>STABLE</div>
            </div>
        </div>
    </header>
);
