import React from 'react';
import { LotCard } from './components';

export default function CuratedCollectionPage() {
  const lots = [
    { lotNo: "001", title: "Rare Emerald Cut 14ct Diamond", estimate: "$450,000 - $600,000", image: "https://images.unsplash.com/photo-1573408302382-7023315c267a?q=80&w=2070" },
    { lotNo: "002", title: "Abstract Expressionist Oil on Canvas", estimate: "$1.2M - $1.8M", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2070" },
    { lotNo: "003", title: "Vintage Patek Philippe Ref. 2499", estimate: "$800,000 - $1.2M", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070" },
    { lotNo: "004", title: "Imperial Jade Sculpture (18th Century)", estimate: "$250,000 - $400,000", image: "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?q=80&w=2070" },
    { lotNo: "005", title: "Rare 1960s Leica M3 Black Paint", estimate: "$45,000 - $60,000", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070" },
    { lotNo: "006", title: "Art Deco Cartier Panther Brooch", estimate: "$180,000 - $250,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070" },
  ];

  return (
    <div>
      <section className="curated-hero">
        <div style={{ width: '80px', height: '1px', background: 'var(--color-gold)', marginBottom: '3rem', position: 'absolute', top: '6rem' }}></div>
        <h1>The Summer<br/>Fine Art & High<br/>Jewelry Auction.</h1>
        <div style={{ position: 'absolute', right: '6rem', bottom: '6rem', textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', letterSpacing: '4px', opacity: 0.7, marginBottom: '1rem' }}>EXHIBITION_024</div>
          <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Sotheby's Partnership</div>
        </div>
      </section>

      <section style={{ padding: '6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400 }}>Current Lots</h2>
          <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>6 of 142 items shown</p>
        </div>
        <div style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px' }}>
          <span style={{ borderBottom: '1px solid var(--color-gold)', paddingBottom: '0.5rem' }}>FINE_JEWELRY</span>
          <span>TIMEPIECES</span>
          <span>CONTEMPORARY_ART</span>
        </div>
      </section>

      <div className="lot-grid">
        {lots.map((lot, i) => (
          <LotCard key={i} {...lot} />
        ))}
      </div>

      <section style={{ padding: '10rem 6rem', textAlign: 'center', background: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '100px', height: '1px', background: 'var(--color-gold)', margin: '0 auto 4rem' }}></div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 400, marginBottom: '2rem' }}>A Sanctuary for High-Fidelity.</h2>
          <p style={{ lineHeight: '2', opacity: 0.6, fontSize: '1.2rem', marginBottom: '4rem' }}>
            Our global network of vaults and appraisers ensure that every lot in our collection meets the highest standards of provenance and authenticity.
          </p>
          <button style={{ 
            background: 'var(--color-emerald)', 
            color: 'white', 
            padding: '1.5rem 4rem', 
            border: 'none', 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1rem', 
            letterSpacing: '3px',
            cursor: 'pointer'
          }}>
            REQUEST_CONSIGNMENT_VALUATION
          </button>
        </div>
      </section>
    </div>
  );
}
