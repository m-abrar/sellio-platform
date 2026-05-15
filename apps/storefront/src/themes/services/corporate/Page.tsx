
import React from 'react';
import { ServiceFeatureCard } from './components';

export default function Page() {
  const services = [
    { title: "Institutional Strategy", description: "Providing data-driven strategic frameworks for global expansion and operational scale.", icon: "🏛️" },
    { title: "Supply Chain Logic", description: "Advanced distribution protocols designed for high-frequency commerce and zero-latency logistics.", icon: "🌐" },
    { title: "Risk & Compliance", description: "Hardware-level security and regulatory mapping across multiple global jurisdictions.", icon: "🔒" },
    { title: "Financial Systems", description: "Modern institutional billing, currency nodes, and automated liquidity management.", icon: "📊" },
    { title: "Legal Advisory", description: "Specialized corporate nodes providing jurisdictional guidance for the Sellio network.", icon: "⚖️" },
    { title: "Engineering Core", description: "Bespoke infrastructure development and system optimization for industrial scale.", icon: "⚙️" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="corp-hero">
          <div className="corp-hero-content">
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--corp-accent)', letterSpacing: '4px', display: 'block', marginBottom: '1.5rem' }}>GLOBAL_INSTITUTIONAL_NETWORK</span>
              <h1>Standardizing <br/>Global Scale.</h1>
              <p style={{ fontSize: '1.2rem', color: '#718096', lineHeight: 1.8, marginBottom: '3.5rem' }}>
                  The Sellio Institutional Hub provides the foundational services required for global commercial distribution. Trusted by over 140 industrial nodes.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--corp-primary)', color: 'white', border: 'none', fontWeight: 700 }}>EXPLORE_SOLUTIONS</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'none', color: 'var(--corp-primary)', border: '1px solid var(--corp-primary)', fontWeight: 700 }}>REQUEST_ADVISORY</button>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070" alt="Corporate Office" style={{ width: '100%', borderRadius: '4px', boxShadow: '20px 20px 60px rgba(0,0,0,0.05)' }} />
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', padding: '2rem', background: 'white', border: '1px solid #eee', fontWeight: 900, fontSize: '0.9rem' }}>
                  ESTABLISHED_2018
              </div>
          </div>
      </section>

      {/* Trust Stats Bar */}
      <section style={{ padding: '4rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', background: '#fcfcfc' }}>
          <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--corp-primary)' }}>142</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0', letterSpacing: '2px' }}>ACTIVE_NODES</div>
          </div>
          <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--corp-primary)' }}>$4.2B+</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0', letterSpacing: '2px' }}>TRANSACTION_VOLUME</div>
          </div>
          <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--corp-primary)' }}>99.99%</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0', letterSpacing: '2px' }}>SYSTEM_UPTIME</div>
          </div>
          <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--corp-primary)' }}>24/7</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a0aec0', letterSpacing: '2px' }}>NODAL_SUPPORT</div>
          </div>
      </section>

      {/* Services Grid */}
      <section className="service-grid">
          {services.map((service, i) => (
              <ServiceFeatureCard key={i} {...service} />
          ))}
      </section>

      {/* Partner CTA */}
      <section style={{ padding: '12rem 6%', background: 'linear-gradient(to bottom, #f7fafc, #fff)', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem' }}>Join the Institutional <br/>Standard.</h2>
              <p style={{ fontSize: '1.25rem', color: '#718096', marginBottom: '5rem' }}>
                  Ready to scale your industrial distribution? Partner with Sellio and gain access to the world's most advanced commercial infrastructure.
              </p>
              <button style={{ padding: '1.5rem 5rem', background: 'var(--corp-primary)', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px' }}>
                  APPLY_FOR_PARTNERSHIP
              </button>
          </div>
      </section>
    </div>
  );
}
