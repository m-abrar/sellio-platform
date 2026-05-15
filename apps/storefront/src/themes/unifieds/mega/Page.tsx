
import React from 'react';
import { HeavyweightGrid, MassiveSyncBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="mega-hero">
          <div style={{ maxWidth: '1200px' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--mega-orange)', letterSpacing: '10px', marginBottom: '3rem', fontWeight: 900 }}>HEAVYWEIGHT_LOGIC_ACTIVE</div>
              <h1>The <span>Heavyweight</span> <br/>Grid.</h1>
              <p style={{ maxWidth: '800px', fontSize: '1.5rem', color: '#888', lineHeight: 1.8, marginBottom: '6rem' }}>
                  The world's most powerful high-fidelity distribution node. Precision structural engineering for multi-vertical commerce at massive scale.
              </p>
              <div style={{ display: 'flex', gap: '3rem' }}>
                  <button className="mega-btn-primary">INITIALIZE_MEGA_SYNC</button>
                  <button style={{ background: 'transparent', border: '2px solid #333', color: 'white', padding: '1.5rem 5rem', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}>INFRASTRUCTURE_SPEC</button>
              </div>
          </div>
      </section>

      {/* Massive Sync Bar */}
      <MassiveSyncBar />

      {/* Heavyweight Grid Section */}
      <HeavyweightGrid />

      {/* Mid-Section: Industrial Strength */}
      <section style={{ padding: '15rem 5%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10rem', alignItems: 'center', background: '#f5f5f5' }}>
          <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--mega-orange)', letterSpacing: '6px' }}>INDUSTRIAL_STRENGTH</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 900, marginTop: '2rem', marginBottom: '3rem', letterSpacing: '-2px' }}>Structural <br/>Authority.</h2>
              <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  The Mega Grid protocol is built for high-density data distribution. Every node is reinforced with multi-layer redundancy, ensuring that your storefront remains stable under any operational volume.
              </p>
              <div style={{ display: 'flex', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--mega-charcoal)' }}>8ms</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#aaa', letterSpacing: '2px' }}>CORE_LATENCY</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--mega-charcoal)' }}>99.9%</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#aaa', letterSpacing: '2px' }}>NODAL_UPTIME</div>
                  </div>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '600px', background: 'white', border: '2px solid var(--mega-charcoal)', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" alt="Industrial Architecture" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '150px', height: '150px', background: 'var(--mega-orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                  REINFORCED
              </div>
          </div>
      </section>

      {/* Authority Section */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', background: 'white' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-4px' }}>Authorize <br/>Distribution.</h2>
              <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your core node to the Mega Grid and join the world's most robust high-fidelity distribution network. Institutional performance, guaranteed.
              </p>
              <button className="mega-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.5rem' }}>INITIALIZE_HEAVYWEIGHT_NODE</button>
          </div>
      </section>
    </div>
  );
}
