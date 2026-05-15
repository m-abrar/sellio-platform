
import React from 'react';
import { CulturalEventCard } from './components';

export default function Page() {
  const events = [
    { title: "La Traviata", location: "Royal Opera House", date: "SEPTEMBER_12_2026", category: "Opera" },
    { title: "Symphony No. 9", location: "The Grand Concert Hall", date: "OCTOBER_05_2026", category: "Classical" },
    { title: "Modernist Retrospective", location: "National Art Gallery", date: "NOVEMBER_15_2026", category: "Exhibition" },
    { title: "Hamlet: A New Interpretation", location: "Old Globe Theatre", date: "DECEMBER_01_2026", category: "Theatre" },
    { title: "The Nutcracker", location: "Plaza Ballet Center", date: "DECEMBER_24_2026", category: "Ballet" },
    { title: "Jazz in the Square", location: "Heritage Garden", date: "JANUARY_10_2027", category: "Live Music" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="classic-hero">
          <div className="classic-hero-sep"></div>
          <h1>Cultural <br/>Heritage.</h1>
          <p style={{ maxWidth: '600px', fontSize: '1.25rem', fontStyle: 'italic', opacity: 0.8, lineHeight: 1.8, marginBottom: '4rem' }}>
              A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron.
          </p>
          <button style={{ padding: '1.5rem 4rem', background: 'white', color: 'black', border: 'none', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '0.9rem', fontStyle: 'italic' }}>
              EXPLORE_REPERTOIRE
          </button>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '3rem 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5dc', color: '#7f1d1d', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px' }}>
          <span>AUTHENTIC_INSTITUTIONAL_NODES</span>
          <span>CURATED_ARTISTIC_PROTOCOL</span>
          <span>GLOBAL_CULTURAL_EXCHANGE</span>
          <span>PATRON_PRIVACY_SECURED</span>
      </section>

      {/* Cultural Grid */}
      <section className="cultural-grid">
          {events.map((e, i) => (
              <CulturalEventCard key={i} {...e} />
          ))}
      </section>

      {/* Institutional CTA */}
      <section style={{ padding: '15rem 6%', background: '#fff', borderTop: '1px solid #eee', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 900, marginBottom: '3rem', fontStyle: 'italic' }}>The Patron's <br/>Circle.</h2>
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to global premieres.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                  {['Priority Box Seating', 'Private Artists Galas', 'Institutional Voting Rights', 'Legacy Archive Access'].map(item => (
                      <li key={item} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--classic-burgundy)' }}>
                          <span style={{ color: 'var(--classic-gold)' }}>◆</span> {item.toUpperCase()}
                      </li>
                  ))}
              </ul>
          </div>
          <div style={{ padding: '6rem', border: '1px solid var(--classic-gold)', background: 'var(--classic-bg)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1rem', left: '-1rem', width: '50px', height: '50px', background: 'var(--classic-burgundy)' }}></div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Become a Patron.</h3>
              <p style={{ color: '#999', lineHeight: 2, marginBottom: '3rem' }}>
                  Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: 'var(--classic-burgundy)', color: 'white', border: 'none', fontWeight: 900, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                  REQUEST_INSTITUTIONAL_ACCESS
              </button>
          </div>
      </section>
    </div>
  );
}
