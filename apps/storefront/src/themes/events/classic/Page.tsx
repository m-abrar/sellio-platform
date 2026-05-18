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
      <section className="ecl-hero" aria-labelledby="ecl-hero-title">
          <div style={{ width: '100px', height: '1px', background: 'var(--ecl-gold)', marginBottom: '4rem' }}></div>
          <h1 className="ecl-heading-xl" style={{ color: 'white' }} id="ecl-hero-title">
            Cultural <br/>
            <span className="ecl-italic">Heritage.</span>
          </h1>
          <p style={{ maxWidth: '750px', fontSize: '1.5rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginTop: '5rem', fontWeight: 300 }}>
              A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron.
          </p>
          <div style={{ marginTop: '7rem' }}>
            <button className="ec-btn-primary" style={{ background: 'white', color: 'var(--ecl-burgundy)' }} id="ecl-btn-explore" onClick={() => document.getElementById('ecl-exchange-section')?.scrollIntoView({ behavior: 'smooth' })}>Explore Repertoire</button>
          </div>
      </section>

      {/* Trust & Logistics Bar */}
      <section className="ecl-trust-bar" aria-label="Artistic Integrity Status">
          {['AUTHENTIC_INSTITUTIONAL_NODES', 'CURATED_ARTISTIC_PROTOCOL', 'GLOBAL_CULTURAL_EXCHANGE', 'PATRON_PRIVACY_SECURED'].map(logic => (
              <div key={logic} className="ecl-mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>{logic}</div>
          ))}
      </section>

      {/* Booking HUD Section */}
      <section className="ecl-section ecl-hud-section" aria-label="Live Statistics Dashboard">
          <BookingHUD label="VERIFIED_VENUES" value="42" />
          <BookingHUD label="INSTITUTIONAL_NODES" value="156" />
          <BookingHUD label="PATRON_SYNC_SPEED" value="0.01s" />
          <BookingHUD label="ARCHIVE_STABILITY" value="100%" />
      </section>

      {/* Repertoire Registry Section */}
      <section className="ecl-section" id="ecl-exchange-section" aria-labelledby="ecl-repertoire-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ecl-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL_CULTURAL_REGISTRY</div>
                  <h2 className="ecl-heading-xl" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }} id="ecl-repertoire-title">The <span className="ecl-italic">Repertoire.</span></h2>
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
      <section className="ecl-section ecl-patron-section" aria-labelledby="ecl-patron-title">
          <div style={{ padding: '8rem' }}>
              <div className="ecl-mono" style={{ marginBottom: '3rem' }}>PATRON_CIRCLE_PROTOCOL</div>
              <h2 className="ecl-heading-xl" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginBottom: '4rem' }} id="ecl-patron-title">The Patron's <br/><span className="ecl-italic">Circle.</span></h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
                  Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to premieres.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="ecl-patron-perks">
                  {['Priority_Box', 'Private_Galas', 'Voting_Rights', 'Archive_Access'].map(item => (
                      <div key={item} style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--ecl-burgundy)', letterSpacing: '2px' }}>◆ {item.toUpperCase()}</div>
                  ))}
              </div>
          </div>
          <div style={{ padding: '8rem', background: '#fdfdfb', borderLeft: '1px solid var(--ecl-stone)', height: '100%' }}>
              <h3 style={{ fontFamily: 'var(--ecl-serif)', fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--ecl-burgundy)' }}>Become a Patron.</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.4)', lineHeight: 2, marginBottom: '4rem' }}>
                  Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.
              </p>
              <button className="ecl-btn-primary" style={{ width: '100%', padding: '2rem' }} id="ecl-btn-patron-apply" onClick={() => alert('Patron circle application transmitted.')}>Request Institutional Access</button>
          </div>
      </section>
      
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
