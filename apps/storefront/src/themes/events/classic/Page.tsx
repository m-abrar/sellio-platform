'use client';
import React from 'react';
import { OccasionCard, BookingHUD } from './components';

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
    <div className="events-classic-theme">
      {/* Cinematic Cultural Hero */}
      <section className="ec-hero">
          <div style={{ width: '100px', height: '1px', background: 'var(--ec-gold)', marginBottom: '4rem' }}></div>
          <h1 className="ec-heading-xl" style={{ color: 'white' }}>
            Cultural <br/>
            <span className="ec-italic">Heritage.</span>
          </h1>
          <p style={{ maxWidth: '750px', fontSize: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginTop: '5rem', fontWeight: 300 }}>
              A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron.
          </p>
          <div style={{ marginTop: '7rem' }}>
            <button className="ec-btn-primary" style={{ background: 'white', color: 'var(--ec-burgundy)' }}>Explore Repertoire</button>
          </div>
      </section>

      {/* Trust & Logistics Bar */}
      <div style={{ padding: '4rem 8%', background: 'var(--ec-stone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          {['AUTHENTIC_INSTITUTIONAL_NODES', 'CURATED_ARTISTIC_PROTOCOL', 'GLOBAL_CULTURAL_EXCHANGE', 'PATRON_PRIVACY_SECURED'].map(logic => (
              <div key={logic} className="ec-mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>{logic}</div>
          ))}
      </div>

      {/* Booking HUD Section */}
      <section className="ec-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', borderBottom: '1px solid var(--ec-stone)' }}>
          <BookingHUD label="VERIFIED_VENUES" value="42" />
          <BookingHUD label="INSTITUTIONAL_NODES" value="156" />
          <BookingHUD label="PATRON_SYNC_SPEED" value="0.01s" />
          <BookingHUD label="ARCHIVE_STABILITY" value="100%" />
      </section>

      {/* Repertoire Registry Section */}
      <section className="ec-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ec-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL_CULTURAL_REGISTRY</div>
                  <h2 className="ec-heading-xl" style={{ fontSize: '6rem' }}>The <span className="ec-italic">Repertoire.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes performance availability from the world's most significant institutional nodes.
              </div>
          </div>
          
          <div className="ec-repertoire-grid">
            {events.map((e, i) => (
              <OccasionCard key={i} {...e} />
            ))}
          </div>
      </section>

      {/* Institutional / Patron Section */}
      <section className="ec-section" style={{ background: 'white', border: '1px solid var(--ec-stone)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15rem', alignItems: 'center', marginBottom: '10rem' }}>
          <div style={{ padding: '8rem' }}>
              <div className="ec-mono" style={{ marginBottom: '3rem' }}>PATRON_CIRCLE_PROTOCOL</div>
              <h2 className="ec-heading-xl" style={{ fontSize: '5rem', marginBottom: '4rem' }}>The Patron's <br/><span className="ec-italic">Circle.</span></h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '6rem' }}>
                  Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to premieres.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                  {['Priority_Box', 'Private_Galas', 'Voting_Rights', 'Archive_Access'].map(item => (
                      <div key={item} style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--ec-burgundy)', letterSpacing: '2px' }}>◆ {item.toUpperCase()}</div>
                  ))}
              </div>
          </div>
          <div style={{ padding: '8rem', background: 'var(--ec-ivory)', borderLeft: '1px solid var(--ec-stone)', height: '100%' }}>
              <h3 style={{ fontFamily: 'var(--ec-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Become a Patron.</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '4rem' }}>
                  Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.
              </p>
              <button className="ec-btn-primary" style={{ width: '100%', padding: '2rem' }}>Request Institutional Access</button>
          </div>
      </section>
      
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
