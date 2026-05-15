'use client';
import React from 'react';
import { ElectricAssetCard, RangeAnalyticsHUD } from './components';

export default function Page() {
  const electricFleet = [
    { name: "Lucid Air Sapphire", price: "$249,000", range: "687 KM", accel: "1.89s", topSpeed: "330 KM/H", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000" },
    { name: "Tesla Model S Plaid", price: "$89,990", range: "637 KM", accel: "1.99s", topSpeed: "322 KM/H", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000" },
    { name: "Rimac Nevera", price: "$2,200,000", range: "490 KM", accel: "1.81s", topSpeed: "412 KM/H", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2000" },
    { name: "Porsche Taycan Turbo S", price: "$194,900", range: "450 KM", accel: "2.4s", topSpeed: "260 KM/H", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2000" },
    { name: "Lotus Evija", price: "$2,100,000", range: "400 KM", accel: "2.8s", topSpeed: "350 KM/H", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2000" },
    { name: "Rivian R1S", price: "$78,000", range: "516 KM", accel: "3.0s", topSpeed: "201 KM/H", image: "https://images.unsplash.com/photo-1617788131775-ceb2027fd12c?q=80&w=2000" },
  ];

  return (
    <div className="ae-section">
      {/* Tech Hero */}
      <section className="ae-hero">
        <div className="ae-hero-circle"></div>
        <div className="ae-mono" style={{ marginBottom: '4rem' }}>ENERGY_DISTRIBUTION_V8_SYNC</div>
        <h1 className="ae-heading-xl">
            The <br/>
            Neural <br/>
            <span style={{ color: 'var(--ae-cyan)' }}>Fleet.</span>
        </h1>
        <p style={{ maxWidth: '750px', fontSize: '1.5rem', color: 'rgba(248, 250, 252, 0.4)', lineHeight: 1.8, marginTop: '6rem', fontWeight: 300 }}>
            Access the world's most advanced electric vehicle inventory. Real-time telemetry, instant reservation, and neural-linked configuration at your fingertips.
        </p>
        <div style={{ marginTop: '8rem', display: 'flex', gap: '3rem' }}>
            <button className="ae-btn-primary">Initialize Scan</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'white', 
                padding: '1.5rem 4rem', 
                borderRadius: '12px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                letterSpacing: '2px'
            }}>
                View_Network
            </button>
        </div>
      </section>

      {/* Logic / Trust Bar */}
      <div style={{ padding: '4rem 0', borderTop: '1px solid var(--ae-border)', borderBottom: '1px solid var(--ae-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem' }}>
          {['TELEMETRY_SYNC: ACTIVE', '800V_GRID_READY', 'NEURAL_LINK: STABLE', 'NODAL_VERIFICATION: 100%'].map(logic => (
              <div key={logic} className="ae-mono" style={{ fontSize: '0.65rem', opacity: 0.4 }}>{logic}</div>
          ))}
      </div>

      {/* Analytics HUD Section */}
      <section style={{ padding: '10rem 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', color: 'white' }}>
                  Modular <br/>Architecture.
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(248, 250, 252, 0.4)', lineHeight: 2 }}>
                  Our vehicles are built on the 'Electra-Core' platform, featuring swappable battery modules and a neural navigation system that learns your driving patterns in real-time.
              </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
              <RangeAnalyticsHUD value="350KW" label="ULTRA_CHARGE" />
              <RangeAnalyticsHUD value="L4" label="AUTONOMOUS" />
              <RangeAnalyticsHUD value="0.01s" label="SYNC_SPEED" />
              <RangeAnalyticsHUD value="100%" label="EFFICIENCY" />
          </div>
      </section>

      {/* Fleet Showcase Grid */}
      <section style={{ marginTop: '10rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ae-mono" style={{ marginBottom: '1.5rem' }}>HIGH_FIDELITY_FLEET</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', color: 'white' }}>The <span style={{ color: 'var(--ae-cyan)' }}>Registry.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(248, 250, 252, 0.3)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes performance data from the world's most significant electric asset nodes.
              </div>
          </div>
          
          <div className="ae-fleet-grid">
            {electricFleet.map((car, i) => (
              <ElectricAssetCard key={i} {...car} />
            ))}
          </div>
      </section>

      {/* Final Space */}
      <div style={{ height: '20rem' }}></div>
    </div>
  );
}
