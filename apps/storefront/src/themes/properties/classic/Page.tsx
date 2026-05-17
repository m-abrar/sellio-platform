
'use client';
import React from 'react';
import { EstateCard, FilterSidebar } from './components';

export default function Page() {
  const estates = [
    { title: "The Pemberley Manor", price: "$14,200,000", location: "Hertfordshire, UK", year: "1815", image: "/themes/properties/classic/1.webp", isFeatured: true },
    { title: "Florentine Palazzo", price: "$22,500,000", location: "Florence, Italy", year: "1540", image: "/themes/properties/classic/2.webp" },
    { title: "Colonial River Estate", price: "$8,900,000", location: "Virginia, USA", year: "1742", image: "/themes/properties/classic/3.webp" },
    { title: "Loire Valley Chateau", price: "$35,000,000", location: "Loire, France", year: "1620", image: "/themes/properties/classic/4.webp", isFeatured: true },
    { title: "Scottish Highland Castle", price: "$12,400,000", location: "Inverness, Scotland", year: "1480", image: "/themes/properties/classic/5.webp" },
    { title: "Bavarian Hunting Lodge", price: "$6,500,000", location: "Bavaria, Germany", year: "1895", image: "/themes/properties/classic/6.webp" },
  ];

  return (
    <div className="pc-container-base">
      {/* Cinematic Parallax Hero */}
      <section className="pc-hero">
        <div className="pc-hero-bg">
          <img src="/themes/properties/classic/7.webp" alt="Classic Estate" />
        </div>
        
        <div className="pc-hero-card">
          <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '2.5rem', opacity: 0.4 }}>Global Registry // Vol. 2026</div>
          <h1 className="pc-hero-title">
            The <span className="pc-italic" style={{ fontWeight: 400 }}>Heritage</span> <br/> 
            Registry.
          </h1>
          <p className="pc-hero-desc">
            A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and manorial integrity.
          </p>
          
          <div style={{ background: 'var(--pc-border)', padding: '1px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }} className="pc-search-bar">
            <div className="pc-search-inner" style={{ flex: 1, background: 'white', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', opacity: 0.4, letterSpacing: '2px' }}>SEARCH</span>
                <input 
                    type="text" 
                    placeholder="By Region, Era..." 
                    style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'var(--pc-font-body)', fontSize: '1rem' }} 
                />
            </div>
            <button className="pc-btn-primary" style={{ background: 'var(--pc-teal)', color: 'white' }}>
                DISCOVER
            </button>
          </div>
        </div>
      </section>

      {/* Orchestrated Collection Grid */}
      <section className="pc-section">
        <div className="pc-main-grid">
          <FilterSidebar />
          
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', gap: '2rem' }}>
                <div>
                    <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '1.25rem', opacity: 0.4 }}>Collection Node // 01</div>
                    <h2 className="pc-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}>
                        The <span className="pc-italic" style={{ fontWeight: 400 }}>Collection.</span>
                    </h2>
                </div>
                <div style={{ textAlign: 'right', maxWidth: '350px', fontSize: '0.9rem', color: 'var(--pc-text-muted)', lineHeight: 1.8 }}>
                    Current distribution includes verified manorial rights and significant historical provenance. 
                </div>
            </div>

            <div className="pc-estate-grid">
              {estates.map((e, i) => (
                <EstateCard key={i} {...e} />
              ))}
            </div>
            
            <div style={{ marginTop: '8rem', textAlign: 'center' }}>
                <button className="pc-btn-primary" style={{ background: 'transparent', border: '1px solid var(--pc-teal)', color: 'var(--pc-teal)' }}>
                    LOAD MORE PROVENANCE
                </button>
            </div>
          </div>
        </div>
      </section>

      <div className="pc-divider" />

      {/* Editorial Testimonials */}
      <section className="pc-section" style={{ paddingBottom: '12rem' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                  <div className="pc-caps" style={{ color: 'var(--pc-teal)', marginBottom: '1.5rem', opacity: 0.4 }}>Patron Feedback</div>
                  <h3 className="pc-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}>
                    Voices of <span className="pc-italic" style={{ fontWeight: 400 }}>Trust.</span>
                  </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="pc-testimonials-grid">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @media (min-width: 768px) {
                      .pc-testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (min-width: 1200px) {
                      .pc-testimonials-grid { grid-template-columns: repeat(3, 1fr) !important; }
                    }
                  ` }} />
                  {[
                      { quote: "Estate & Heritage turned a daunting task into a delightful journey. Their market knowledge is unmatched.", client: "A. Bennett", title: "Estate Patron" },
                      { quote: "Personalized service and fantastic negotiation. Highly recommend for classic property sales.", client: "M. Chen", title: "Institutional Lead" },
                      { quote: "They understand the nuances of classic architecture and helped us secure a property of historical significance.", client: "T. Davis", title: "Heritage Collector" }
                  ].map((t, i) => (
                      <div key={i} style={{ padding: '2.5rem', background: 'var(--pc-white)', border: '1px solid var(--pc-border)', position: 'relative' }}>
                          <p style={{ fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.7, color: 'var(--pc-teal)' }}>"{t.quote}"</p>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--pc-teal)' }}>{t.client.toUpperCase()}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--pc-text-muted)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.title}</div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}
