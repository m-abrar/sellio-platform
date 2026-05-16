'use client';
import React from 'react';
import { ServiceNodeCard, OperationalHUD } from './components';

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
    <div className="services-corporate-theme">
      {/* Authoritative Institutional Hero */}
      <section className="sc-hero">
        <div>
          <div className="sc-mono" style={{ marginBottom: '3rem' }}>GLOBAL_INSTITUTIONAL_NETWORK</div>
          <h1 className="sc-heading-xl">
            Standardizing <br/>
            Global <br/>
            <span style={{ color: 'var(--sc-blue)' }}>Scale.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--sc-grey)', lineHeight: 1.8, maxWidth: '650px' }}>
            The Sellio Institutional Hub provides the foundational services required for global commercial distribution. Trusted by over 140 industrial nodes.
          </p>
          <div style={{ marginTop: '7rem', display: 'flex', gap: '3rem' }}>
            <button className="sc-btn-primary">Explore Solutions</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--sc-border)', 
                color: 'var(--sc-navy)', 
                padding: '1.5rem 4.5rem', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontSize: '0.8rem',
                letterSpacing: '3px'
            }}>
                Request_Advisory
            </button>
          </div>
        </div>
        <div className="sc-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070" alt="Corporate Office" className="sc-hero-img" />
          <div style={{ position: 'absolute', top: '4rem', right: '-4rem', background: 'white', padding: '3rem', border: '1px solid var(--sc-border)', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
              <div className="sc-mono" style={{ fontSize: '0.65rem' }}>ESTABLISHED_2018</div>
          </div>
        </div>
      </section>

      {/* Operational HUD Section */}
      <section className="sc-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', marginTop: '5rem' }}>
          <OperationalHUD label="ACTIVE_NODES" value="142" sub="Verified industrial distribution nodes." />
          <OperationalHUD label="VOLUME_SYNC" value="$4.2B+" sub="Institutional transaction throughput." />
          <OperationalHUD label="SYSTEM_UPTIME" value="99.99%" sub="High-availability infrastructure status." />
          <OperationalHUD label="NODAL_SUPPORT" value="24/7" sub="Active institutional advisory latency." />
      </section>

      {/* Service Registry Section */}
      <section className="sc-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="sc-mono" style={{ marginBottom: '1.5rem' }}>INSTITUTIONAL_SERVICE_REGISTRY</div>
                  <h2 className="sc-heading-xl" style={{ fontSize: '6rem' }}>Foundational <br/>Solutions.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--sc-grey)', lineHeight: 1.8 }}>
                  Our unified protocol ensures that every service provided by the Institutional Hub meets global compliance and operational standards.
              </div>
          </div>
          
          <div className="sc-service-grid">
            {services.map((s, i) => (
              <ServiceNodeCard key={i} {...s} />
            ))}
          </div>
      </section>

      {/* Partnership Section */}
      <section className="sc-section" style={{ background: 'var(--sc-frost)', borderTop: '1px solid var(--sc-border)', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="sc-mono" style={{ marginBottom: '4rem' }}>JOIN_THE_INSTITUTIONAL_STANDARD</div>
              <h2 className="sc-heading-xl" style={{ fontSize: '6rem', marginBottom: '5rem' }}>Scale Your <br/><span style={{ color: 'var(--sc-blue)' }}>Distribution.</span></h2>
              <p style={{ fontSize: '1.5rem', color: 'var(--sc-grey)', lineHeight: 1.8, marginBottom: '8rem' }}>
                  Ready to scale your industrial distribution? Partner with Sellio and gain access to the world's most advanced commercial infrastructure.
              </p>
              <button className="sc-btn-primary" style={{ padding: '2rem 8rem' }}>Apply for Partnership</button>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
