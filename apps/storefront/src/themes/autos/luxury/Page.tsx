'use client';
import React from 'react';
import { LuxuryAssetCard, ConciergeHUD } from './components';

export default function Page() {
  const assets = [
    { title: "Bugatti Chiron Super Sport", price: "$3,825,000", hp: "1578", acceleration: "2.3", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070" },
    { title: "Ferrari SF90 Stradale", price: "$625,000", hp: "986", acceleration: "2.5", image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=2070" },
    { title: "Lamborghini Revuelto", price: "$604,000", hp: "1001", acceleration: "2.5", image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=2070" },
    { title: "McLaren P1 GTR", price: "$3,100,000", hp: "986", acceleration: "2.4", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2070" },
  ];

  return (
    <div className="al-section">
      {/* Sleek Futuristic Hero */}
      <section className="al-hero">
        <div className="al-hero-glow"></div>
        <div className="al-mono" style={{ marginBottom: '4rem' }}>HIGH_SPEED_DISTRIBUTION_V8</div>
        <h1 className="al-heading-xl">
            The <br/>
            Platinum <br/>
            <span style={{ color: 'var(--al-cyan)' }}>Drive.</span>
        </h1>
        <p style={{ maxWidth: '850px', margin: '6rem auto', fontSize: '1.5rem', color: 'rgba(226, 232, 240, 0.4)', lineHeight: 1.8, fontWeight: 300 }}>
            The world's most advanced high-fidelity automotive distribution node. Precision engineered for the exotic collector and high-performance enthusiast.
        </p>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
            <button className="al-btn-primary">Explore Inventory</button>
            <button style={{ 
                background: 'transparent', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '1.75rem 5rem', 
                fontWeight: 900, 
                fontSize: '1rem', 
                cursor: 'pointer',
                letterSpacing: '3px'
            }}>
                THE_REGISTRY
            </button>
        </div>
      </section>

      {/* Trust Bar (Logic Oriented) */}
      <div style={{ padding: '4rem 0', borderTop: '1px solid var(--al-border)', borderBottom: '1px solid var(--al-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10rem' }}>
          {['ASSET_VERIFICATION: ACTIVE', 'GLOBAL_DISTRIBUTION_SYNC', 'PILOT_ACCESS: GRANTED', 'NODAL_SYNC: 100%'].map(logic => (
              <div key={logic} className="al-mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>{logic}</div>
          ))}
      </div>

      {/* Concierge HUD Section */}
      <section style={{ padding: '10rem 0', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '15rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', color: 'white' }}>
                  Precision <br/>Engineering.
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(226, 232, 240, 0.4)', lineHeight: 2 }}>
                  Our Platinum Drive protocol is built on the foundation of high-fidelity data and surgical verification. Every exotic asset undergoes a rigorous multi-node authentication process.
              </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
              <ConciergeHUD value="0.01s" label="AUTH_SPEED" />
              <ConciergeHUD value="142" label="GLOBAL_NODES" />
              <ConciergeHUD value="770HP" label="AVG_OUTPUT" />
              <ConciergeHUD value="100%" label="CLIENT_SYNC" />
          </div>
      </section>

      {/* Showcase Grid */}
      <section style={{ marginTop: '10rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="al-mono" style={{ marginBottom: '1.5rem' }}>HIGH_FIDELITY_INVENTORY</div>
                  <h2 style={{ fontSize: '5.5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', color: 'white' }}>The <span style={{ color: 'var(--al-cyan)' }}>Showcase.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(226, 232, 240, 0.4)', lineHeight: 1.8 }}>
                  The definitive registry of high-performance automotive assets, synchronized across our global distribution network.
              </div>
          </div>
          
          <div className="al-showcase-grid">
            {assets.map((a, i) => (
              <LuxuryAssetCard key={i} {...a} />
            ))}
          </div>
      </section>

      {/* Final Launch CTA */}
      <section style={{ marginTop: '20rem', padding: '20rem 0', background: 'var(--al-carbon)', border: '1px solid var(--al-border)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="al-mono" style={{ marginBottom: '4rem' }}>PILOT_AUTHORIZATION_REQUIRED</div>
          <h2 style={{ fontSize: '9rem', fontWeight: 900, letterSpacing: '-6px', textTransform: 'uppercase', color: 'white', marginBottom: '6rem', lineHeight: 0.9 }}>
              Ready for <br/>
              <span style={{ color: 'var(--al-cyan)' }}>Launch?</span>
          </h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 8rem', color: 'rgba(226, 232, 240, 0.3)', fontSize: '1.5rem', lineHeight: 1.8 }}>
              Connect your pilot node to the Platinum Drive network and gain access to the world's most exclusive high-performance registry.
          </p>
          <button className="al-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.25rem' }}>
              Initialize Pilot Node
          </button>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
