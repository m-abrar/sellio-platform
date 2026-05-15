
import React from 'react';

interface CarCardNeoProps {
    name: string;
    price: string;
    range: string;
    accel: string;
    topSpeed: string;
    image: string;
}

export const CarCardNeo = ({ name, price, range, accel, topSpeed, image }: CarCardNeoProps) => (
    <div className="hud-card">
        <span className="hud-card-label">SYS_ID: {name.toUpperCase().replace(/\s+/g, '_')}</span>
        <img src={image} alt={name} className="hud-card-image" />
        <h3 className="hud-card-title">{name}</h3>
        
        <div className="hud-spec-row">
            <span className="hud-spec-label">EST_RANGE</span>
            <span className="hud-spec-value">{range}</span>
        </div>
        <div className="hud-spec-row">
            <span className="hud-spec-label">0_100_KMH</span>
            <span className="hud-spec-value">{accel}</span>
        </div>
        <div className="hud-spec-row">
            <span className="hud-spec-label">V_MAX</span>
            <span className="hud-spec-value">{topSpeed}</span>
        </div>
        <div className="hud-spec-row" style={{ borderBottom: 'none', marginTop: '1rem' }}>
            <span className="hud-spec-label">ACQUISITION_COST</span>
            <span className="hud-spec-value" style={{ color: '#00E5FF', fontSize: '1.2rem' }}>{price}</span>
        </div>

        <button className="hud-btn" style={{ width: '100%', marginTop: '2rem', padding: '1rem' }}>INIT_PURCHASE</button>
    </div>
);
