
import React from 'react';
import { VehicleShowcase, PerformanceStats } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="diamond-hero">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url("https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070") center/cover no-repeat', opacity: 0.15 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--drive-blue)', letterSpacing: '6px', marginBottom: '2.5rem', fontWeight: 700 }}>HIGH_SPEED_DISTRIBUTION</div>
              <h1>Diamond <br/><span>Drive.</span></h1>
              <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', color: '#666', lineHeight: 1.8, marginBottom: '5rem' }}>
                  The world's most advanced high-fidelity automotive distribution node. Precision engineered for the exotic collector and high-performance enthusiast.
              </p>
              <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
                  <button className="drive-btn-primary">EXPLORE_INVENTORY</button>
                  <button style={{ padding: '1.5rem 4.5rem', background: 'transparent', color: 'white', border: '1px solid #444', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>THE_REGISTRY</button>
              </div>
          </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '3.5rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505', borderTop: '1px solid var(--drive-border)', borderBottom: '1px solid var(--drive-border)', color: '#333', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '4px' }}>
          <span>ASSET_VERIFICATION: ACTIVE</span>
          <span>GLOBAL_DISTRIBUTION_READY</span>
          <span>PILOT_ACCESS_GRANTED</span>
          <span>NODAL_SYNC: 100%</span>
      </section>

      {/* Stats */}
      <PerformanceStats />

      {/* Showcase */}
      <VehicleShowcase />

      {/* Mid-Section: Engineering */}
      <section style={{ padding: '15rem 6%', background: 'linear-gradient(180deg, #000 0%, #0a0a0a 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10rem', alignItems: 'center' }}>
              <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 800, color: 'white', marginBottom: '3rem', letterSpacing: '-3px' }}>Precision <br/>Engineering.</h2>
                  <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                      Our Diamond Drive protocol is built on the foundation of high-fidelity data and surgical verification. Every exotic asset in our collection undergoes a rigorous multi-node authentication process before entering the registry.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>0.01s</div>
                          <div style={{ fontSize: '0.7rem', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>REALTIME_AUTHENTICATION</div>
                      </div>
                      <div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>500+</div>
                          <div style={{ fontSize: '0.7rem', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>GLOBAL_COLLECTORS</div>
                      </div>
                  </div>
              </div>
              <div style={{ position: 'relative' }}>
                  <img src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070" alt="Supercar Detail" style={{ width: '100%', borderRadius: '4px', filter: 'grayscale(0.5)' }} />
                  <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', padding: '4rem', background: 'var(--drive-blue)', color: 'white', fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
                      770 HP <br/>ACTIVE
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', background: '#000' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: 800, color: 'white', marginBottom: '4rem', letterSpacing: '-4px' }}>Ready for <br/>Launch?</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#444' }}>
              Connect your pilot node to the Diamond Drive network and gain access to the world's most exclusive high-performance registry.
          </p>
          <button className="drive-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.2rem' }}>INITIALIZE_PILOT_NODE</button>
      </section>
    </div>
  );
}
