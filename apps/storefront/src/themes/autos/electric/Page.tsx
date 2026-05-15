
import React from 'react';
import { CarCardNeo } from './components';

export default function Page() {
  const electricFleet = [
    { name: "Lucid Air Sapphire", price: "$249,000", range: "687 KM", accel: "1.89s", topSpeed: "330 KM/H", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000" },
    { name: "Tesla Model S Plaid", price: "$89,990", range: "637 KM", accel: "1.99s", topSpeed: "322 KM/H", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000" },
    { name: "Rimac Nevera", price: "$2,200,000", range: "490 KM", accel: "1.81s", topSpeed: "412 KM/H", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2000" },
  ];

  return (
    <div>
      {/* Hero HUD */}
      <section className="hud-hero">
        <div style={{ position: 'absolute', right: '-10%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, fontSize: '30rem', fontWeight: 900, fontFamily: 'Orbitron', pointerEvents: 'none' }}>
            EV
        </div>
        <div className="hud-hero-content">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', fontSize: '0.6rem', fontWeight: 800, fontFamily: 'Orbitron', border: '1px solid #00E5FF' }}>
                    SAT_LINK_ACTIVE
                </div>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(255, 0, 229, 0.1)', color: '#FF00E5', fontSize: '0.6rem', fontWeight: 800, fontFamily: 'Orbitron', border: '1px solid #FF00E5' }}>
                    SECURE_NODE_7
                </div>
            </div>
            <h1 className="hud-hero-title">The <br/>Neural Fleet.</h1>
            <p className="hud-hero-subtitle">
                Access the world's most advanced electric vehicle inventory. Real-time telemetry, instant reservation, and neural-linked configuration at your fingertips.
            </p>
            <button className="hud-btn">INITIALIZE_SCAN</button>
        </div>
      </section>

      {/* Inventory HUD */}
      <section className="hud-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
                <p style={{ color: '#00E5FF', fontFamily: 'Orbitron', fontSize: '0.6rem', letterSpacing: '4px', marginBottom: '1rem' }}>INVENTORY_QUERY_v1.4</p>
                <h2 className="hud-font" style={{ fontSize: '3rem', fontWeight: 900 }}>High_Fidelity_EVs</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>RESULTS_FOUND: 124</span>
            </div>
        </div>
        
        <div className="hud-grid">
            {electricFleet.map((car, i) => (
                <CarCardNeo key={i} {...car} />
            ))}
        </div>
      </section>

      {/* Tech Breakdown */}
      <section style={{ padding: '8rem 4rem', background: 'linear-gradient(to bottom, #0a0a0a, #050505)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div>
                <h2 className="hud-font" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', color: '#fff' }}>Modular Architecture.</h2>
                <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '4rem' }}>
                    Our vehicles are built on the 'Electra-Core' platform, featuring swappable battery modules, 800V charging as standard, and a neural navigation system that learns your driving patterns in real-time.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    <div>
                        <div className="hud-font" style={{ fontSize: '2.5rem', color: '#00E5FF' }}>350KW</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#444', letterSpacing: '2px' }}>ULTRA_CHARGE</div>
                    </div>
                    <div>
                        <div className="hud-font" style={{ fontSize: '2.5rem', color: '#00E5FF' }}>Level 4</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#444', letterSpacing: '2px' }}>AUTONOMOUS</div>
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative' }}>
                <div style={{ width: '100%', height: '400px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '80%', height: '80%', border: '1px dashed #00E5FF', borderRadius: '50%', opacity: 0.2 }}></div>
                    <div className="hud-font" style={{ fontSize: '1rem', color: '#00E5FF', opacity: 0.5 }}>TELEMETRY_STREAM</div>
                </div>
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', padding: '1.5rem', background: '#00E5FF', color: '#000', fontWeight: 900, fontSize: '0.8rem', borderRadius: '4px', transform: 'rotate(-5deg)' }}>
                    v10.4_STABLE
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
