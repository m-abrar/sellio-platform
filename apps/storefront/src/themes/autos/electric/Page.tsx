import React from 'react';
import { VehicleCard } from './components';

export default function ElectricPage() {
  const vehicles = [
    { name: "NEURON_S", range: "640", acceleration: "2.1", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071" },
    { name: "PULSE_GT", range: "520", acceleration: "3.4", image: "https://images.unsplash.com/photo-1617788131775-ceb2027fd12c?q=80&w=2070" },
    { name: "VORTEX_X", range: "800", acceleration: "4.2", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070" },
    { name: "ZENITH_EV", range: "450", acceleration: "5.8", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="electric-hero">
        <img 
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2070" 
          alt="Main EV" 
          className="electric-hero-image"
        />
        <div className="hero-readout">
          <div className="readout-item">
            <span className="readout-value">0%</span>
            <span className="readout-label">EMISSIONS</span>
          </div>
          <div className="readout-item">
            <span className="readout-value">100%</span>
            <span className="readout-label">POWER</span>
          </div>
          <div className="readout-item">
            <span className="readout-value">∞</span>
            <span className="readout-label">FUTURE</span>
          </div>
        </div>
      </section>

      <div className="vehicle-grid-hud">
        {vehicles.map((v, i) => (
          <VehicleCard key={i} {...v} />
        ))}
      </div>

      <section style={{ padding: '8rem 3rem', borderTop: '1px solid var(--cyber-border)' }}>
        <div style={{ maxWidth: '800px' }}>
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--cyber-teal)' }}>
            DIGITAL_INFRASTRUCTURE
          </h2>
          <p style={{ lineHeight: '1.8', opacity: 0.7, marginBottom: '2rem' }}>
            Our vehicles are more than machines; they are nodes in a global intelligence network. Over-the-air updates, neural-link navigation, and autonomous energy management come standard.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ borderLeft: '2px solid var(--cyber-teal)', paddingLeft: '1rem' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>99.9%</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>UPTIME</span>
            </div>
            <div style={{ borderLeft: '2px solid var(--cyber-teal)', paddingLeft: '1rem' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>12ms</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>LATENCY</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
