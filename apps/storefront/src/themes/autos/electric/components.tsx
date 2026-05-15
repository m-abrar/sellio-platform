import React from 'react';

export const HUDHeader = () => (
  <header className="hud-header">
    <div className="hud-logo">ELECTRA-V</div>
    <div className="hud-status">SYSTEM_CHECK: OPTIMAL // ENR: 98%</div>
  </header>
);

export const NeonFooter = () => (
  <footer className="neon-footer">
    <div className="hud-logo" style={{ fontSize: '1rem', marginBottom: '1rem' }}>ELECTRA-V</div>
    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>The future of mobility is silent. The future is electric.</p>
    <div className="footer-tech">ENCRYPTED_EST_2026 // SELLIO_CORE_V4</div>
  </footer>
);

export const VehicleCard = ({ name, range, acceleration, image }: { name: string, range: string, acceleration: string, image: string }) => (
  <div className="vehicle-card-electric">
    <img 
      src={image} 
      alt={name} 
      style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '2rem' }} 
    />
    <h3 className="card-title-hud">{name}</h3>
    <div className="spec-strip">
      <div className="readout-item">
        <span className="readout-value" style={{ fontSize: '1.2rem' }}>{range}</span>
        <span className="readout-label">RANGE_KM</span>
      </div>
      <div className="readout-item">
        <span className="readout-value" style={{ fontSize: '1.2rem' }}>{acceleration}</span>
        <span className="readout-label">0-100_SEC</span>
      </div>
    </div>
  </div>
);
