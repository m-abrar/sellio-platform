'use client';
import React from 'react';
import { CarCard, Gauge } from './components';

export default function Page() {
  const cars = [
    { name: "Audi RS e-tron GT", price: "$147,000", year: 2024, fuel: "ELECTRIC", hp: "637", transmission: "AUTO", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2070", span: 8 },
    { name: "BMW i7 M70", price: "$168,500", year: 2024, fuel: "ELECTRIC", hp: "650", transmission: "AUTO", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070", span: 4 },
    { name: "Porsche Taycan S", price: "$194,900", year: 2024, fuel: "ELECTRIC", hp: "750", transmission: "AUTO", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070", span: 4 },
    { name: "Lucid Air Sapphire", price: "$249,000", year: 2024, fuel: "ELECTRIC", hp: "1,234", transmission: "AUTO", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071", span: 8 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="am-section am-hero">
        <div className="hero-text-block">
          <div className="am-mono" style={{ marginBottom: '2rem' }}>[ NODE_ID: AUTO_MODERN_V8 ]</div>
          <h1 className="am-heading-xl">
            Engineering<br/>
            <span style={{ color: 'var(--am-blue)' }}>Absolute</span><br/>
            Motion.
          </h1>
          
          <div className="am-hero-stats">
            <div className="am-stat-node">
                <span className="am-stat-value">0.19</span>
                <span className="am-stat-label">DRAG_COEF</span>
            </div>
            <div className="am-stat-node">
                <span className="am-stat-value">2.1s</span>
                <span className="am-stat-label">0-60_MPH</span>
            </div>
            <div className="am-stat-node">
                <span className="am-stat-value">800V</span>
                <span className="am-stat-label">ARCHITECTURE</span>
            </div>
          </div>

          <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem' }}>
              <button className="am-btn-primary">EXPLORE_INVENTORY</button>
              <button style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--am-border)', 
                  color: 'white',
                  padding: '1.25rem 3.5rem',
                  borderRadius: '100px',
                  fontWeight: 900,
                  cursor: 'pointer'
              }}>
                  VIRTUAL_ENGINEERING
              </button>
          </div>
        </div>

        <div className="am-hero-image-frame">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" alt="Main Showcase" />
          
          <div className="am-hud-overlay">
              <div className="am-mono" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--am-border)', paddingBottom: '0.5rem' }}>
                  SYSTEM_DIAGNOSTICS
              </div>
              <Gauge label="CORE_TEMPERATURE" value="34°C" percentage={45} />
              <Gauge label="BATTERY_RESERVE" value="98%" percentage={98} />
              <Gauge label="NEURAL_SYNC" value="ACTIVE" percentage={100} />
          </div>
        </div>
      </section>

      {/* Technical Inventory Section */}
      <section className="am-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
                <div className="am-mono">CATALOG_SYNC // 2024_COLLECTION</div>
                <h2 style={{ fontSize: '4rem', fontWeight: 900, marginTop: '1rem' }}>Technical <span style={{ color: 'var(--am-blue)' }}>Inventory</span></h2>
            </div>
            <p style={{ maxWidth: '400px', color: 'var(--am-text-muted)', textAlign: 'right', fontSize: '0.9rem', lineHeight: 1.8 }}>
                Every vehicle in our digital registry is synchronized with its real-world twin, ensuring absolute precision in spec delivery and availability.
            </p>
        </div>

        <div className="am-bento-grid">
          {cars.map((car, i) => (
            <CarCard key={i} {...car} />
          ))}
        </div>
      </section>

      {/* Call to Action: The Configurator */}
      <section className="am-section">
          <div style={{ 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '10rem 6%',
              borderRadius: 'var(--am-radius)',
              border: '1px solid var(--am-border)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center'
          }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                  <div className="am-mono" style={{ marginBottom: '2rem' }}>INITIALIZE_CUSTOM_BUILD</div>
                  <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem' }}>
                      Authorize Your <br/>
                      <span style={{ color: 'var(--am-blue)' }}>Performance.</span>
                  </h2>
                  <p style={{ maxWidth: '700px', margin: '0 auto 5rem', color: 'var(--am-text-muted)', fontSize: '1.25rem', lineHeight: 1.8 }}>
                      Access the world's most advanced automotive configuration engine. Build, simulate, and authorize your elite vehicle across the Sellio global node network.
                  </p>
                  <button className="am-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.2rem' }}>
                      OPEN_CONFIGURATOR_NODE
                  </button>
              </div>
              
              {/* Background HUD decorative elements */}
              <div style={{ 
                  position: 'absolute', 
                  top: '0', 
                  left: '0', 
                  width: '100%', 
                  height: '100%', 
                  opacity: 0.05,
                  pointerEvents: 'none',
                  fontFamily: 'var(--am-font-mono)',
                  fontSize: '20rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
              }}>
                  010101
              </div>
          </div>
      </section>
    </div>
  );
}
