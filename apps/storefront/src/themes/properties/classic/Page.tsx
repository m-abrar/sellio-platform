
import React from 'react';
import { ClassicEstateCard } from './components';

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
    <div>
      {/* Hero Section */}
      <section className="heritage-hero">
          <div style={{ padding: '4rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid var(--classic-mahogany)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--classic-sage)', letterSpacing: '4px', marginBottom: '2rem', fontWeight: 700 }}>ESTABLISHED_REPRESENTATION</div>
              <h1>Legacy <br/>Ownership.</h1>
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', fontStyle: 'italic', color: '#444', lineHeight: 1.8, marginBottom: '4rem' }}>
                  A curated distribution of the world's most significant historic estates. Preserving architectural heritage through institutional nodes.
              </p>
              <button style={{ padding: '1.5rem 4rem', background: 'var(--classic-mahogany)', color: 'white', border: 'none', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '0.9rem', fontStyle: 'italic' }}>
                  REQUEST_PORTFOLIO
              </button>
          </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '3rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafaf9', color: '#450a0a', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px', fontFamily: 'var(--font-serif)', borderBottom: '1px solid #e7e5e4' }}>
          <span>HISTORIC_PRESERVATION_CERTIFIED</span>
          <span>AUTHENTIC_MANORIAL_RECORDS</span>
          <span>GLOBAL_HERITAGE_SYNC</span>
          <span>INSTITUTIONAL_REGISTRY_NODE</span>
      </section>

      {/* Estate Grid */}
      <section className="estate-grid">
          {estates.map((e, i) => (
              <ClassicEstateCard key={i} {...e} />
          ))}
      </section>

      {/* Institutional CTA */}
      <section style={{ padding: '15rem 6%', background: '#fff', borderTop: '1px solid #eee', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 900, marginBottom: '3rem', fontStyle: 'italic' }}>The Heritage <br/>Registry.</h2>
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  Join an exclusive node of estate holders and historians. Our registry ensures the long-term preservation and distribution of historic assets through the Sellio Heritage protocol.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                  {['Manorial Rights Verification', 'Historical Archival Access', 'Restoration Grant Nodes', 'Private Estate Galas'].map(item => (
                      <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--classic-mahogany)' }}>
                          <span style={{ color: 'var(--classic-sage)' }}>❦</span> {item.toUpperCase()}
                      </li>
                  ))}
              </ul>
          </div>
          <div style={{ padding: '6rem', border: '2px solid var(--classic-mahogany)', background: 'var(--classic-white)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1.5rem', left: '-1.5rem', width: '60px', height: '60px', background: 'var(--classic-mahogany)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Institutional Inquiry.</h3>
              <p style={{ color: '#999', lineHeight: 2, marginBottom: '3rem' }}>
                  Our curators are currently evaluating select properties for inclusion in the 2026 registry. Submit your provenance for review.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: 'var(--classic-mahogany)', color: 'white', border: 'none', fontWeight: 900, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                  SUBMIT_PROVENANCE_NODE
              </button>
          </div>
      </section>
    </div>
  );
}
