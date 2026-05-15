'use client';
import React from 'react';
import { EstateCard, TrustIndicator } from './components';

export default function Page() {
  const estates = [
    { title: "The Pemberley Manor", price: "$14,200,000", location: "Hertfordshire, UK", year: "1815", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070" },
    { title: "Florentine Palazzo", price: "$22,500,000", location: "Florence, Italy", year: "1540", image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2070" },
    { title: "Colonial River Estate", price: "$8,900,000", location: "Virginia, USA", year: "1742", image: "https://images.unsplash.com/photo-1449156001533-cb39c8524490?q=80&w=2070" },
    { title: "Loire Valley Chateau", price: "$35,000,000", location: "Loire, France", year: "1620", image: "https://images.unsplash.com/photo-1505912469419-f76eb1424430?q=80&w=2070" },
    { title: "Scottish Highland Castle", price: "$12,400,000", location: "Inverness, Scotland", year: "1480", image: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=2069" },
    { title: "Bavarian Hunting Lodge", price: "$6,500,000", location: "Bavaria, Germany", year: "1895", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
  ];

  return (
    <div className="pc-section">
      {/* Editorial Hero */}
      <section className="pc-hero">
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '6px', color: 'var(--pc-sage)', marginBottom: '3rem' }}>CURATED_DISTRIBUTION_V8</div>
          <h1 className="pc-heading-xl">
            Legacy <br/>
            Ownership <br/>
            <span className="pc-italic" style={{ color: 'var(--pc-mahogany)' }}>Refined.</span>
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--pc-text-muted)', lineHeight: 2, maxWidth: '550px' }}>
            A curated distribution of the world's most significant historic estates. Preserving architectural heritage through institutional nodes and manorial verification.
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <button className="pc-btn-primary">Request Portfolio</button>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, borderBottom: '1px solid var(--pc-ink)', cursor: 'pointer' }}>READ_PROVENANCE</span>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" alt="Estate Hero" className="pc-hero-image" />
        </div>
      </section>

      {/* Trust Bar */}
      <div style={{ margin: '8rem 0' }}>
        <TrustIndicator />
      </div>

      {/* Estate Grid */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <h2 style={{ fontFamily: 'var(--pc-font-serif)', fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px' }}>The <span className="pc-italic">Collection.</span></h2>
            <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '0.9rem', color: 'var(--pc-text-muted)', lineHeight: 1.8 }}>
                Every property in our registry is evaluated by our board of curators for historical significance and structural integrity.
            </div>
        </div>
        
        <div className="pc-estate-grid">
          {estates.map((e, i) => (
            <EstateCard key={i} {...e} />
          ))}
        </div>
      </section>

      {/* Institutional Inquiry */}
      <section style={{ marginTop: '15rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10rem', alignItems: 'center' }}>
          <div>
              <div style={{ height: '800px', background: 'white', border: '1px solid var(--pc-border)', padding: '2rem' }}>
                <img src="https://images.unsplash.com/photo-1449156001533-cb39c8524490?q=80&w=2070" alt="Registry Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
          </div>
          <div>
              <div className="pc-serif" style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--pc-mahogany)', marginBottom: '2rem' }}>The Heritage Registry</div>
              <h2 className="pc-heading-xl" style={{ fontSize: '5rem', marginBottom: '4rem' }}>Institutional <br/>Inquiry.</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--pc-text-muted)', lineHeight: 2, marginBottom: '5rem' }}>
                  Our curators are currently evaluating select properties for inclusion in the 2026 global registry. Submit your provenance for review by our architectural board.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {['Manorial Rights Verification', 'Historical Archival Access', 'Institutional Registry Node'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                          <span style={{ fontSize: '1.5rem', color: 'var(--pc-sage)' }}>❦</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '2px' }}>{item.toUpperCase()}</span>
                      </div>
                  ))}
              </div>

              <button className="pc-btn-primary" style={{ marginTop: '6rem', width: '100%' }}>
                  Submit Provenance Node
              </button>
          </div>
      </section>
    </div>
  );
}
