
import React from 'react';
import { ClassicAdCard } from './components';

export default function Page() {
  const listings = [
    { title: "The Sovereign Estate", price: "$4,200,000", location: "Hertfordshire", category: "Property", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070" },
    { title: "1965 Vintage Roadster", price: "$85,000", location: "London Node", category: "Motors", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070" },
    { title: "Senior Curatorial Node", price: "£65,000 / yr", location: "Museum District", category: "Careers", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070" },
    { title: "Antique Mahogany Desk", price: "£1,200", location: "East End", category: "General", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2070" },
    { title: "Central Office Suite", price: "£4,500 / mo", location: "Financial Core", category: "Property", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069" },
    { title: "2024 Luxury Sedan", price: "£55,000", location: "West Side", category: "Motors", image: "https://images.unsplash.com/photo-1542362567-b058c02b0132?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="uni-heritage-hero">
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--uni-gold)', letterSpacing: '4px', marginBottom: '2rem', fontWeight: 700 }}>ESTABLISHED_REPRESENTATION</div>
          <h1>Public <br/>Notices.</h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', color: '#666', lineHeight: 1.8, marginBottom: '5rem' }}>
              The authoritative heritage exchange for the discerning node. A tradition of excellence in multi-category distribution.
          </p>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center' }}>
              <button style={{ padding: '1.5rem 4rem', background: 'var(--uni-navy)', color: 'white', border: 'none', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '0.9rem' }}>VIEW_THE_GAZETTE</button>
              <button style={{ padding: '1.5rem 4rem', background: 'white', color: 'var(--uni-navy)', border: '1px solid var(--uni-navy)', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '0.9rem' }}>NODAL_HISTORY</button>
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafaf9', color: '#1e1b4b', fontFamily: 'var(--font-serif)', fontSize: '0.8rem', borderBottom: '1px solid #e7e5e4', fontWeight: 800, letterSpacing: '2px' }}>
          <span>ESTABLISHED_MCMXCIX</span>
          <span>AUTHENTIC_DISTRIBUTION_NODE</span>
          <span>VERIFIED_BY_GAZETTE</span>
          <span>GLOBAL_REACH_PROTOCOL</span>
      </section>

      {/* Grid */}
      <section className="classic-ad-grid">
          {listings.map((item, i) => (
              <ClassicAdCard key={i} {...item} />
          ))}
      </section>

      {/* Traditional CTA */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', background: '#fff' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4.5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2px' }}>Join the <br/>Legacy.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 5rem', fontSize: '1.25rem', color: '#666', lineHeight: 2 }}>
              Our heritage nodes are reserved for those who value tradition and reliability. Connect your institution to the Sellio Gazette network today.
          </p>
          <button style={{ padding: '2rem 6rem', background: 'var(--uni-navy)', color: 'white', border: 'none', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1rem' }}>
              APPLY_FOR_MEMBERSHIP
          </button>
      </section>
    </div>
  );
}
