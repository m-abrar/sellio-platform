import React from 'react';
import { BentoCard } from './components';

export default function ModernSaaSPage() {
  const industries = [
    { title: "Real Estate", icon: "🏠", description: "Bespoke property showcase with high-res imagery." },
    { title: "Automotive", icon: "🏎️", description: "Technical inventory management with HUD displays." },
    { title: "E-Commerce", icon: "🛍️", description: "Minimalist boutique retail with white-glove UX." },
    { title: "Tech Jobs", icon: "⚙️", description: "IDE-style listings for high-performance engineers." },
  ];

  return (
    <div>
      <section className="bento-hero-section">
        <div className="bento-block hero-main-block">
          <span style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '2px', marginBottom: '1rem', display: 'block' }}>V4.0 // LIVE</span>
          <h1 className="modern-title">One Engine.<br/>Fifty Industries.</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.6, maxWidth: '500px', lineHeight: '1.6' }}>
            The world's most versatile commerce platform. Scale your business with industry-specific high-fidelity storefronts.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="bento-block" style={{ flex: 1, background: 'var(--color-midnight)', color: 'white' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800 }}>1.2M</span>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Active Listings Globally</p>
          </div>
          <div className="bento-block" style={{ flex: 1, background: '#eff6ff' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)' }}>50+</span>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Tailored Vertical Themes</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '2.5rem', fontWeight: 800 }}>Seamless Verticals</h2>
        <p style={{ opacity: 0.5 }}>INTEGRATED // PERFORMANT // BESPOKE</p>
      </section>

      <div className="industry-bento-grid">
        {industries.map((item, i) => (
          <BentoCard key={i} {...item} />
        ))}
      </div>

      <section style={{ padding: '8rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="bento-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-outfit)', fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Ready for the next level?</h2>
            <p style={{ opacity: 0.6, lineHeight: '1.8', marginBottom: '2.5rem' }}>
              Deploy your storefront in minutes. Our engine handles the complexity of vertical-specific data, while you focus on scaling your market presence.
            </p>
            <button style={{ 
              background: 'var(--color-primary)', 
              color: 'white', 
              padding: '1.2rem 3rem', 
              borderRadius: '100px', 
              border: 'none', 
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}>
              Start Free Trial
            </button>
          </div>
          <div style={{ background: '#f1f5f9', height: '400px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', bottom: '20px', background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '2rem' }}>
              <div style={{ width: '40px', height: '10px', background: '#e2e8f0', borderRadius: '100px', marginBottom: '1rem' }}></div>
              <div style={{ width: '100%', height: '150px', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem' }}></div>
              <div style={{ width: '60%', height: '10px', background: '#e2e8f0', borderRadius: '100px' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
