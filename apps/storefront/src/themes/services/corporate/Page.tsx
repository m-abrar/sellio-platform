
'use client';
import React from 'react';
import { ServiceNodeCard, OperationalHUD } from './components';

export default function Page() {
  const services = [
    { title: "Bespoke Corporate Strategy", description: "Navigating the complexities of global expansion with data-driven strategic frameworks and local insights.", icon: "🏛️" },
    { title: "High-Velocity Logistics", description: "Advanced distribution protocols designed for zero-latency commerce and institutional scale.", icon: "🌐" },
    { title: "Risk Mitigation & Compliance", description: "Providing institutional-level security and regulatory mapping for complex global markets.", icon: "🔒" },
    { title: "Global Financial Systems", description: "Modern institutional billing nodes and automated liquidity management for the global firm.", icon: "📊" },
    { title: "Jurisdictional Advisory", description: "Strategic legal guidance for organizations navigating the evolving Sellio global network.", icon: "⚖️" },
    { title: "Infrastructure Optimization", description: "Bespoke engineering solutions designed to scale industrial operations and maximize efficiency.", icon: "⚙️" },
  ];

  return (
    <div className="services-corporate-theme">
      {/* Executive Elite Hero */}
      <section className="sc-hero" style={{ background: 'var(--sc-bg)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, var(--sc-accent-soft) 0%, transparent 70%)', opacity: 0.3, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="sc-subheading" style={{ marginBottom: '3rem' }}>EXECUTIVE ADVISORY HUB</div>
          <h1 className="sc-heading-xl">
            Elevate Your <br/>
            Institutional <br/>
            <span style={{ color: 'var(--sc-accent)' }}>Legacy.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--sc-text-dim)', lineHeight: 1.8, maxWidth: '650px', fontWeight: 300 }}>
            The Sellio Executive Suite provides the foundational insights and elite infrastructure required for global institutional expansion.
          </p>
          <div style={{ marginTop: '7rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <button className="sc-btn-primary">Explore Our Solutions</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--sc-accent)', 
                color: 'var(--sc-accent)', 
                padding: '1.5rem 5rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontSize: '0.8rem',
                letterSpacing: '3px',
                borderRadius: '2px',
                boxShadow: '0 0 20px var(--sc-accent-soft)'
            }}>
                Request Consultation
            </button>
          </div>
        </div>
        <div className="sc-hero-img-wrapper" style={{ border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', padding: '1rem' }}>
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070" alt="Executive Office" className="sc-hero-img" style={{ opacity: 0.8 }} />
          <div style={{ position: 'absolute', bottom: '4rem', right: '-2rem', background: 'var(--sc-accent)', color: 'var(--sc-bg)', padding: '3rem', borderRadius: '4px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', fontWeight: 900, fontFamily: 'var(--sc-font-heading)', fontSize: '1.5rem' }}>
              SINCE 2018
          </div>
        </div>
      </section>

      {/* Strategic Metrics HUD */}
      <section className="sc-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', padding: '12rem 6%' }}>
          <OperationalHUD label="Global Nodes" value="142" sub="Active institutional distribution nodes." />
          <OperationalHUD label="Capital Sync" value="$4.2B" sub="Institutional throughput managed annually." />
          <OperationalHUD label="System Uptime" value="99.9%" sub="High-availability mission critical uptime." />
          <OperationalHUD label="Advisory Nodes" value="24/7" sub="Active executive support availability." />
      </section>

      {/* Institutional Services Section */}
      <section className="sc-section" style={{ borderTop: '1px solid var(--sc-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10rem', flexWrap: 'wrap', gap: '4rem' }}>
              <div style={{ maxWidth: '800px' }}>
                  <div className="sc-subheading" style={{ marginBottom: '2rem' }}>Institutional Registry</div>
                  <h2 className="sc-heading-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)' }}>Precision <br/>Strategic Delivery.</h2>
              </div>
              <div style={{ maxWidth: '450px', fontSize: '1.1rem', color: 'var(--sc-text-dim)', lineHeight: 1.8, fontWeight: 300 }}>
                  Our unified protocol ensures that every executive service provided by the Institutional Hub meets global compliance and operational excellence standards.
              </div>
          </div>
          
          <div className="sc-service-grid">
            {services.map((s, i) => (
              <ServiceNodeCard key={i} {...s} />
            ))}
          </div>
      </section>

      {/* Legacy Expansion CTA */}
      <section className="sc-section" style={{ background: 'var(--sc-surface)', borderTop: '1px solid var(--sc-border)', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
          <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div className="sc-subheading" style={{ marginBottom: '4rem' }}>The Institutional Standard</div>
              <h2 className="sc-heading-xl" style={{ fontSize: 'clamp(3rem, 6vw, 7rem)', marginBottom: '5rem' }}>Scale Your <br/><span style={{ color: 'var(--sc-accent)' }}>Global Footprint.</span></h2>
              <p style={{ fontSize: '1.4rem', color: 'var(--sc-text-dim)', lineHeight: 1.8, marginBottom: '8rem', fontWeight: 300 }}>
                  Join the world's most advanced commercial infrastructure. Secure your organization's legacy with elite institutional support.
              </p>
              <button className="sc-btn-primary" style={{ padding: '2.5rem 10rem', fontSize: '1.2rem' }}>Partner with Sellio</button>
          </div>
      </section>
      
      <div style={{ height: '10rem', background: 'var(--sc-bg)' }}></div>
    </div>
  );
}
