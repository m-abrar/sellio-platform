'use client';
import React from 'react';
import { SpeakerCard, AgendaItem } from './components';

export default function Page() {
  const speakers = [
    { name: "Dr. Sarah Chen", role: "Chief AI Officer", company: "Nexus Logic", image: "/themes/events/corporate/1.webp" },
    { name: "Marcus Thorne", role: "VP of Engineering", company: "Scale Flow", image: "/themes/events/corporate/2.webp" },
    { name: "Elena Rodriguez", role: "Product Director", company: "Cloud Core", image: "/themes/events/corporate/3.webp" },
    { name: "James Wilson", role: "Security Lead", company: "Cyber Shield", image: "/themes/events/corporate/4.webp" },
  ];

  const agenda = [
    { time: "09:00 AM", title: "Opening Keynote: The Future of Distributed Intelligence", speaker: "Dr. Sarah Chen", track: "KEYNOTE" },
    { time: "11:00 AM", title: "Scaling High-Availability Microservices", speaker: "Marcus Thorne", track: "ENGINEERING" },
    { time: "01:30 PM", title: "Designing for Global User Adoption", speaker: "Elena Rodriguez", track: "PRODUCT" },
    { time: "03:30 PM", title: "Hardening the Digital Core", speaker: "James Wilson", track: "SECURITY" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="ec-hero" aria-labelledby="ecc-hero-title">
        <div className="ecc-mono" style={{ marginBottom: '2rem' }}>WORLD_ENGINEERING_SUMMIT // 2026</div>
        <h1 className="ecc-heading-xl" id="ecc-hero-title">
          The Future of <br/>
          <span style={{ color: 'var(--ecc-blue)' }}>Structural</span> Excellence.
        </h1>
        
        <div className="ec-hero-meta">
            <div>
                <div className="ecc-mono" style={{ color: 'var(--ecc-text-muted)', marginBottom: '0.5rem' }}>DATE</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ecc-obsidian)' }}>OCTOBER 14-16</div>
            </div>
            <div>
                <div className="ecc-mono" style={{ color: 'var(--ecc-text-muted)', marginBottom: '0.5rem' }}>LOCATION</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ecc-obsidian)' }}>SAN FRANCISCO, CA</div>
            </div>
            <div>
                <div className="ecc-mono" style={{ color: 'var(--ecc-text-muted)', marginBottom: '0.5rem' }}>CAPACITY</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--ecc-obsidian)' }}>5,000 DELEGATES</div>
            </div>
        </div>

        <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }} className="ecc-hero-buttons">
            <button className="ec-btn-primary" id="ecc-btn-explore" onClick={() => alert('Delegate registration portal active.')}>GET DELEGATE PASS</button>
            <button className="ec-btn-outline" id="ecc-btn-schedule" onClick={() => document.getElementById('ecc-agenda-section')?.scrollIntoView({ behavior: 'smooth' })}>VIEW FULL SCHEDULE</button>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="ecc-section" id="ecc-speakers-section" aria-labelledby="ecc-speakers-title">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div className="ecc-mono">FACULTY_SYNC // 2026</div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-speakers-title">Distinguished Speakers</h2>
        </div>
        
        <div className="ec-speaker-grid">
          {speakers.map((s, i) => (
            <SpeakerCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Agenda Section */}
      <section className="ecc-section" style={{ background: 'var(--ecc-bone)', borderRadius: 'var(--ecc-radius-md)' }} id="ecc-agenda-section" aria-labelledby="ecc-agenda-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <div>
                <div className="ecc-mono">CURATED_SCHEDULE // DAY_01</div>
                <h2 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-agenda-title">The Agenda</h2>
            </div>
            <p style={{ maxWidth: '400px', color: 'var(--ecc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 300 }}>
                Four tracks of intense technical exploration, ranging from core infrastructure to product design philosophy.
            </p>
        </div>

        <div className="ec-agenda-list">
          {agenda.map((item, i) => (
            <AgendaItem key={i} {...item} />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
            <button className="ec-btn-outline" id="ecc-btn-agenda-pdf" onClick={() => alert('Downloading technical agenda program PDF.')}>DOWNLOAD FULL PROGRAM PDF</button>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="ecc-section" style={{ textAlign: 'center' }} aria-labelledby="ecc-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(2.8rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', color: 'var(--ecc-obsidian)', lineHeight: 1.1 }} id="ecc-cta-title">
                  Secure Your <br/>
                  <span style={{ color: 'var(--ecc-blue)' }}>Seat in History.</span>
              </h2>
              <p style={{ color: 'var(--ecc-text-muted)', fontSize: '1.5rem', lineHeight: 1.6, marginBottom: '5rem', fontWeight: 300 }}>
                  Registration closes September 30. Join 5,000+ industry leaders for the most influential engineering event of the year.
              </p>
              <button className="ec-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.25rem' }} id="ecc-btn-cta-pass" onClick={() => alert('Delegate registration portal active.')}>
                  RESERVE MY FORUM PASS
              </button>
          </div>
      </section>
    </div>
  );
}
