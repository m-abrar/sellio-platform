import React from 'react';
import { MonolithicCarBlock } from './components';

export default function LuxuryGaragePage() {
  const cars = [
    { title: "Bugatti Chiron Pur Sport", year: 2024, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070", hp: "1500", torque: "1600Nm", topSpeed: "350km/h" },
    { title: "Ferrari Daytona SP3", year: 2024, image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070", hp: "840", torque: "697Nm", topSpeed: "340km/h" },
    { title: "Lamborghini Revuelto", year: 2024, image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2070", hp: "1015", torque: "725Nm", topSpeed: "350km/h" },
    { title: "Aston Martin Valhalla", year: 2024, image: "https://images.unsplash.com/photo-1603584173870-7f4295559507?q=80&w=2070", hp: "950", torque: "1000Nm", topSpeed: "330km/h" },
  ];

  return (
    <div>
      <section className="luxury-car-hero">
        <div style={{ width: '60px', height: '1px', background: 'var(--color-silver)', marginBottom: '3rem' }}></div>
        <p style={{ letterSpacing: '6px', fontSize: '0.8rem', opacity: 0.5, marginBottom: '2rem' }}>ESTABLISHED_EXCELLENCE</p>
        <h1>The Atelier<br/>Collection.</h1>
        <p style={{ maxWidth: '450px', lineHeight: '2', opacity: 0.5, fontSize: '0.9rem' }}>
          An immersive showcase of the world's most significant automotive achievements. Curated for the collector who demands absolute precision.
        </p>
      </section>

      <div className="monolithic-car-grid">
        {cars.map((car, i) => (
          <MonolithicCarBlock key={i} {...car} />
        ))}
      </div>

      <section style={{ padding: '10rem 6rem', textAlign: 'center', background: '#000' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '100px', height: '1px', background: 'var(--color-silver)', margin: '0 auto 4rem' }}></div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 400, marginBottom: '3rem' }}>Beyond Engineering.</h2>
          <p style={{ lineHeight: '2.2', opacity: 0.4, fontSize: '1.1rem', marginBottom: '4rem' }}>
            Our Atelier represents the pinnacle of digital acquisition. Every vehicle in our collection undergoes a rigorous vetting process to ensure it meets our standards of mechanical and aesthetic mastery.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8rem' }}>
            <div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-silver)' }}>14</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '3px', fontWeight: 800, opacity: 0.4 }}>GLOBAL_ATELIERS</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-silver)' }}>24/7</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '3px', fontWeight: 800, opacity: 0.4 }}>CONCIERGE_SUPPORT</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
