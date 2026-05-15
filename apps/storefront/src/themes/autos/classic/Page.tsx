'use client';
import React from 'react';
import { VintageCarCard, CollectorMetricsHUD } from './components';

export default function Page() {
  const inventory = [
    { name: "1964 Porsche 911 Carrera", price: "$124,900", km: "1,200", transmission: "MANUAL", fuel: "PETROL", year: 1964, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070", isCertified: true },
    { name: "1972 BMW M1 Procar", price: "$89,500", km: "12,400", transmission: "MANUAL", fuel: "PETROL", year: 1972, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070", isCertified: true },
    { name: "1984 Audi Quattro S1", price: "$105,000", km: "24,000", transmission: "MANUAL", fuel: "PETROL", year: 1984, image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2070" },
    { name: "1990 Mercedes-Benz 190E", price: "$165,000", km: "35,000", transmission: "AUTO", fuel: "PETROL", year: 1990, image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2070", isCertified: true },
    { name: "1978 Range Rover Classic", price: "$98,000", km: "8,500", transmission: "MANUAL", fuel: "PETROL", year: 1978, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071" },
    { name: "1962 Jaguar E-Type", price: "$220,000", km: "18,000", transmission: "MANUAL", fuel: "PETROL", year: 1962, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000", isCertified: true },
  ];

  return (
    <div className="ac-section">
      {/* Heritage Hero */}
      <section className="ac-hero">
        <div>
          <div className="ac-mono" style={{ marginBottom: '2.5rem' }}>HERITAGE_MOTORS_ARCHIVE_V8</div>
          <h1 className="ac-heading-xl">
            The <br/>
            Art of the <br/>
            <span className="ac-italic" style={{ color: 'var(--ac-tan)' }}>Machine.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.5rem', color: 'var(--ac-text-dim)', lineHeight: 1.6, maxWidth: '600px', fontWeight: 300 }}>
            A curated high-fidelity archive of the world's most significant automotive assets. Synchronizing historical provenance with artisan restoration nodes.
          </p>
          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <button className="ac-btn-primary">Explore Archive</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--ac-green)', 
                color: 'var(--ac-green)', 
                padding: '1.5rem 4rem', 
                borderRadius: '2px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontFamily: 'var(--ac-font-serif)'
            }}>
                Request_Appraisal
            </button>
          </div>
        </div>
        <div className="ac-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" alt="Classic Porsche" className="ac-hero-img" />
          
          <div style={{ position: 'absolute', bottom: '-4rem', left: '-4rem', background: 'var(--ac-green)', color: 'white', padding: '4rem', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--ac-font-serif)' }}>1964</div>
              <div className="ac-mono" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>YEAR_OF_ORIGIN</div>
          </div>
        </div>
      </section>

      {/* Collector Metrics Bar */}
      <div style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', borderTop: '1px solid rgba(0, 66, 37, 0.1)', marginTop: '10rem' }}>
          <CollectorMetricsHUD value="842" label="VERIFIED_ARCHIVES" />
          <CollectorMetricsHUD value="12" label="ARTISAN_ATELIERS" />
          <CollectorMetricsHUD value="$1.2B" label="ASSET_TURNOVER" />
          <CollectorMetricsHUD value="100%" label="PROVENANCE_SYNC" />
      </div>

      {/* Inventory Registry Section */}
      <section style={{ marginTop: '15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ac-mono" style={{ marginBottom: '1.5rem' }}>COLLECTOR_INVENTORY</div>
                  <h2 style={{ fontFamily: 'var(--ac-font-serif)', fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', color: 'var(--ac-green)' }}>The <span className="ac-italic">Archive.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--ac-text-dim)', lineHeight: 1.8 }}>
                  Our unified protocol ensures every heritage asset is verified and synchronized with historical provenance metadata.
              </div>
          </div>
          
          <div className="ac-inventory-grid">
            {inventory.map((car, i) => (
              <VintageCarCard key={i} {...car} />
            ))}
          </div>
      </section>

      {/* Restoration / Philosophy Section */}
      <section style={{ marginTop: '20rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15rem', alignItems: 'center' }}>
          <div>
              <div className="ac-mono" style={{ marginBottom: '3rem' }}>ARTISAN_RESTORATION_PROTOCOL</div>
              <h2 className="ac-heading-xl" style={{ fontSize: '6rem', marginBottom: '4rem' }}>Beyond the <br/><span className="ac-italic">Restoration.</span></h2>
              <p style={{ fontSize: '1.5rem', color: 'var(--ac-text-dim)', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
                  We do not just restore the machine; we preserve the provenance. Every bolt, every seam, and every historical record is synchronized into the global heritage node.
              </p>
              <div style={{ display: 'flex', gap: '6rem' }}>
                  <div>
                      <div style={{ fontSize: '4rem', fontFamily: 'var(--ac-font-serif)', fontWeight: 900, color: 'var(--ac-tan)' }}>100%</div>
                      <div className="ac-mono" style={{ fontSize: '0.6rem' }}>ORIGINAL_PARTS_SYNC</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '4rem', fontFamily: 'var(--ac-font-serif)', fontWeight: 900, color: 'var(--ac-tan)' }}>24/7</div>
                      <div className="ac-mono" style={{ fontSize: '0.6rem' }}>CURATOR_SUPPORT</div>
                  </div>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '800px', background: 'var(--ac-green)', padding: '2rem' }}>
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000" alt="Artisan Restoration" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(30%) contrast(1.1)' }} />
              </div>
              <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', background: 'var(--ac-tan)', color: 'white', width: '300px', height: '300px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem', fontWeight: 900, fontSize: '1.25rem', fontFamily: 'var(--ac-font-serif)', fontStyle: 'italic' }}>
                  AUTHENTICATED_HERITAGE_SYNC
              </div>
          </div>
      </section>

      {/* Final Space */}
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
