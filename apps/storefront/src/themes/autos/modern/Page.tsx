import React from 'react';
import { BentoCarCard } from './components';

export default function ModernAutoPage() {
  const cars = [
    { name: "Audi RS e-tron GT", price: "$147,000", year: 2024, fuel: "ELECTRIC", hp: "637", transmission: "AUTO", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2070" },
    { name: "BMW i7 M70 xDrive", price: "$168,500", year: 2024, fuel: "ELECTRIC", hp: "650", transmission: "AUTO", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070" },
    { name: "Porsche Taycan Turbo S", price: "$194,900", year: 2024, fuel: "ELECTRIC", hp: "750", transmission: "AUTO", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
    { name: "Lucid Air Sapphire", price: "$249,000", year: 2024, fuel: "ELECTRIC", hp: "1,234", transmission: "AUTO", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071" },
  ];

  return (
    <div>
      <section className="autos-hero-modern">
        <div className="hero-text-block">
          <span style={{ color: 'var(--color-blue)', fontWeight: 700, letterSpacing: '4px', marginBottom: '1rem', display: 'block' }}>VIRTUAL_SHOWROOM</span>
          <h1>Evolved<br/>Performance.</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.6, maxWidth: '450px', lineHeight: '1.8', marginBottom: '3rem' }}>
            Experience the future of automotive retail. Our high-fidelity platform brings the world's most elite vehicles directly to your screen with technical precision.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderLeft: '2px solid var(--color-blue)' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>0.19</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>DRAG_COEF</span>
            </div>
            <div style={{ padding: '1rem', borderLeft: '2px solid var(--color-blue)' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800 }}>800V</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>ARCHITECTURE</span>
            </div>
          </div>
        </div>
        <div className="hero-car-frame">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" alt="Main Showcase" />
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-blue)', marginBottom: '0.5rem' }}>REAL_TIME_DATA</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>98% BATTERY_HEALTH</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2.5rem', fontWeight: 800 }}>Technical Inventory</h2>
        <p style={{ opacity: 0.5, letterSpacing: '4px' }}>PRECISION_ENGINEERING // INSTANT_AVAILABILITY</p>
      </section>

      <div className="bento-car-grid">
        {cars.map((car, i) => (
          <BentoCarCard key={i} {...car} />
        ))}
      </div>

      <section style={{ padding: '8rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: 'var(--color-slate)', padding: '6rem', borderRadius: '48px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem' }}>Configure Your Digital Fleet.</h2>
            <p style={{ maxWidth: '600px', opacity: 0.6, fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
              Our proprietary configuration engine allows you to customize every aspect of your vehicle's technical stack, from thermal management to neural navigation.
            </p>
            <button style={{ 
              background: 'white', 
              color: 'black', 
              padding: '1.2rem 4rem', 
              borderRadius: '100px', 
              border: 'none', 
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}>
              Open Configurator
            </button>
          </div>
          <div style={{ position: 'absolute', right: '-100px', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, fontSize: '20rem', fontWeight: 900 }}>AUTO</div>
        </div>
      </section>
    </div>
  );
}
