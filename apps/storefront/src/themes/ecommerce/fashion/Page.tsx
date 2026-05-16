'use client';
import React from 'react';
import { EditorialLookCard, TrendHUD } from './components';

export default function Page() {
  const collection = [
    { name: "Silk Drape Blazer", price: "$1,250", image: "https://images.unsplash.com/photo-1594932224010-756707729517?q=80&w=2000" },
    { name: "Monolith Chelsea Boots", price: "$850", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=2000" },
    { name: "Satin Evening Gown", price: "$2,400", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000" },
    { name: "Oversized Cashmere Coat", price: "$3,200", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000" },
    { name: "Textured Knit Sweater", price: "$450", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000" },
    { name: "Pleated Architecture Skirt", price: "$980", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000" },
  ];

  return (
    <div className="ef-section">
      {/* Editorial Fashion Hero */}
      <section className="ef-hero">
        <div className="ef-hero-main">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" alt="Main Editorial" className="ef-hero-img" />
          <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', color: 'white' }}>
              <div className="ef-mono" style={{ marginBottom: '1.5rem', color: 'white' }}>FALL_WINTER_2026_COLLECTION</div>
              <h1 className="ef-heading-xl" style={{ color: 'white' }}>Silent <br/><span className="ef-italic">Luxury.</span></h1>
              <div style={{ marginTop: '4rem' }}>
                  <button className="ef-btn-primary" style={{ background: 'white', color: 'black' }}>Explore Editorial</button>
              </div>
          </div>
        </div>
        <div className="ef-hero-side">
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" alt="Side Look 1" className="ef-hero-img" />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                    <div className="ef-mono" style={{ fontSize: '0.55rem', color: 'white' }}>ACCESSORIES_01</div>
                </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2071" alt="Side Look 2" className="ef-hero-img" />
                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                    <div className="ef-mono" style={{ fontSize: '0.55rem', color: 'white' }}>READY_TO_WEAR_04</div>
                </div>
            </div>
        </div>
      </section>

      {/* Trend HUD Section */}
      <section style={{ padding: '10rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', borderBottom: '1px solid var(--ef-border)', marginBottom: '12rem' }}>
          <TrendHUD label="ACTIVE_CURATIONS" value="124" />
          <TrendHUD label="ATELIER_NODES" value="08" />
          <TrendHUD label="SILHOUETTE_PRECISION" value="100%" />
          <TrendHUD label="GLOBAL_SYNC" value="STABLE" />
      </section>

      {/* Lookbook Registry Section */}
      <section>
          <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
              <div className="ef-mono" style={{ marginBottom: '2rem' }}>THE_AUTUMN_CAPSULE_V8</div>
              <h2 className="ef-heading-xl" style={{ fontSize: '6rem' }}>Lookbook <span className="ef-italic">26.</span></h2>
          </div>
          
          <div className="ef-lookbook-grid">
            {collection.map((item, i) => (
              <EditorialLookCard key={i} {...item} />
            ))}
          </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 10%', background: 'var(--ef-oyster)', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--ef-serif)', fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '4rem' }}>
                  "We do not build garments. We architect confidence through the precision of silhouette and the purity of material."
              </h2>
              <div style={{ width: '80px', height: '1px', background: 'var(--ef-champagne)', margin: '0 auto 4rem' }}></div>
              <div className="ef-mono" style={{ opacity: 0.5 }}>ATELIER_PHILOSOPHY_SYNC</div>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
